"use client";

import React, { useCallback, useRef } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { useEditorStore } from "@/store/useEditorStore";
import type { WhiteboardElement, ImageData } from "@/store/types";

export const ImageUploader: React.FC = () => {
  const addElement = useProjectStore((s) => s.addElement);
  const currentFrame = useEditorStore((s) => s.currentFrame);
  const elements = useProjectStore((s) => s.project.elements);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const maxSize = 400;
          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          const data: ImageData = {
            type: "image",
            src,
            objectFit: "contain",
          };
          const element: WhiteboardElement = {
            id: crypto.randomUUID(),
            type: "image",
            position: { x: 500, y: 300 },
            size: {
              width: Math.round(img.width * scale),
              height: Math.round(img.height * scale),
            },
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
        img.src = src;
      };
      reader.readAsDataURL(file);
    },
    [addElement, currentFrame, elements.length]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--surface-light)] hover:border-[var(--primary)]"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <p className="mt-2 text-[10px] text-[var(--text-muted)]">
          Drop image here or click to browse
        </p>
        <p className="text-[9px] text-[var(--text-muted)]">PNG, JPG, SVG</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />
    </div>
  );
};
