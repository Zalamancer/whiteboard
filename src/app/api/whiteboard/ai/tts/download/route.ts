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

  const tmpDir = path.join(os.tmpdir(), "whiteboard-tts");
  const filePath = path.join(tmpDir, filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);

  return new Response(buffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
