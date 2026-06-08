import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SCRIPT_SYSTEM_PROMPT, buildScriptPrompt } from "@/lib/ai/prompts";
import { apiError, validateScriptInput } from "@/lib/api-utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { topic, audience, tone, length } = body;

    const validationError = validateScriptInput(body);
    if (validationError) return apiError(validationError);

    const userPrompt = buildScriptPrompt(topic, audience, tone, length);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SCRIPT_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    const script = JSON.parse(content);

    // Validate structure
    if (!script.scenes || !Array.isArray(script.scenes)) {
      return NextResponse.json(
        { error: "Invalid script format" },
        { status: 500 }
      );
    }

    return NextResponse.json({ script });
  } catch (error) {
    console.error("[AI Script] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Script generation failed",
      },
      { status: 500 }
    );
  }
}
