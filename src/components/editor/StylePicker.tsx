"use client";

import React, { useState, useRef, useEffect } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { VIDEO_STYLES, ASPECT_RATIOS, getStyleDefinition } from "@/lib/video-styles";
import type { VideoStyle, AspectRatio } from "@/store/types";

interface StylePickerProps {
  open: boolean;
  onClose: () => void;
}

export const StylePicker: React.FC<StylePickerProps> = ({ open, onClose }) => {
  const project = useProjectStore((s) => s.project);
  const updateProject = useProjectStore((s) => s.updateProject);
  const [activeTab, setActiveTab] = useState<"style" | "ratio">("style");
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  const handleStyleSelect = (style: VideoStyle) => {
    const styleDef = getStyleDefinition(style);
    updateProject({
      videoStyle: style,
      backgroundColor: styleDef.backgroundColor,
    });
  };

  const handleAspectSelect = (ratio: AspectRatio) => {
    const dims = ASPECT_RATIOS[ratio];
    updateProject({
      aspectRatio: ratio,
      width: dims.width,
      height: dims.height,
    });
  };

  return (
    <div
      ref={panelRef}
      className="absolute left-1/2 top-9 z-50 w-[420px] -translate-x-1/2 rounded-xl border border-zinc-700/50 bg-zinc-800 shadow-xl shadow-black/40"
    >
      {/* Tab header */}
      <div className="flex border-b border-zinc-700/50">
        <button
          onClick={() => setActiveTab("style")}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            activeTab === "style"
              ? "border-b-2 border-green-500 text-green-400"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Video Style
        </button>
        <button
          onClick={() => setActiveTab("ratio")}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            activeTab === "ratio"
              ? "border-b-2 border-green-500 text-green-400"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Aspect Ratio
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {activeTab === "style" && (
          <div className="grid grid-cols-3 gap-2">
            {Object.values(VIDEO_STYLES).map((style) => {
              const isActive = project.videoStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => handleStyleSelect(style.id)}
                  className={`group flex flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-all ${
                    isActive
                      ? "border-green-500 bg-green-500/10"
                      : "border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-700/30"
                  }`}
                >
                  {/* Style thumbnail */}
                  <div
                    className="flex h-14 w-full items-center justify-center rounded-md"
                    style={{ backgroundColor: style.thumbnailColors[0] }}
                  >
                    <svg width="40" height="28" viewBox="0 0 40 28">
                      {/* Mini preview: stroke lines + circle */}
                      <line
                        x1="4"
                        y1="8"
                        x2="24"
                        y2="8"
                        stroke={style.thumbnailColors[1]}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="4"
                        y1="14"
                        x2="18"
                        y2="14"
                        stroke={style.thumbnailColors[1]}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                      <circle
                        cx="32"
                        cy="14"
                        r="6"
                        fill="none"
                        stroke={style.thumbnailColors[2]}
                        strokeWidth="1.5"
                      />
                      <line
                        x1="4"
                        y1="20"
                        x2="14"
                        y2="20"
                        stroke={style.thumbnailColors[1]}
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.4"
                      />
                    </svg>
                  </div>
                  <span
                    className={`text-[10px] font-medium ${
                      isActive ? "text-green-400" : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  >
                    {style.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "ratio" && (
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(ASPECT_RATIOS) as [AspectRatio, (typeof ASPECT_RATIOS)[AspectRatio]][]).map(
              ([ratio, def]) => {
                const isActive = project.aspectRatio === ratio;
                // Visual preview proportions (scaled to fit in 60x60 box)
                const maxDim = 48;
                const aspectVal = def.width / def.height;
                const previewW = aspectVal >= 1 ? maxDim : maxDim * aspectVal;
                const previewH = aspectVal >= 1 ? maxDim / aspectVal : maxDim;

                return (
                  <button
                    key={ratio}
                    onClick={() => handleAspectSelect(ratio)}
                    className={`group flex flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-all ${
                      isActive
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-700/30"
                    }`}
                  >
                    {/* Ratio preview box */}
                    <div className="flex h-14 items-center justify-center">
                      <div
                        className={`rounded border ${
                          isActive
                            ? "border-green-500 bg-green-500/20"
                            : "border-zinc-600 bg-zinc-700/50"
                        }`}
                        style={{
                          width: previewW,
                          height: previewH,
                        }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        isActive ? "text-green-400" : "text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      {ratio}
                    </span>
                    <span className="text-[9px] text-zinc-600">
                      {def.width}x{def.height}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};
