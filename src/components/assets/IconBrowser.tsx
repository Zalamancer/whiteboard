"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { parseSVGToPathData } from "@/lib/svg-utils";
import { useProjectStore } from "@/store/useProjectStore";
import { useEditorStore } from "@/store/useEditorStore";
import type { WhiteboardElement } from "@/store/types";

interface IconEntry {
  name: string;
  categories: string[];
}

const ALL_CATEGORIES = [
  "People",
  "Business",
  "Technology",
  "Education",
  "Health",
  "Nature",
  "Transport",
  "Media",
  "Home",
  "Food",
  "Arrows & UI",
  "Shapes",
  "Other",
];

// How many icons to render at a time (virtual scroll batch)
const PAGE_SIZE = 60;

export const IconBrowser: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allIcons, setAllIcons] = useState<IconEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [addingIcon, setAddingIcon] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const addElement = useProjectStore((s) => s.addElement);
  const currentFrame = useEditorStore((s) => s.currentFrame);
  const elements = useProjectStore((s) => s.project.elements);

  // Fetch icon index on mount
  useEffect(() => {
    fetch("/api/icons")
      .then((r) => r.json())
      .then((data) => {
        setAllIcons(data.icons);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter icons by search + category
  const filteredIcons = useMemo(() => {
    let icons = allIcons;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      icons = icons.filter((i) => i.name.includes(q));
    } else if (selectedCategory) {
      icons = icons.filter((i) => i.categories.includes(selectedCategory));
    }

    return icons;
  }, [allIcons, search, selectedCategory]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [search, selectedCategory]);

  // Visible slice
  const visibleIcons = useMemo(
    () => filteredIcons.slice(0, visibleCount),
    [filteredIcons, visibleCount]
  );

  // Infinite scroll: load more when near bottom
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      setVisibleCount((prev) =>
        Math.min(prev + PAGE_SIZE, filteredIcons.length)
      );
    }
  }, [filteredIcons.length]);

  // Click icon → fetch SVG → parse paths → add element
  const handleAddIcon = useCallback(
    async (iconName: string) => {
      setAddingIcon(iconName);
      try {
        const res = await fetch(`/api/icons?name=${encodeURIComponent(iconName)}`);
        const data = await res.json();
        if (!data.svg) return;

        const pathData = parseSVGToPathData(data.svg);

        const element: WhiteboardElement = {
          id: crypto.randomUUID(),
          type: "svg-path",
          position: {
            x: 300 + Math.random() * 400,
            y: 150 + Math.random() * 300,
          },
          size: { width: 200, height: 200 },
          rotation: 0,
          startFrame: currentFrame,
          durationFrames: 180,
          animationType: "draw",
          drawSpeed: 60,
          opacity: 1,
          zIndex: elements.length,
          locked: false,
          visible: true,
          data: pathData,
        };
        addElement(element);
      } finally {
        setAddingIcon(null);
      }
    },
    [addElement, currentFrame, elements.length]
  );

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-xs text-[var(--text-muted)]">
        Loading 5,000 icons...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedCategory(null);
        }}
        placeholder="Search 5,000 icons..."
        className="w-full rounded bg-[var(--surface-light)] px-2 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
      />

      {/* Category pills */}
      {!search && (
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded px-2 py-0.5 text-[10px] transition-colors ${
              !selectedCategory
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface-light)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            All ({allIcons.length})
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const count = allIcons.filter((i) =>
              i.categories.includes(cat)
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded px-2 py-0.5 text-[10px] transition-colors ${
                  selectedCategory === cat
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--surface-light)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Result count */}
      <div className="text-[10px] text-[var(--text-muted)]">
        {filteredIcons.length} icons
        {visibleCount < filteredIcons.length &&
          ` (showing ${visibleCount})`}
      </div>

      {/* Icon grid - scrollable */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 320px)" }}
      >
        <div className="grid grid-cols-3 gap-1">
          {visibleIcons.map((icon) => (
            <button
              key={icon.name}
              onClick={() => handleAddIcon(icon.name)}
              disabled={addingIcon === icon.name}
              className="group flex flex-col items-center gap-0.5 rounded bg-[var(--surface-light)] p-1.5 hover:bg-[var(--primary)] hover:bg-opacity-20 disabled:opacity-50"
              title={icon.name}
            >
              {/* Lazy-loaded icon preview using Tabler's CDN */}
              <img
                src={`https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/${icon.name}.svg`}
                alt={icon.name}
                width={28}
                height={28}
                loading="lazy"
                className="h-7 w-7 invert"
                style={{ filter: "invert(0.85)" }}
              />
              <span className="w-full truncate text-center text-[8px] text-[var(--text-muted)] group-hover:text-[var(--foreground)]">
                {icon.name.replace(/-/g, " ")}
              </span>
            </button>
          ))}
        </div>

        {/* Load more indicator */}
        {visibleCount < filteredIcons.length && (
          <div className="py-3 text-center text-[10px] text-[var(--text-muted)]">
            Scroll for more...
          </div>
        )}
      </div>
    </div>
  );
};
