"use client";

import React, { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { useEditorStore } from "@/store/useEditorStore";
import type { WhiteboardElement, TextData } from "@/store/types";

const FONTS = [
  "Georgia, serif",
  "Arial, sans-serif",
  "Courier New, monospace",
  "Times New Roman, serif",
  "Verdana, sans-serif",
  "Impact, sans-serif",
  "Comic Sans MS, cursive",
];

export const TextTool: React.FC = () => {
  const [text, setText] = useState("Your text here");
  const [font, setFont] = useState(FONTS[0]);
  const [fontSize, setFontSize] = useState(48);
  const [fontWeight, setFontWeight] = useState(700);
  const [color, setColor] = useState("#2c3e50");
  const addElement = useProjectStore((s) => s.addElement);
  const currentFrame = useEditorStore((s) => s.currentFrame);
  const elements = useProjectStore((s) => s.project.elements);

  const handleAdd = () => {
    if (!text.trim()) return;
    const data: TextData = {
      type: "text",
      content: text,
      fontFamily: font,
      fontSize,
      fontWeight,
      color,
      textAlign: "center",
    };
    const element: WhiteboardElement = {
      id: crypto.randomUUID(),
      type: "text",
      position: { x: 400, y: 300 },
      size: { width: 500, height: Math.ceil(fontSize * 1.5 * (text.split("\n").length)) },
      rotation: 0,
      startFrame: currentFrame,
      durationFrames: 150,
      animationType: "fade-in",
      drawSpeed: 30,
      opacity: 1,
      zIndex: elements.length,
      locked: false,
      visible: true,
      data,
    };
    addElement(element);
  };

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full rounded bg-[var(--surface-light)] px-2 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
        placeholder="Type your text..."
      />

      <div>
        <label className="text-[10px] text-[var(--text-muted)]">Font</label>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
        >
          {FONTS.map((f) => (
            <option key={f} value={f} style={{ fontFamily: f }}>
              {f.split(",")[0]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[10px] text-[var(--text-muted)]">Size</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            min={12}
            max={200}
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-[var(--text-muted)]">Weight</label>
          <select
            value={fontWeight}
            onChange={(e) => setFontWeight(Number(e.target.value))}
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          >
            <option value={400}>Normal</option>
            <option value={700}>Bold</option>
            <option value={900}>Black</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] text-[var(--text-muted)]">Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-7 w-7 cursor-pointer rounded border border-[var(--border)]"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="w-full rounded bg-[var(--primary)] py-2 text-xs font-medium text-white hover:bg-[var(--primary-hover)]"
      >
        Add Text
      </button>
    </div>
  );
};
