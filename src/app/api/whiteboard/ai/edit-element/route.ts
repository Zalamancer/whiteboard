import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

const EDIT_SYSTEM_PROMPT = `You are an element editor for a whiteboard video tool. Given a natural language instruction and the current properties of a whiteboard element, return a JSON object with ONLY the properties that should change.

Element types: "text", "svg-path", "shape", "image"

Available properties you can modify:
- position: { x: number, y: number }
- size: { width: number, height: number }
- rotation: number (degrees)
- opacity: number (0-1)
- animationType: "draw" | "fade-in" | "none" | "slide-in-left" | "slide-in-right" | "slide-in-bottom" | "pop" | "typewriter" | "wipe-left" | "stamp"
- drawSpeed: number (frames, 5-300)
- startFrame: number
- durationFrames: number

For text elements, you can also modify data properties:
- data.content: string
- data.fontSize: number
- data.fontWeight: number (100-900)
- data.color: string (hex)
- data.textAlign: "left" | "center" | "right"
- data.fontFamily: string

For shape elements:
- data.strokeColor: string (hex)
- data.strokeWidth: number
- data.fillColor: string (hex)

For svg-path elements:
- data.strokeColor: string (hex)
- data.strokeWidth: number
- data.fillColor: string (hex or "transparent")

IMPORTANT: Return ONLY a flat JSON patch object. Use dot notation keys for nested data properties, like "data.color" or "data.fontSize". Return ONLY the changed properties. Do not include unchanged properties.

Example input: "make it bigger and red"
Example element: { type: "text", size: { width: 200, height: 50 }, data: { color: "#000000" } }
Example output: { "size": { "width": 300, "height": 75 }, "data.color": "#ff0000" }

Example input: "move it to the right"
Example output: { "position": { "x": 500, "y": 200 } }

Example input: "make the text bold and larger"
Example output: { "data.fontWeight": 700, "data.fontSize": 48 }

Return only valid JSON, no markdown, no code blocks.`;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { instruction, element } = body;

    if (!instruction || !element) {
      return NextResponse.json(
        { error: "Instruction and element are required" },
        { status: 400 }
      );
    }

    // Build a concise element summary for the AI
    const elementSummary = {
      type: element.data?.type || element.type,
      position: element.position,
      size: element.size,
      rotation: element.rotation,
      opacity: element.opacity,
      animationType: element.animationType,
      drawSpeed: element.drawSpeed,
      startFrame: element.startFrame,
      durationFrames: element.durationFrames,
      ...(element.data?.type === "text" && {
        "data.content": element.data.content,
        "data.fontSize": element.data.fontSize,
        "data.fontWeight": element.data.fontWeight,
        "data.color": element.data.color,
        "data.textAlign": element.data.textAlign,
        "data.fontFamily": element.data.fontFamily,
      }),
      ...(element.data?.type === "shape" && {
        "data.shapeType": element.data.shapeType,
        "data.strokeColor": element.data.strokeColor,
        "data.fillColor": element.data.fillColor,
        "data.strokeWidth": element.data.strokeWidth,
      }),
      ...(element.data?.type === "svg-path" && {
        "data.strokeColor": element.data.strokeColor,
        "data.fillColor": element.data.fillColor,
        "data.strokeWidth": element.data.strokeWidth,
      }),
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: EDIT_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Instruction: "${instruction}"\n\nCurrent element:\n${JSON.stringify(elementSummary, null, 2)}\n\nReturn only the JSON patch.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content || "";
    const cleaned = raw.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();

    let patch;
    try {
      patch = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ patch });
  } catch (error) {
    console.error("[AI Edit] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Element edit failed",
      },
      { status: 500 }
    );
  }
}
