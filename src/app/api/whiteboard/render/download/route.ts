import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("file");

  if (!filename || filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const tmpDir = path.join(os.tmpdir(), "whiteboard-renders");
  const filePath = path.join(tmpDir, filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileStream = fs.createReadStream(filePath);

  const ext = path.extname(filename).toLowerCase();
  const contentType =
    ext === ".webm" ? "video/webm" : "video/mp4";

  // Convert Node.js stream to Web ReadableStream
  const webStream = new ReadableStream({
    start(controller) {
      fileStream.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      fileStream.on("end", () => {
        controller.close();
        // Clean up the file after download
        setTimeout(() => {
          try {
            fs.unlinkSync(filePath);
          } catch {
            // Already cleaned up
          }
        }, 5000);
      });
      fileStream.on("error", (err) => {
        controller.error(err);
      });
    },
  });

  return new Response(webStream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": stat.size.toString(),
      "Content-Disposition": `attachment; filename="whiteboard-export${ext}"`,
    },
  });
}
