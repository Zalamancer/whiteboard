import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

const VALID_VOICES: Voice[] = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text, voice = "nova", speed = 1.0 } = body;

    if (!text || typeof text !== "string" || text.length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (text.length > 4096) {
      return NextResponse.json(
        { error: "Text too long (max 4096 chars)" },
        { status: 400 }
      );
    }

    const selectedVoice = VALID_VOICES.includes(voice as Voice) ? (voice as Voice) : "nova";

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: selectedVoice,
      input: text,
      speed: Math.max(0.25, Math.min(4.0, speed)),
      response_format: "mp3",
    });

    // Save to temp file
    const tmpDir = path.join(os.tmpdir(), "whiteboard-tts");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    const filename = `tts-${Date.now()}.mp3`;
    const filePath = path.join(tmpDir, filename);

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Estimate duration (rough: ~150 words/min for TTS)
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / 150) * 60 / speed;

    return NextResponse.json({
      audioUrl: `/api/ai/tts/download?file=${encodeURIComponent(filename)}`,
      duration: Math.round(estimatedDuration * 10) / 10,
      filename,
    });
  } catch (error) {
    console.error("[TTS] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "TTS failed" },
      { status: 500 }
    );
  }
}
