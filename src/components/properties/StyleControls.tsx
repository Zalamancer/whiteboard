"use client";

import React, { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import type { WhiteboardElement, SVGPathData, ShapeData, TextData } from "@/store/types";
import { FONT_LIBRARY, FONT_CATEGORIES, type FontDefinition } from "@/lib/fonts";

interface Props {
  element: WhiteboardElement;
}

export const StyleControls: React.FC<Props> = ({ element }) => {
  const updateElement = useProjectStore((s) => s.updateElement);

  const updateData = (dataPatch: Record<string, unknown>) => {
    updateElement(element.id, {
      data: { ...element.data, ...dataPatch } as WhiteboardElement["data"],
    });
  };

  if (element.data.type === "svg-path") {
    const data = element.data as SVGPathData;
    return (
      <div className="space-y-2 py-2">
        <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Style
        </label>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Stroke</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.strokeColor}
              onChange={(e) => updateData({ strokeColor: e.target.value })}
              className="h-6 w-6 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="number"
              value={data.strokeWidth}
              min={0.5}
              max={20}
              step={0.5}
              onChange={(e) => updateData({ strokeWidth: Number(e.target.value) })}
              className="w-16 rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
            />
          </div>
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Fill</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.fillColor === "transparent" ? "#000000" : data.fillColor}
              onChange={(e) => updateData({ fillColor: e.target.value, fillOpacity: 0.3 })}
              className="h-6 w-6 cursor-pointer rounded border border-[var(--border)]"
            />
            <label className="flex items-center gap-1 text-[9px] text-[var(--text-muted)]">
              <input
                type="range"
                min={0}
                max={100}
                value={data.fillOpacity * 100}
                onChange={(e) => updateData({ fillOpacity: Number(e.target.value) / 100 })}
                className="w-16"
              />
              {(data.fillOpacity * 100).toFixed(0)}%
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (element.data.type === "shape") {
    const data = element.data as ShapeData;
    return (
      <div className="space-y-2 py-2">
        <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Style
        </label>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Stroke</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.strokeColor}
              onChange={(e) => updateData({ strokeColor: e.target.value })}
              className="h-6 w-6 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="number"
              value={data.strokeWidth}
              min={0.5}
              max={20}
              step={0.5}
              onChange={(e) => updateData({ strokeWidth: Number(e.target.value) })}
              className="w-16 rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
            />
          </div>
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Fill</label>
          <input
            type="color"
            value={data.fillColor}
            onChange={(e) => updateData({ fillColor: e.target.value })}
            className="h-6 w-6 cursor-pointer rounded border border-[var(--border)]"
          />
        </div>
      </div>
    );
  }

  if (element.data.type === "text") {
    return <TextStyleControls data={element.data as TextData} updateData={updateData} />;
  }

  return (
    <div className="py-2">
      <p className="text-[10px] text-[var(--text-muted)]">No style options for this element type.</p>
    </div>
  );
};

/** Extracted text style controls with font picker */
const TextStyleControls: React.FC<{
  data: TextData;
  updateData: (patch: Record<string, unknown>) => void;
}> = ({ data, updateData }) => {
  const [fontCategory, setFontCategory] = useState<string>("all");
  const [fontPickerOpen, setFontPickerOpen] = useState(false);

  const filteredFonts =
    fontCategory === "all"
      ? FONT_LIBRARY
      : FONT_LIBRARY.filter((f) => f.category === fontCategory);

  // Find current font name
  const currentFont = FONT_LIBRARY.find(
    (f) => f.family === data.fontFamily
  );

  return (
    <div className="space-y-2 py-2">
      <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
        Text Style
      </label>
      <div>
        <label className="text-[9px] text-[var(--text-muted)]">Content</label>
        <textarea
          value={data.content}
          onChange={(e) => updateData({ content: e.target.value })}
          rows={2}
          className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
        />
      </div>

      {/* Font Picker */}
      <div>
        <label className="text-[9px] text-[var(--text-muted)]">Font</label>
        <button
          onClick={() => setFontPickerOpen(!fontPickerOpen)}
          className="mt-1 flex w-full items-center justify-between rounded border border-[var(--border)] bg-[var(--surface-light)] px-2 py-1.5 text-xs text-[var(--foreground)] hover:border-[var(--primary)]"
        >
          <span style={{ fontFamily: data.fontFamily }}>
            {currentFont?.name || "Georgia"}
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={fontPickerOpen ? "M2 6L5 3L8 6" : "M2 4L5 7L8 4"} />
          </svg>
        </button>

        {fontPickerOpen && (
          <div className="mt-1 rounded border border-[var(--border)] bg-[var(--surface)] shadow-lg">
            {/* Category filter */}
            <div className="flex gap-0.5 border-b border-[var(--border)] px-2 py-1.5">
              <button
                onClick={() => setFontCategory("all")}
                className={`rounded px-1.5 py-0.5 text-[8px] font-medium ${
                  fontCategory === "all"
                    ? "bg-[var(--primary)] bg-opacity-15 text-[var(--primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                All
              </button>
              {FONT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFontCategory(cat.id)}
                  className={`rounded px-1.5 py-0.5 text-[8px] font-medium ${
                    fontCategory === cat.id
                      ? "bg-[var(--primary)] bg-opacity-15 text-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Font list */}
            <div className="max-h-48 overflow-y-auto p-1">
              {filteredFonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => {
                    updateData({ fontFamily: font.family });
                    setFontPickerOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left transition-colors ${
                    data.fontFamily === font.family
                      ? "bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]"
                      : "hover:bg-[var(--surface-light)] text-[var(--foreground)]"
                  }`}
                >
                  <span
                    className="text-sm"
                    style={{ fontFamily: font.family }}
                  >
                    {font.name}
                  </span>
                  <span className="text-[8px] text-[var(--text-muted)]">
                    {font.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.color}
              onChange={(e) => updateData({ color: e.target.value })}
              className="h-6 w-6 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="text"
              value={data.color}
              onChange={(e) => updateData({ color: e.target.value })}
              className="flex-1 rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
            />
          </div>
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Size</label>
          <input
            type="number"
            value={data.fontSize}
            min={8}
            max={200}
            onChange={(e) => updateData({ fontSize: Number(e.target.value) })}
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* Font weight & alignment */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Weight</label>
          <select
            value={data.fontWeight}
            onChange={(e) => updateData({ fontWeight: Number(e.target.value) })}
            className="w-full rounded bg-[var(--surface-light)] px-2 py-1 text-xs text-[var(--foreground)]"
          >
            <option value={300}>Light</option>
            <option value={400}>Regular</option>
            <option value={500}>Medium</option>
            <option value={600}>Semi Bold</option>
            <option value={700}>Bold</option>
            <option value={800}>Extra Bold</option>
          </select>
        </div>
        <div>
          <label className="text-[9px] text-[var(--text-muted)]">Align</label>
          <div className="flex gap-1 mt-0.5">
            {(["left", "center", "right"] as const).map((align) => (
              <button
                key={align}
                onClick={() => updateData({ textAlign: align })}
                className={`flex-1 rounded py-1 text-[9px] ${
                  data.textAlign === align
                    ? "bg-[var(--primary)] bg-opacity-15 text-[var(--primary)]"
                    : "bg-[var(--surface-light)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {align === "left" ? "L" : align === "center" ? "C" : "R"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
