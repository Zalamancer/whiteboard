"use client";

import React, { useCallback, useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { useEditorStore } from "@/store/useEditorStore";
import { useHistoryStore } from "@/store/useHistoryStore";
import { saveProject, loadProjectFromFile } from "@/lib/export";
import { ExportDialog } from "./ExportDialog";
import { GenerateDialog } from "../ai/GenerateDialog";
import { VoiceoverPanel } from "../ai/VoiceoverPanel";
import { StylePicker } from "./StylePicker";
import { MusicBrowser } from "../audio/MusicBrowser";
import { VIDEO_STYLES, ASPECT_RATIOS } from "@/lib/video-styles";

export const TopToolbar: React.FC = () => {
  const [exportOpen, setExportOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [voiceoverOpen, setVoiceoverOpen] = useState(false);
  const [stylePickerOpen, setStylePickerOpen] = useState(false);
  const [musicBrowserOpen, setMusicBrowserOpen] = useState(false);
  const project = useProjectStore((s) => s.project);
  const setProject = useProjectStore((s) => s.setProject);
  const updateProject = useProjectStore((s) => s.updateProject);
  const toggleLeft = useEditorStore((s) => s.toggleLeftSidebar);
  const toggleRight = useEditorStore((s) => s.toggleRightSidebar);
  const leftOpen = useEditorStore((s) => s.leftSidebarOpen);
  const rightOpen = useEditorStore((s) => s.rightSidebarOpen);

  const undoFn = useHistoryStore((s) => s.undo);
  const redoFn = useHistoryStore((s) => s.redo);
  const pushState = useHistoryStore((s) => s.pushState);

  const handleSave = useCallback(() => {
    saveProject(project);
  }, [project]);

  const handleLoad = useCallback(async () => {
    try {
      const loaded = await loadProjectFromFile();
      setProject(loaded);
    } catch {
      // User cancelled or invalid file
    }
  }, [setProject]);

  const handleUndo = useCallback(() => {
    const prev = undoFn(project);
    if (prev) setProject(prev);
  }, [undoFn, setProject, project]);

  const handleRedo = useCallback(() => {
    const next = redoFn(project);
    if (next) setProject(next);
  }, [redoFn, setProject, project]);

  return (
    <div className="flex h-8 shrink-0 items-center justify-between border-b border-zinc-700/50 bg-zinc-800/90 px-3">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLeft}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-200"
          title="Toggle assets panel"
          aria-label="Toggle assets panel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill={leftOpen ? "currentColor" : "none"} fillOpacity={0.2} />
            <rect x="8" y="2" width="7" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        <div className="h-4 w-px bg-zinc-700/50" />
        <span className="text-xs font-semibold text-zinc-200">
          Whiteboard
        </span>
        <div className="h-4 w-px bg-zinc-700/50" />
        {/* Undo/Redo */}
        <button
          onClick={handleUndo}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-200"
          title="Undo (Cmd+Z)"
          aria-label="Undo"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 5L1 7L3 9" />
            <path d="M1 7H9C11 7 13 8.5 13 11" />
          </svg>
        </button>
        <button
          onClick={handleRedo}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-200"
          title="Redo (Cmd+Shift+Z)"
          aria-label="Redo"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 5L13 7L11 9" />
            <path d="M13 7H5C3 7 1 8.5 1 11" />
          </svg>
        </button>
      </div>

      {/* Center: Style + Ratio selector + project name */}
      <div className="relative flex items-center gap-2">
        <button
          onClick={() => setStylePickerOpen(!stylePickerOpen)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-200"
          title="Video style & aspect ratio"
        >
          <div
            className="h-3 w-3 rounded-sm border border-zinc-600"
            style={{ backgroundColor: VIDEO_STYLES[project.videoStyle || "classic-whiteboard"]?.thumbnailColors[0] || "#fff" }}
          />
          <span>{VIDEO_STYLES[project.videoStyle || "classic-whiteboard"]?.name || "Classic"}</span>
          <span className="text-zinc-600">|</span>
          <span>{project.aspectRatio || "16:9"}</span>
        </button>
        <StylePicker open={stylePickerOpen} onClose={() => setStylePickerOpen(false)} />

        {/* Project name (editable) */}
        <div className="h-4 w-px bg-zinc-700/50" />
        <input
          type="text"
          value={project.name}
          onChange={(e) => updateProject({ name: e.target.value })}
          className="max-w-[160px] bg-transparent text-center text-xs text-zinc-500 outline-none focus:text-zinc-200"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          className="rounded-lg px-2 py-1 text-[10px] font-medium text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-200"
          title="Save project"
        >
          Save
        </button>
        <button
          onClick={handleLoad}
          className="rounded-lg px-2 py-1 text-[10px] font-medium text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-200"
          title="Load project"
        >
          Load
        </button>
        <div className="h-4 w-px bg-zinc-700/50" />
        <button
          onClick={() => setGenerateOpen(true)}
          className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600"
          title="Generate video with AI"
        >
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
            AI Generate
          </span>
        </button>
        <GenerateDialog open={generateOpen} onClose={() => setGenerateOpen(false)} />
        <button
          onClick={() => setVoiceoverOpen(true)}
          className="rounded-lg px-2 py-1 text-[10px] font-medium text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-200"
          title="AI Voiceover"
        >
          Voiceover
        </button>
        <VoiceoverPanel open={voiceoverOpen} onClose={() => setVoiceoverOpen(false)} />
        <button
          onClick={() => setMusicBrowserOpen(true)}
          className="rounded-lg px-2 py-1 text-[10px] font-medium text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-200"
          title="Browse music library"
        >
          Music
        </button>
        <MusicBrowser open={musicBrowserOpen} onClose={() => setMusicBrowserOpen(false)} />
        <button
          onClick={() => setExportOpen(true)}
          className="rounded-lg bg-green-500 px-2 py-1 text-xs font-medium text-white hover:bg-green-600"
          title="Export video"
        >
          Export
        </button>
        <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} />
        <div className="h-4 w-px bg-zinc-700/50" />
        <button
          onClick={toggleRight}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-200"
          title="Toggle properties panel"
          aria-label="Toggle properties panel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2" width="7" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <rect x="10" y="2" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill={rightOpen ? "currentColor" : "none"} fillOpacity={0.2} />
          </svg>
        </button>
      </div>
    </div>
  );
};
