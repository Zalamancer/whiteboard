"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import type { Project, VideoStyle, AspectRatio } from "@/store/types";
import { VIDEO_STYLES } from "@/lib/video-styles";

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  videoStyle: VideoStyle;
  aspectRatio: AspectRatio;
}

const CATEGORIES = [
  "All",
  "Education",
  "Business",
  "Marketing",
  "Technical",
  "Social Media",
  "Training",
  "Storytelling",
  "Media",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Education: "#22c55e",
  Business: "#f59e0b",
  Marketing: "#ec4899",
  Technical: "#8b5cf6",
  "Social Media": "#06b6d4",
  Training: "#4a6cf7",
  Storytelling: "#f97316",
  Media: "#ef4444",
};

export const TemplateBrowser: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const setProject = useProjectStore((s) => s.setProject);

  useEffect(() => {
    fetch("/api/whiteboard/templates")
      .then((r) => r.json())
      .then((data) => {
        setTemplates(data.templates || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleApply = useCallback(
    async (templateId: string) => {
      setApplying(templateId);
      try {
        const res = await fetch(`/api/whiteboard/templates?id=${templateId}`);
        const data = await res.json();
        if (data.project) {
          setProject(data.project as Project);
        }
      } finally {
        setApplying(null);
      }
    },
    [setProject]
  );

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "All") return templates;
    return templates.filter((t) => t.category === activeCategory);
  }, [templates, activeCategory]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: templates.length };
    templates.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [templates]);

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center text-xs text-[var(--text-muted)]">
        Loading templates...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-1 pb-1">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat] || 0;
          if (cat !== "All" && count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-2 py-0.5 text-[9px] font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-green-500/20 text-green-400"
                  : "text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-300"
              }`}
            >
              {cat}
              <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="text-[10px] text-[var(--text-muted)]">
        {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""} — click to apply
      </div>

      {filteredTemplates.map((t) => {
        const styleDef = VIDEO_STYLES[t.videoStyle];
        return (
          <button
            key={t.id}
            onClick={() => handleApply(t.id)}
            disabled={applying === t.id}
            className="w-full rounded-lg border border-[var(--border)] p-3 text-left transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:bg-opacity-5 disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{
                  backgroundColor: CATEGORY_COLORS[t.category] || "#6b7280",
                }}
              />
              <span className="text-xs font-semibold text-[var(--foreground)] flex-1 truncate">
                {t.name}
              </span>
              {/* Aspect ratio badge */}
              {t.aspectRatio !== "16:9" && (
                <span className="shrink-0 rounded bg-zinc-700/50 px-1.5 py-0.5 text-[8px] font-medium text-zinc-400">
                  {t.aspectRatio}
                </span>
              )}
            </div>
            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
              {t.description}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="inline-block rounded-full bg-[var(--surface-light)] px-2 py-0.5 text-[8px] text-[var(--text-muted)]">
                {t.category}
              </span>
              {/* Style badge with color swatch */}
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-light)] px-2 py-0.5 text-[8px] text-[var(--text-muted)]">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: styleDef?.thumbnailColors[1] || "#888" }}
                />
                {styleDef?.name || t.videoStyle}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
