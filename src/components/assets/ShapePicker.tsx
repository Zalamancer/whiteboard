"use client";

import React from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { useEditorStore } from "@/store/useEditorStore";
import type { WhiteboardElement, ShapeData } from "@/store/types";

const SHAPES: { type: ShapeData["shapeType"]; label: string; icon: string }[] = [
  {
    type: "rect",
    label: "Rectangle",
    icon: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="8" width="32" height="24" rx="2"/></svg>',
  },
  {
    type: "circle",
    label: "Circle",
    icon: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><circle cx="20" cy="20" r="16"/></svg>',
  },
  {
    type: "ellipse",
    label: "Ellipse",
    icon: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="20" cy="20" rx="18" ry="12"/></svg>',
  },
  {
    type: "arrow",
    label: "Arrow",
    icon: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="20" x2="30" y2="20"/><path d="M24 12 L36 20 L24 28"/></svg>',
  },
  {
    type: "line",
    label: "Line",
    icon: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="36" x2="36" y2="4"/></svg>',
  },
  {
    type: "star",
    label: "Star",
    icon: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 3 L24 15 L37 15 L27 22 L31 35 L20 27 L9 35 L13 22 L3 15 L16 15 Z"/></svg>',
  },
];

export const ShapePicker: React.FC = () => {
  const addElement = useProjectStore((s) => s.addElement);
  const currentFrame = useEditorStore((s) => s.currentFrame);
  const elements = useProjectStore((s) => s.project.elements);

  const handleAddShape = (shapeType: ShapeData["shapeType"]) => {
    const data: ShapeData = {
      type: "shape",
      shapeType,
      strokeColor: "#333333",
      strokeWidth: 3,
      fillColor: "#3b82f6",
      cornerRadius: shapeType === "rect" ? 8 : undefined,
    };
    const size =
      shapeType === "arrow" || shapeType === "line"
        ? { width: 250, height: 80 }
        : { width: 200, height: 200 };
    const element: WhiteboardElement = {
      id: crypto.randomUUID(),
      type: "shape",
      position: { x: 500 + Math.random() * 200, y: 300 + Math.random() * 200 },
      size,
      rotation: 0,
      startFrame: currentFrame,
      durationFrames: 150,
      animationType: "draw",
      drawSpeed: 45,
      opacity: 1,
      zIndex: elements.length,
      locked: false,
      visible: true,
      data,
    };
    addElement(element);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {SHAPES.map((shape) => (
        <button
          key={shape.type}
          onClick={() => handleAddShape(shape.type)}
          className="group flex flex-col items-center gap-1 rounded bg-[var(--surface-light)] p-3 hover:bg-[var(--primary)] hover:bg-opacity-20"
          title={shape.label}
        >
          <div
            className="h-10 w-10 text-[var(--foreground)]"
            dangerouslySetInnerHTML={{ __html: shape.icon }}
          />
          <span className="text-[9px] text-[var(--text-muted)] group-hover:text-[var(--foreground)]">
            {shape.label}
          </span>
        </button>
      ))}
    </div>
  );
};
