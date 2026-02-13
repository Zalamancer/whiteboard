"use client";

import React, { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { useProjectStore } from "@/store/useProjectStore";
import { useHotkeys } from "@/hooks/useHotkeys";
import { autoSaveProject, loadAutoSavedProject } from "@/lib/export";
import { TopToolbar } from "./TopToolbar";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { CenterCanvas } from "./CenterCanvas";
import { BottomTimeline } from "./BottomTimeline";

export const EditorLayout: React.FC = () => {
  const leftOpen = useEditorStore((s) => s.leftSidebarOpen);
  const rightOpen = useEditorStore((s) => s.rightSidebarOpen);
  const project = useProjectStore((s) => s.project);
  const setProject = useProjectStore((s) => s.setProject);

  // Register keyboard shortcuts
  useHotkeys();

  // Load auto-saved project on mount
  const didLoad = useRef(false);
  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;
    const saved = loadAutoSavedProject();
    if (saved && saved.elements.length > 0) {
      setProject(saved);
    }
  }, [setProject]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      autoSaveProject(project);
    }, 30000);
    return () => clearInterval(interval);
  }, [project]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--background)]">
      <TopToolbar />
      <div className="flex flex-1 overflow-hidden">
        {leftOpen && <LeftSidebar />}
        <CenterCanvas />
        {rightOpen && <RightSidebar />}
      </div>
      <BottomTimeline />
    </div>
  );
};
