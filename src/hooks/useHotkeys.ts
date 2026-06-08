"use client";

import { useEffect, useCallback } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { useEditorStore } from "@/store/useEditorStore";
import { useHistoryStore } from "@/store/useHistoryStore";

export function useHotkeys() {
  const removeElement = useProjectStore((s) => s.removeElement);
  const duplicateElement = useProjectStore((s) => s.duplicateElement);
  const updateElement = useProjectStore((s) => s.updateElement);
  const project = useProjectStore((s) => s.project);
  const setProject = useProjectStore((s) => s.setProject);

  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const isPlaying = useEditorStore((s) => s.isPlaying);

  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const pushState = useHistoryStore((s) => s.pushState);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;

      // Don't intercept when typing in inputs
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      // Space: toggle play/pause
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying(!isPlaying);
        return;
      }

      // Escape: deselect
      if (e.key === "Escape") {
        clearSelection();
        return;
      }

      // Delete/Backspace: delete selected
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0) {
          e.preventDefault();
          pushState(project);
          selectedIds.forEach((id) => removeElement(id));
          clearSelection();
        }
        return;
      }

      // Cmd+Z: undo
      if (isMod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        const previous = undo(project);
        if (previous) setProject(previous);
        return;
      }

      // Cmd+Shift+Z: redo
      if (isMod && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        const next = redo(project);
        if (next) setProject(next);
        return;
      }

      // Cmd+D: duplicate
      if (isMod && e.key === "d") {
        e.preventDefault();
        if (selectedIds.length > 0) {
          pushState(project);
          selectedIds.forEach((id) => duplicateElement(id));
        }
        return;
      }

      // Cmd+A: select all
      if (isMod && e.key === "a") {
        e.preventDefault();
        const allIds = project.elements.map((el) => el.id);
        allIds.forEach((id) =>
          useEditorStore.getState().selectElement(id, true)
        );
        return;
      }

      // Arrow keys: nudge selected elements
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        if (selectedIds.length > 0) {
          e.preventDefault();
          pushState(project);
          const step = e.shiftKey ? 10 : 1;
          const dx =
            e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
          const dy =
            e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
          selectedIds.forEach((id) => {
            const el = project.elements.find((el) => el.id === id);
            if (el) {
              updateElement(id, {
                position: {
                  x: el.position.x + dx,
                  y: el.position.y + dy,
                },
              });
            }
          });
        }
        return;
      }
    },
    [
      selectedIds,
      isPlaying,
      project,
      removeElement,
      duplicateElement,
      updateElement,
      clearSelection,
      setIsPlaying,
      undo,
      redo,
      pushState,
      setProject,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
