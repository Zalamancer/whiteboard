import { NextRequest, NextResponse } from "next/server";
import { getTemplateList, getTemplateProject } from "@/lib/templates";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get("id");

  if (templateId) {
    const project = getTemplateProject(templateId);
    if (!project) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    return NextResponse.json({ project });
  }

  const templates = getTemplateList();
  return NextResponse.json({ templates });
}
