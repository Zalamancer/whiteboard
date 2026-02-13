import type { Project } from "@/store/types";

// Calculate the total duration of a project in frames
export function calculateTotalDuration(project: Project): number {
  const elementMax = project.elements.reduce(
    (max, el) => Math.max(max, el.startFrame + el.durationFrames),
    0
  );
  const audioMax = project.audioTracks.reduce(
    (max, t) => Math.max(max, t.startFrame + t.durationFrames),
    0
  );
  return Math.max(elementMax, audioMax, 300);
}

// Save project as JSON file
export function saveProject(project: Project): void {
  const data = JSON.stringify(project, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.whiteboard`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Load project from JSON file
export function loadProjectFromFile(): Promise<Project> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".whiteboard,.json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const project = JSON.parse(ev.target?.result as string) as Project;
          resolve(project);
        } catch {
          reject(new Error("Invalid project file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    };
    input.click();
  });
}

// Auto-save to localStorage
const AUTOSAVE_KEY = "whiteboard-studio-autosave";

export function autoSaveProject(project: Project): void {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(project));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function loadAutoSavedProject(): Project | null {
  try {
    const data = localStorage.getItem(AUTOSAVE_KEY);
    if (data) return JSON.parse(data) as Project;
  } catch {
    // Ignore parse errors
  }
  return null;
}

export function clearAutoSave(): void {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
  } catch {
    // Ignore
  }
}
