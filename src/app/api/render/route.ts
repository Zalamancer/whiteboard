import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";

// Dynamic imports to avoid loading heavy modules on every request
async function getRemotion() {
  const { bundle } = await import("@remotion/bundler");
  const { renderMedia, selectComposition } = await import("@remotion/renderer");
  return { bundle, renderMedia, selectComposition };
}

// Cache the bundle path so we only bundle once per server lifecycle
let bundleCachePath: string | null = null;
let bundlePromise: Promise<string> | null = null;

async function ensureBundle(): Promise<string> {
  if (bundleCachePath && fs.existsSync(bundleCachePath)) {
    return bundleCachePath;
  }

  if (bundlePromise) return bundlePromise;

  bundlePromise = (async () => {
    const { bundle } = await getRemotion();
    const entryPoint = path.join(process.cwd(), "src/remotion/index.ts");

    console.log("[Render] Bundling Remotion entry point...");
    const bundled = await bundle({
      entryPoint,
      webpackOverride: (config) => {
        // Add TypeScript path aliases to match our tsconfig
        config.resolve = {
          ...config.resolve,
          alias: {
            ...(config.resolve?.alias || {}),
            "@": path.join(process.cwd(), "src"),
          },
        };
        return config;
      },
    });
    console.log("[Render] Bundle complete:", bundled);
    bundleCachePath = bundled;
    bundlePromise = null;
    return bundled;
  })();

  return bundlePromise;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project,
      format = "mp4",
      resolution = "1080p",
      codec = "h264",
      quality,
    } = body;

    if (!project || !project.elements) {
      return NextResponse.json(
        { error: "Invalid project data" },
        { status: 400 }
      );
    }

    // Calculate total duration from project data
    const elementMax = project.elements.reduce(
      (max: number, el: { startFrame: number; durationFrames: number }) =>
        Math.max(max, el.startFrame + el.durationFrames),
      0
    );
    const audioMax = (project.audioTracks || []).reduce(
      (max: number, t: { startFrame: number; durationFrames: number }) =>
        Math.max(max, t.startFrame + t.durationFrames),
      0
    );
    const totalFrames = Math.max(elementMax, audioMax, 300);

    // Resolution mapping
    const resolutions: Record<string, { width: number; height: number }> = {
      "720p": { width: 1280, height: 720 },
      "1080p": { width: 1920, height: 1080 },
      "4k": { width: 3840, height: 2160 },
    };
    const res = resolutions[resolution] || resolutions["1080p"];

    // Create temp output path
    const tmpDir = path.join(os.tmpdir(), "whiteboard-renders");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    const ext = format === "webm" ? "webm" : "mp4";
    const outputPath = path.join(tmpDir, `render-${Date.now()}.${ext}`);

    // Encode a TransformStream for SSE progress
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const sendEvent = async (event: string, data: unknown) => {
      const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      await writer.write(encoder.encode(msg));
    };

    // Start the render in background
    (async () => {
      try {
        await sendEvent("status", { stage: "bundling", progress: 0 });

        const bundlePath = await ensureBundle();

        await sendEvent("status", {
          stage: "preparing",
          progress: 5,
        });

        const { renderMedia, selectComposition } = await getRemotion();

        // Select the composition with the project data as input props
        const composition = await selectComposition({
          serveUrl: bundlePath,
          id: "WhiteboardVideo",
          inputProps: {
            ...project,
            width: res.width,
            height: res.height,
          },
        });

        // Override composition dimensions and duration
        const compositionWithOverrides = {
          ...composition,
          width: res.width,
          height: res.height,
          durationInFrames: totalFrames,
          fps: project.fps || 30,
        };

        await sendEvent("status", {
          stage: "rendering",
          progress: 10,
          totalFrames,
        });

        await renderMedia({
          composition: compositionWithOverrides,
          serveUrl: bundlePath,
          codec: codec === "h265" ? "h265" : format === "webm" ? "vp8" : "h264",
          outputLocation: outputPath,
          inputProps: {
            ...project,
            width: res.width,
            height: res.height,
          },
          ...(quality !== undefined && format !== "webm"
            ? { crf: Math.round(51 - (quality / 100) * 41) }
            : {}),
          onProgress: async ({ progress }) => {
            const pct = Math.round(10 + progress * 85);
            await sendEvent("progress", {
              progress: pct,
              renderedFrames: Math.round(progress * totalFrames),
              totalFrames,
            });
          },
        });

        // Get file size
        const stats = fs.statSync(outputPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(1);

        await sendEvent("complete", {
          progress: 100,
          outputPath: path.basename(outputPath),
          fileSize: fileSizeMB,
        });
      } catch (error) {
        console.error("[Render] Error:", error);
        await sendEvent("error", {
          message:
            error instanceof Error ? error.message : "Unknown render error",
        });
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[Render] Request error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Request failed" },
      { status: 500 }
    );
  }
}
