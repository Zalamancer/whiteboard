"use client";

import React, { useState, useCallback, useRef } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import type { Project, VideoStyle, AspectRatio } from "@/store/types";
import { VIDEO_STYLES, ASPECT_RATIOS } from "@/lib/video-styles";

type GenerateStage = "input" | "generating-script" | "review-script" | "generating-project" | "complete" | "error";
type InputMode = "topic" | "document";

interface GenerateDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ScriptScene {
  title: string;
  narration: string;
  visualDescriptions: string[];
  duration: number;
}

interface Script {
  title: string;
  scenes: ScriptScene[];
}

export const GenerateDialog: React.FC<GenerateDialogProps> = ({ open, onClose }) => {
  const setProject = useProjectStore((s) => s.setProject);

  // Input mode
  const [inputMode, setInputMode] = useState<InputMode>("topic");

  // Topic inputs
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("General audience");
  const [tone, setTone] = useState("Professional but friendly");
  const [length, setLength] = useState("Medium (60s)");

  // Style & aspect ratio
  const [videoStyle, setVideoStyle] = useState<VideoStyle>("classic-whiteboard");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");

  // Document inputs
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<GenerateStage>("input");
  const [script, setScript] = useState<Script | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerateScript = useCallback(async () => {
    if (!topic.trim()) return;

    setStage("generating-script");
    setErrorMessage("");

    try {
      const res = await fetch("/api/whiteboard/ai/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, tone, length }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate script");

      setScript(data.script);
      setStage("review-script");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      setStage("error");
    }
  }, [topic, audience, tone, length]);

  const handleDocumentUpload = useCallback(async () => {
    if (!selectedFile) return;

    setStage("generating-script");
    setUploadProgress("Uploading document...");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setUploadProgress("Extracting text & generating script...");

      const res = await fetch("/api/whiteboard/ai/document-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process document");

      setScript(data.script);
      setStage("review-script");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      setStage("error");
    } finally {
      setUploadProgress("");
    }
  }, [selectedFile]);

  const handleGenerateProject = useCallback(async () => {
    if (!script) return;

    setStage("generating-project");

    try {
      const res = await fetch("/api/whiteboard/ai/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, videoStyle, aspectRatio }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate project");

      setProject(data.project as Project);
      setStage("complete");

      setTimeout(() => onClose(), 800);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      setStage("error");
    }
  }, [script, videoStyle, aspectRatio, setProject, onClose]);

  const handleReset = useCallback(() => {
    setStage("input");
    setScript(null);
    setErrorMessage("");
    setSelectedFile(null);
    setUploadProgress("");
    setVideoStyle("classic-whiteboard");
    setAspectRatio("16:9");
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  if (!open) return null;

  const isGenerating = stage === "generating-script" || stage === "generating-project";

  const getFileIcon = (name: string) => {
    if (name.endsWith(".pdf")) return "PDF";
    if (name.endsWith(".docx") || name.endsWith(".doc")) return "DOC";
    if (name.endsWith(".txt")) return "TXT";
    if (name.endsWith(".md")) return "MD";
    return "FILE";
  };

  const canGenerate =
    inputMode === "topic" ? topic.trim().length > 0 : selectedFile !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[560px] max-h-[85vh] flex flex-col rounded-xl bg-[var(--surface)] shadow-2xl border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              AI Video Generator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-light)] hover:text-[var(--foreground)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 2L12 12M12 2L2 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* INPUT STAGE */}
          {(stage === "input" || stage === "error") && (
            <>
              {/* Mode tabs */}
              <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                <button
                  onClick={() => setInputMode("topic")}
                  className={`flex-1 px-4 py-2 text-xs font-medium transition-colors ${
                    inputMode === "topic"
                      ? "bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  From Topic
                </button>
                <button
                  onClick={() => setInputMode("document")}
                  className={`flex-1 px-4 py-2 text-xs font-medium transition-colors border-l border-[var(--border)] ${
                    inputMode === "document"
                      ? "bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  From Document
                </button>
              </div>

              {/* Video Style & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Video Style
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.values(VIDEO_STYLES).map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setVideoStyle(style.id)}
                        className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 transition-colors ${
                          videoStyle === style.id
                            ? "border-[var(--primary)] bg-[var(--primary)] bg-opacity-10"
                            : "border-[var(--border)] hover:border-[var(--text-muted)]"
                        }`}
                        title={style.description}
                      >
                        <div className="flex gap-0.5">
                          {style.thumbnailColors.map((c, i) => (
                            <span
                              key={i}
                              className="h-3 w-3 rounded-sm border border-black/10"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <span className={`text-[8px] font-medium leading-tight text-center ${
                          videoStyle === style.id
                            ? "text-[var(--primary)]"
                            : "text-[var(--text-muted)]"
                        }`}>
                          {style.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Aspect Ratio
                  </label>
                  <div className="space-y-1.5">
                    {Object.entries(ASPECT_RATIOS).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => setAspectRatio(key as AspectRatio)}
                        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-left transition-colors ${
                          aspectRatio === key
                            ? "border-[var(--primary)] bg-[var(--primary)] bg-opacity-10"
                            : "border-[var(--border)] hover:border-[var(--text-muted)]"
                        }`}
                      >
                        <span
                          className={`block rounded-sm border ${
                            aspectRatio === key
                              ? "border-[var(--primary)]"
                              : "border-[var(--text-muted)]"
                          }`}
                          style={{
                            width: key === "9:16" ? 10 : key === "1:1" ? 14 : key === "4:3" ? 16 : 18,
                            height: key === "9:16" ? 18 : key === "1:1" ? 14 : key === "4:3" ? 12 : 10,
                          }}
                        />
                        <span className={`text-[10px] font-medium ${
                          aspectRatio === key
                            ? "text-[var(--primary)]"
                            : "text-[var(--text-muted)]"
                        }`}>
                          {val.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {inputMode === "topic" ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                      Topic / Subject
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., How solar panels work, Benefits of meditation..."
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-light)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleGenerateScript()}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        Audience
                      </label>
                      <select
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-light)] px-3 py-2 text-xs text-[var(--foreground)] outline-none"
                      >
                        <option>General audience</option>
                        <option>Students</option>
                        <option>Business professionals</option>
                        <option>Kids (ages 8-12)</option>
                        <option>Developers</option>
                        <option>Beginners</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        Tone
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-light)] px-3 py-2 text-xs text-[var(--foreground)] outline-none"
                      >
                        <option>Professional but friendly</option>
                        <option>Casual and fun</option>
                        <option>Formal and educational</option>
                        <option>Exciting and energetic</option>
                        <option>Calm and soothing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                      Video Length
                    </label>
                    <div className="flex gap-2">
                      {["Short (30s)", "Medium (60s)", "Long (90s)"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setLength(opt)}
                          className={`flex-1 rounded-lg border px-3 py-2 text-xs transition-colors ${
                            length === opt
                              ? "border-[var(--primary)] bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]"
                              : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* DOCUMENT UPLOAD MODE */
                <div className="space-y-3">
                  <div
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--surface-light)] px-6 py-10 cursor-pointer transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:bg-opacity-5"
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <polyline points="9,15 12,12 15,15" />
                    </svg>
                    <div className="text-center">
                      <p className="text-xs font-medium text-[var(--foreground)]">
                        Drop your document here
                      </p>
                      <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                        or click to browse &middot; PDF, DOCX, TXT, MD
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,.txt,.md"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {selectedFile && (
                    <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-light)] px-4 py-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded bg-green-500/10 text-[10px] font-bold text-green-400">
                        {getFileIcon(selectedFile.name)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--foreground)] truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="flex h-5 w-5 items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--foreground)]"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 2L10 10M10 2L2 10" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <p className="text-[10px] text-[var(--text-muted)] text-center">
                    AI will extract key points from your document and create a whiteboard video script
                  </p>
                </div>
              )}

              {stage === "error" && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                  {errorMessage}
                </div>
              )}
            </>
          )}

          {/* GENERATING SCRIPT */}
          {stage === "generating-script" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-3 border-[var(--surface-light)] border-t-[var(--primary)]" />
              <p className="text-sm font-medium text-[var(--foreground)]">
                {uploadProgress || "Generating script..."}
              </p>
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                {inputMode === "document"
                  ? "Extracting text and creating video script"
                  : "AI is writing your whiteboard video script"}
              </p>
            </div>
          )}

          {/* REVIEW SCRIPT */}
          {stage === "review-script" && script && (
            <>
              <div className="rounded-lg bg-[var(--surface-light)] px-4 py-3">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  {script.title}
                </h3>
                <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                  {script.scenes.length} scenes &middot; ~{script.scenes.reduce((t, s) => t + s.duration, 0)}s total
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-2 py-0.5 text-[9px] text-[var(--text-muted)]">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: VIDEO_STYLES[videoStyle].thumbnailColors[2] }} />
                    {VIDEO_STYLES[videoStyle].name}
                  </span>
                  <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[9px] text-[var(--text-muted)]">
                    {ASPECT_RATIOS[aspectRatio].label}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {script.scenes.map((scene, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-[var(--border)] p-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-xs font-semibold text-[var(--foreground)]">
                        {scene.title}
                      </span>
                      <span className="ml-auto text-[10px] text-[var(--text-muted)]">
                        {scene.duration}s
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mb-2">
                      {scene.narration}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {scene.visualDescriptions.map((desc, j) => (
                        <span
                          key={j}
                          className="rounded-full bg-[var(--surface-light)] px-2 py-0.5 text-[9px] text-[var(--text-muted)]"
                        >
                          {desc}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* GENERATING PROJECT */}
          {stage === "generating-project" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-3 border-[var(--surface-light)] border-t-green-500" />
              <p className="text-sm font-medium text-[var(--foreground)]">
                Building video...
              </p>
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                Matching icons, positioning elements, setting up animations
              </p>
            </div>
          )}

          {/* COMPLETE */}
          {stage === "complete" && (
            <div className="flex flex-col items-center justify-center py-12">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4">
                <circle cx="24" cy="24" r="24" fill="#22c55e" fillOpacity="0.15" />
                <path d="M16 24L22 30L32 18" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Video generated!
              </p>
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                Your whiteboard video is ready to edit
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] px-6 py-4 shrink-0">
          {stage === "input" || stage === "error" ? (
            <>
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                onClick={inputMode === "topic" ? handleGenerateScript : handleDocumentUpload}
                disabled={!canGenerate}
                className="rounded-lg bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
              >
                {inputMode === "topic" ? "Generate Script" : "Upload & Generate"}
              </button>
            </>
          ) : stage === "review-script" ? (
            <>
              <button
                onClick={handleReset}
                className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)]"
              >
                Start Over
              </button>
              <button
                onClick={handleGenerateProject}
                className="rounded-lg bg-green-600 px-5 py-2 text-xs font-semibold text-white hover:bg-green-500"
              >
                Build Video
              </button>
            </>
          ) : stage === "complete" ? (
            <button
              onClick={onClose}
              className="rounded-lg bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)]"
            >
              Start Editing
            </button>
          ) : isGenerating ? (
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)]"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
