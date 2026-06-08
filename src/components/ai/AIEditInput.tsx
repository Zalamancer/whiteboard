"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import type { WhiteboardElement } from "@/store/types";

interface AIEditInputProps {
  element: WhiteboardElement;
}

export const AIEditInput: React.FC<AIEditInputProps> = ({ element }) => {
  const updateElement = useProjectStore((s) => s.updateElement);
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-clear last action message after 3 seconds
  useEffect(() => {
    if (lastAction) {
      const timer = setTimeout(() => setLastAction(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  const handleSubmit = useCallback(async () => {
    if (!instruction.trim() || loading) return;

    setLoading(true);
    setLastAction(null);

    try {
      const res = await fetch("/api/whiteboard/ai/edit-element", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction, element }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Edit failed");

      const patch = data.patch;

      // Separate top-level props from data.* props
      const topLevelPatch: Record<string, unknown> = {};
      const dataPatch: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(patch)) {
        if (key.startsWith("data.")) {
          dataPatch[key.slice(5)] = value;
        } else {
          topLevelPatch[key] = value;
        }
      }

      // Build the final update
      const update: Partial<WhiteboardElement> = {
        ...topLevelPatch,
      } as Partial<WhiteboardElement>;

      // Merge data properties if any
      if (Object.keys(dataPatch).length > 0) {
        update.data = {
          ...element.data,
          ...dataPatch,
        } as WhiteboardElement["data"];
      }

      updateElement(element.id, update);
      setLastAction(`Applied: ${instruction}`);
      setInstruction("");
    } catch (err) {
      setLastAction(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setLoading(false);
    }
  }, [instruction, element, loading, updateElement]);

  return (
    <div className="space-y-1.5 py-2">
      <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
        AI Edit
      </label>
      <div className="flex gap-1">
        <input
          ref={inputRef}
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="e.g., make it bigger, change color to red..."
          disabled={loading}
          className="flex-1 rounded border border-[var(--border)] bg-[var(--surface-light)] px-2 py-1.5 text-[10px] text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--primary)] disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={!instruction.trim() || loading}
          className="flex items-center justify-center rounded bg-[var(--primary)] px-2 py-1.5 text-[9px] font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
        >
          {loading ? (
            <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
              <path d="M12 2a10 10 0 019.8 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
            </svg>
          )}
        </button>
      </div>
      {lastAction && (
        <p className={`text-[9px] ${lastAction.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>
          {lastAction}
        </p>
      )}
      <p className="text-[8px] text-[var(--text-muted)]">
        Try: &ldquo;make it red&rdquo;, &ldquo;increase font size&rdquo;, &ldquo;add pop animation&rdquo;, &ldquo;move left&rdquo;
      </p>
    </div>
  );
};
