import { NextRequest, NextResponse } from "next/server";
import { buildProjectFromScript } from "@/lib/ai/scene-builder";
import { parseSVGToPathData } from "@/lib/svg-utils";
import { getStyleDefinition, getAspectDimensions } from "@/lib/video-styles";
import type { VideoStyle, AspectRatio } from "@/store/types";
import fs from "fs";
import path from "path";

const ICONS_DIR = path.join(
  process.cwd(),
  "node_modules/@tabler/icons/icons/outline"
);

// Cache icon names list
let iconNamesCache: string[] | null = null;

function getIconNames(): string[] {
  if (iconNamesCache) return iconNamesCache;
  const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith(".svg"));
  iconNamesCache = files.map((f) => f.replace(".svg", ""));
  return iconNamesCache;
}

function getIconSVG(name: string): string | null {
  const filePath = path.join(ICONS_DIR, `${name}.svg`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { script, videoStyle: rawStyle, aspectRatio: rawRatio } = body;

    if (!script || !script.scenes) {
      return NextResponse.json(
        { error: "Script is required" },
        { status: 400 }
      );
    }

    const videoStyle: VideoStyle = rawStyle || "classic-whiteboard";
    const aspectRatio: AspectRatio = rawRatio || "16:9";
    const styleDef = getStyleDefinition(videoStyle);
    const dimensions = getAspectDimensions(aspectRatio);

    const iconNames = getIconNames();

    // Build the project layout from the script (style-aware)
    const { elements, cameraKeyframes, totalFrames, canvasWidth } =
      buildProjectFromScript(script, iconNames, videoStyle);

    // Fill in SVG path data for icon elements
    const resolvedElements = elements.map((el) => {
      if (el.type === "svg-path" && el.data.type === "svg-path") {
        const iconName = (el.data as unknown as { _iconName?: string })
          ._iconName;
        if (iconName) {
          const svg = getIconSVG(iconName);
          if (svg) {
            const pathData = parseSVGToPathData(svg);
            return {
              ...el,
              data: {
                ...pathData,
                // Remove the temporary _iconName
              },
            };
          }
        }
      }
      return el;
    });

    // Build complete project with style-aware defaults
    const project = {
      id: crypto.randomUUID(),
      name: script.title || "AI Generated Video",
      width: Math.max(dimensions.width, canvasWidth),
      height: dimensions.height,
      fps: 30,
      backgroundColor: styleDef.backgroundColor,
      videoStyle,
      aspectRatio,
      elements: resolvedElements,
      cameraKeyframes,
      audioTracks: [],
    };

    return NextResponse.json({ project, totalFrames });
  } catch (error) {
    console.error("[AI Project] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Project generation failed",
      },
      { status: 500 }
    );
  }
}

// Canvas width now comes from getAspectDimensions()
