"use client";

import React, { useState, useCallback } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import type { AudioTrack } from "@/store/types";
import { MUSIC_LIBRARY, MOOD_OPTIONS, getMusicSrc, type MusicTrack } from "@/lib/music-library";

interface MusicBrowserProps {
  open: boolean;
  onClose: () => void;
}

export const MusicBrowser: React.FC<MusicBrowserProps> = ({ open, onClose }) => {
  const addAudioTrack = useProjectStore((s) => s.addAudioTrack);
  const fps = useProjectStore((s) => s.project.fps);

  const [moodFilter, setMoodFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedTrackId, setAddedTrackId] = useState<string | null>(null);

  const filteredTracks = MUSIC_LIBRARY.filter((track) => {
    const moodMatch = moodFilter === "all" || track.mood === moodFilter;
    const searchMatch =
      !searchQuery.trim() ||
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return moodMatch && searchMatch;
  });

  const handleAddTrack = useCallback(
    (track: MusicTrack) => {
      const audioTrack: AudioTrack = {
        id: crypto.randomUUID(),
        type: "background",
        name: `${track.name} (${track.mood})`,
        src: getMusicSrc(track.id),
        startFrame: 0,
        durationFrames: track.durationSecs * fps,
        volume: 0.3,
        fadeInFrames: Math.round(fps * 2), // 2 sec fade in
        fadeOutFrames: Math.round(fps * 3), // 3 sec fade out
      };
      addAudioTrack(audioTrack);
      setAddedTrackId(track.id);
      setTimeout(() => setAddedTrackId(null), 2000);
    },
    [addAudioTrack, fps]
  );

  if (!open) return null;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[520px] max-h-[80vh] flex flex-col rounded-xl bg-[var(--surface)] shadow-2xl border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Music Library
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-light)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 2L12 12M12 2L2 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-3 border-b border-[var(--border)] space-y-2 shrink-0">
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-light)] px-3 py-2 text-xs text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
          />

          {/* Mood filters */}
          <div className="flex flex-wrap gap-1">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setMoodFilter(mood.id)}
                className={`rounded-full px-2.5 py-1 text-[9px] font-medium transition-colors ${
                  moodFilter === mood.id
                    ? "bg-[var(--primary)] bg-opacity-15 text-[var(--primary)]"
                    : "bg-[var(--surface-light)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {mood.emoji} {mood.label}
              </button>
            ))}
          </div>
        </div>

        {/* Track List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
          {filteredTracks.length === 0 ? (
            <p className="text-center py-8 text-xs text-[var(--text-muted)]">
              No tracks match your filters
            </p>
          ) : (
            filteredTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-light)] px-4 py-3 hover:border-[var(--primary)] transition-colors"
              >
                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--foreground)]">
                      {track.name}
                    </span>
                    <span className="rounded-full bg-[var(--surface)] px-1.5 py-px text-[8px] text-[var(--text-muted)]">
                      {track.mood}
                    </span>
                    {track.isLoop && (
                      <span className="rounded-full bg-green-500/10 px-1.5 py-px text-[8px] text-green-400">
                        loop
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[9px] text-[var(--text-muted)] truncate">
                    {track.description}
                  </p>
                  <div className="mt-1 flex gap-3 text-[8px] text-[var(--text-muted)]">
                    <span>{formatDuration(track.durationSecs)}</span>
                    <span>{track.bpm} BPM</span>
                  </div>
                </div>

                {/* Add button */}
                <button
                  onClick={() => handleAddTrack(track)}
                  disabled={addedTrackId === track.id}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-colors ${
                    addedTrackId === track.id
                      ? "bg-green-500/20 text-green-400"
                      : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                  }`}
                >
                  {addedTrackId === track.id ? "Added!" : "Add"}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-3 shrink-0">
          <p className="text-[9px] text-[var(--text-muted)]">
            {filteredTracks.length} track{filteredTracks.length !== 1 ? "s" : ""} &middot; Royalty-free for commercial use
          </p>
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
