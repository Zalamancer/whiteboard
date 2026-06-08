"use client";

import React, { useState, useCallback } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import type { AudioTrack } from "@/store/types";

interface VoiceOption {
  id: string;
  name: string;
  desc: string;
  accent: string;
  gender: "female" | "male" | "neutral";
}

const VOICES: VoiceOption[] = [
  { id: "nova", name: "Nova", desc: "Warm, friendly", accent: "American", gender: "female" },
  { id: "alloy", name: "Alloy", desc: "Neutral, balanced", accent: "American", gender: "neutral" },
  { id: "echo", name: "Echo", desc: "Deep, resonant", accent: "American", gender: "male" },
  { id: "fable", name: "Fable", desc: "Storyteller", accent: "British", gender: "male" },
  { id: "onyx", name: "Onyx", desc: "Authoritative", accent: "American", gender: "male" },
  { id: "shimmer", name: "Shimmer", desc: "Bright, upbeat", accent: "American", gender: "female" },
];

const LANGUAGES = [
  { code: "en", name: "English", flag: "EN" },
  { code: "es", name: "Spanish", flag: "ES" },
  { code: "fr", name: "French", flag: "FR" },
  { code: "de", name: "German", flag: "DE" },
  { code: "it", name: "Italian", flag: "IT" },
  { code: "pt", name: "Portuguese", flag: "PT" },
  { code: "ja", name: "Japanese", flag: "JP" },
  { code: "ko", name: "Korean", flag: "KR" },
  { code: "zh", name: "Chinese", flag: "CN" },
  { code: "hi", name: "Hindi", flag: "HI" },
  { code: "ar", name: "Arabic", flag: "AR" },
  { code: "tr", name: "Turkish", flag: "TR" },
];

interface VoiceoverPanelProps {
  open: boolean;
  onClose: () => void;
}

export const VoiceoverPanel: React.FC<VoiceoverPanelProps> = ({ open, onClose }) => {
  const addAudioTrack = useProjectStore((s) => s.addAudioTrack);

  const [text, setText] = useState("");
  const [voice, setVoice] = useState("nova");
  const [speed, setSpeed] = useState(1.0);
  const [language, setLanguage] = useState("en");
  const [genderFilter, setGenderFilter] = useState<"all" | "female" | "male" | "neutral">("all");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const filteredVoices = genderFilter === "all"
    ? VOICES
    : VOICES.filter((v) => v.gender === genderFilter);

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) return;

    setGenerating(true);
    setError("");
    setPreviewUrl(null);

    try {
      const res = await fetch("/api/whiteboard/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "TTS failed");

      setPreviewUrl(data.audioUrl);

      // Auto-add to timeline
      const track: AudioTrack = {
        id: crypto.randomUUID(),
        type: "voiceover",
        name: `Voiceover (${VOICES.find((v) => v.id === voice)?.name || voice})`,
        src: data.audioUrl,
        startFrame: 0,
        durationFrames: Math.round(data.duration * 30),
        volume: 1,
        fadeInFrames: 0,
        fadeOutFrames: 10,
      };
      addAudioTrack(track);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGenerating(false);
    }
  }, [text, voice, speed, addAudioTrack]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[480px] rounded-xl bg-[var(--surface)] shadow-2xl border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            AI Voiceover
          </h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-light)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 2L12 12M12 2L2 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* Narration text */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Narration Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your narration text here..."
              rows={4}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-light)] px-3 py-2 text-xs text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
            />
            <div className="mt-1 text-right text-[9px] text-[var(--text-muted)]">
              {text.length}/4096 chars
            </div>
          </div>

          {/* Language selector */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-light)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[9px] text-[var(--text-muted)]">
              Write narration in your chosen language. OpenAI TTS supports automatic language detection.
            </p>
          </div>

          {/* Voice selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Voice
              </label>
              <div className="flex gap-1">
                {(["all", "female", "male", "neutral"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`rounded px-2 py-0.5 text-[8px] font-medium transition-colors ${
                      genderFilter === g
                        ? "bg-[var(--primary)] bg-opacity-15 text-[var(--primary)]"
                        : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {g === "all" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {filteredVoices.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVoice(v.id)}
                  className={`rounded-lg border px-2 py-2 text-left transition-colors ${
                    voice === v.id
                      ? "border-[var(--primary)] bg-[var(--primary)] bg-opacity-10"
                      : "border-[var(--border)] hover:border-[var(--foreground)]"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-semibold text-[var(--foreground)]">
                      {v.name}
                    </span>
                    <span className="rounded bg-[var(--surface-light)] px-1 py-px text-[7px] text-[var(--text-muted)]">
                      {v.accent}
                    </span>
                  </div>
                  <div className="text-[9px] text-[var(--text-muted)]">
                    {v.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Speed */}
          <div>
            <label className="mb-1.5 flex justify-between text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
              <span>Speed</span>
              <span className="normal-case tracking-normal text-[var(--foreground)]">
                {speed.toFixed(1)}x
              </span>
            </label>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="rounded-lg bg-[var(--surface-light)] p-3">
              <p className="mb-2 text-[10px] font-medium text-[var(--text-muted)]">
                Preview (added to timeline)
              </p>
              <audio controls src={previewUrl} className="w-full h-8" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)]"
          >
            Close
          </button>
          <button
            onClick={handleGenerate}
            disabled={!text.trim() || generating}
            className="rounded-lg bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate Voiceover"}
          </button>
        </div>
      </div>
    </div>
  );
};
