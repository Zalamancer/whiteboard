import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

const DOCUMENT_SCRIPT_PROMPT = `You are a whiteboard explainer video script writer. You convert document content into engaging whiteboard animation video scripts.

Given the extracted text from a document (PDF, DOCX, or similar), create a compelling whiteboard explainer video script that captures the key points.

Your output must be valid JSON matching this structure:
{
  "title": "Video title",
  "scenes": [
    {
      "title": "Scene title (short, 2-5 words)",
      "narration": "What the narrator says during this scene (2-3 sentences max)",
      "visualDescriptions": [
        "A clear description of each visual element to draw"
      ],
      "duration": 5
    }
  ]
}

Rules:
- Distill the document into 4-8 key scenes
- Each scene should have 2-4 visual descriptions
- Visual descriptions should be simple: icons, text labels, arrows, shapes
- Use simple icon names (e.g. "lightbulb", "gear", "chart-bar", "users", "rocket", "target", "check-circle")
- Keep narration concise and conversational
- Total video should be 30-90 seconds
- Focus on the most important concepts and key takeaways
- Structure: intro → key points → conclusion/takeaway
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    let extractedText = "";

    if (fileName.endsWith(".pdf")) {
      // PDF parsing
      const buffer = Buffer.from(await file.arrayBuffer());
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (
      fileName.endsWith(".docx") ||
      fileName.endsWith(".doc")
    ) {
      // DOCX parsing
      const buffer = Buffer.from(await file.arrayBuffer());
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
      // Plain text
      extractedText = await file.text();
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOCX, TXT, or MD files." },
        { status: 400 }
      );
    }

    // Truncate very long documents
    const maxChars = 15000;
    if (extractedText.length > maxChars) {
      extractedText = extractedText.slice(0, maxChars) + "\n\n[Document truncated...]";
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from the document. The file may be empty or image-only." },
        { status: 400 }
      );
    }

    // Generate script from document text using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: DOCUMENT_SCRIPT_PROMPT },
        {
          role: "user",
          content: `Convert this document into a whiteboard explainer video script. Focus on the most important points.\n\nDocument content:\n${extractedText}\n\nReturn only valid JSON, no markdown, no code blocks.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content || "";
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();

    let script;
    try {
      script = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      script,
      extractedTextLength: extractedText.length,
      fileName: file.name,
    });
  } catch (error) {
    console.error("[Document Upload] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Document processing failed",
      },
      { status: 500 }
    );
  }
}
