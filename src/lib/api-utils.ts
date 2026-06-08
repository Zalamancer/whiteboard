import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Standard API response helpers
// ---------------------------------------------------------------------------

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

const ALLOWED_RESOLUTIONS = ["720p", "1080p", "4k"] as const;
const ALLOWED_CODECS = ["h264", "h265", "vp8"] as const;
const ALLOWED_FORMATS = ["mp4", "webm", "mp4-h265"] as const;

export function validateRenderInput(body: Record<string, unknown>) {
  if (!body.project || typeof body.project !== "object") {
    return "Missing or invalid project data";
  }

  const project = body.project as Record<string, unknown>;
  if (!Array.isArray(project.elements)) {
    return "Project must have an elements array";
  }

  if (body.resolution && !ALLOWED_RESOLUTIONS.includes(body.resolution as typeof ALLOWED_RESOLUTIONS[number])) {
    return `Invalid resolution. Allowed: ${ALLOWED_RESOLUTIONS.join(", ")}`;
  }

  if (body.codec && !ALLOWED_CODECS.includes(body.codec as typeof ALLOWED_CODECS[number])) {
    return `Invalid codec. Allowed: ${ALLOWED_CODECS.join(", ")}`;
  }

  if (body.format && !ALLOWED_FORMATS.includes(body.format as typeof ALLOWED_FORMATS[number])) {
    return `Invalid format. Allowed: ${ALLOWED_FORMATS.join(", ")}`;
  }

  if (body.quality !== undefined) {
    const q = Number(body.quality);
    if (isNaN(q) || q < 1 || q > 100) {
      return "Quality must be between 1 and 100";
    }
  }

  return null;
}

export function validateScriptInput(body: Record<string, unknown>) {
  if (!body.topic || typeof body.topic !== "string") {
    return "Topic is required";
  }
  if (body.topic.length > 500) {
    return "Topic must be 500 characters or less";
  }
  if (body.topic.trim().length < 3) {
    return "Topic must be at least 3 characters";
  }
  return null;
}
