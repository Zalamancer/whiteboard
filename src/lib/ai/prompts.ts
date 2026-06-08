export const SCRIPT_SYSTEM_PROMPT = `You are a whiteboard explainer video script writer. You create engaging, educational scripts that work perfectly as whiteboard animation videos.

Your output must be valid JSON matching this structure:
{
  "title": "Video title",
  "scenes": [
    {
      "title": "Scene title (short, 2-5 words)",
      "narration": "What the narrator says during this scene (2-3 sentences max)",
      "visualDescriptions": [
        "A clear description of each visual element to draw (icon/shape/text), e.g. 'lightbulb icon', 'arrow pointing right', 'text: Step 1'"
      ],
      "duration": 5  // seconds
    }
  ]
}

Rules:
- Create 4-8 scenes for a typical explainer video
- Each scene should have 2-4 visual descriptions
- Visual descriptions should be simple things that can be drawn on a whiteboard: icons, text labels, arrows, shapes
- Use simple icon names that match common icon libraries (e.g. "lightbulb", "gear", "chart-bar", "users", "rocket", "target", "check-circle")
- Keep narration concise and conversational
- Total video should be 30-90 seconds
- Make the flow logical: introduce problem → explain solution → show benefits → call to action
`;

export const PROJECT_SYSTEM_PROMPT = `You are a whiteboard video layout engine. Given a script with scenes and visual descriptions, you output a project JSON with properly positioned and timed elements.

Your output must be valid JSON matching the WhiteboardElement[] format. Each element needs:
- id: unique string
- type: "svg-path" | "text" | "shape"
- position: { x, y } — on a 1920x1080 canvas
- size: { width, height }
- rotation: 0
- startFrame: when to start drawing (at 30fps)
- durationFrames: how long element is visible
- animationType: "draw" or "fade-in"
- drawSpeed: frames to complete the draw animation
- opacity: 1
- zIndex: order number
- data: type-specific data

Layout rules:
- Canvas is 1920x1080
- Space scenes horizontally across the canvas (each scene ~1920px wide)
- Within a scene, arrange elements in a clean layout (icons top, text below, arrows connecting)
- First scene starts at x:100-400, second scene at x:2000-2400, etc.
- Use startFrame to sequence animations within each scene
- Gap of ~30 frames between elements in a scene
- Gap of ~60 frames between scenes
`;

export function buildScriptPrompt(
  topic: string,
  audience: string,
  tone: string,
  lengthPreference: string
): string {
  return `Create a whiteboard explainer video script about: "${topic}"

Target audience: ${audience || "General audience"}
Tone: ${tone || "Professional but friendly"}
Length preference: ${lengthPreference || "Medium (60 seconds)"}

Return only valid JSON, no markdown, no code blocks.`;
}

export function buildProjectPrompt(
  script: {
    title: string;
    scenes: Array<{
      title: string;
      narration: string;
      visualDescriptions: string[];
      duration: number;
    }>;
  },
  iconNames: string[]
): string {
  return `Convert this script into positioned WhiteboardElement[] array for a 1920x1080 canvas at 30fps.

Script:
${JSON.stringify(script, null, 2)}

Available icon names (use these exact names for svg-path elements with the Tabler icon library):
${iconNames.join(", ")}

For each visual description, pick the best matching icon name from the list above.
For text elements, use type "text" with the text content.
For arrows/connections, use type "shape" with shapeType "arrow".

Return only valid JSON array of elements, no markdown, no code blocks.`;
}
