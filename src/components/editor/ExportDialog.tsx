"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useProjectStore } from "@/store/useProjectStore";

type ExportFormat = "mp4" | "webm";
type Resolution = "720p" | "1080p" | "4k";
type ExportStage = "idle" | "bundling" | "preparing" | "rendering" | "complete" | "error";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ open, onClose }) => {
  const project = useProjectStore((s) => s.project);
  const getTotalDuration = useProjectStore((s) => s.getTotalDuration);

  const [format, setFormat] = useState<ExportFormat>("mp4");
  const [resolution, setResolution] = useState<Resolution>("1080p");
  const [quality, setQuality] = useState(80);
  const [stage, setStage] = useState<ExportStage>("idle");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [outputFile, setOutputFile] = useState("");
  const [fileSize, setFileSize] = useState("");

  const abortRef = useRef<AbortController | null>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setStage("idle");
      setProgress(0);
      setStatusText("");
      setErrorMessage("");
      setOutputFile("");
      setFileSize("");
    }
  }, [open]);

  const handleExport = useCallback(async () => {
    const controller = new AbortController();
    abortRef.current = controller;

    setStage("bundling");
    setProgress(0);
    setStatusText("Preparing export...");

    try {
      const response = await fetch("/api/whiteboard/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project,
          format,
          resolution,
          quality,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          if (!event.trim()) continue;

          const lines = event.split("\n");
          let eventType = "";
          let eventData = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7);
            } else if (line.startsWith("data: ")) {
              eventData = line.slice(6);
            }
          }

          if (!eventData) continue;

          try {
            const data = JSON.parse(eventData);

            switch (eventType) {
              case "status":
                setStage(data.stage as ExportStage);
                if (data.progress !== undefined) setProgress(data.progress);
                if (data.stage === "bundling") setStatusText("Bundling composition...");
                else if (data.stage === "preparing") setStatusText("Preparing renderer...");
                else if (data.stage === "rendering") setStatusText("Rendering frames...");
                break;

              case "progress":
                setStage("rendering");
                setProgress(data.progress);
                setStatusText(
                  `Rendering: ${data.renderedFrames}/${data.totalFrames} frames (${data.progress}%)`
                );
                break;

              case "complete":
                setStage("complete");
                setProgress(100);
                setOutputFile(data.outputPath);
                setFileSize(data.fileSize);
                setStatusText(`Done! File size: ${data.fileSize} MB`);
                break;

              case "error":
                setStage("error");
                setErrorMessage(data.message);
                setStatusText("Export failed");
                break;
            }
          } catch {
            // Skip malformed events
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setStage("idle");
        setStatusText("Export cancelled");
        return;
      }
      setStage("error");
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      setStatusText("Export failed");
    }
  }, [project, format, resolution, quality]);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    setStage("idle");
    setStatusText("");
  }, []);

  const handleDownload = useCallback(() => {
    if (!outputFile) return;
    const link = document.createElement("a");
    link.href = `/api/whiteboard/render/download?file=${encodeURIComponent(outputFile)}`;
    link.download = `whiteboard-export.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [outputFile, format]);

  const handleClose = useCallback(() => {
    if (stage === "rendering" || stage === "bundling" || stage === "preparing") {
      if (!confirm("Export is in progress. Cancel and close?")) return;
      abortRef.current?.abort();
    }
    onClose();
  }, [stage, onClose]);

  if (!open) return null;

  const totalDuration = getTotalDuration();
  const durationSecs = (totalDuration / (project.fps || 30)).toFixed(1);
  const isExporting = stage === "bundling" || stage === "preparing" || stage === "rendering";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[480px] rounded-xl bg-[var(--surface)] shadow-2xl border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Export Video
          </h2>
          <button
            onClick={handleClose}
            className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-light)] hover:text-[var(--foreground)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 2L12 12M12 2L2 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {/* Project info */}
          <div className="flex items-center justify-between rounded-lg bg-[var(--surface-light)] px-4 py-3">
            <div>
              <div className="text-xs font-medium text-[var(--foreground)]">{project.name}</div>
              <div className="text-[10px] text-[var(--text-muted)]">
                {project.elements.length} elements &middot; {durationSecs}s &middot; {project.fps} fps
              </div>
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              {project.width}&times;{project.height}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Format
            </label>
            <div className="flex gap-2">
              {(["mp4", "webm"] as ExportFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  disabled={isExporting}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    format === f
                      ? "border-[var(--primary)] bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                  } disabled:opacity-50`}
                >
                  <div className="text-sm font-semibold">{f.toUpperCase()}</div>
                  <div className="text-[9px] opacity-60">
                    {f === "mp4" ? "H.264 (Best compatibility)" : "VP8 (Smaller files)"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Resolution
            </label>
            <div className="flex gap-2">
              {(
                [
                  { key: "720p", label: "720p", desc: "1280x720" },
                  { key: "1080p", label: "1080p", desc: "1920x1080" },
                  { key: "4k", label: "4K", desc: "3840x2160" },
                ] as const
              ).map(({ key, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setResolution(key)}
                  disabled={isExporting}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    resolution === key
                      ? "border-[var(--primary)] bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                  } disabled:opacity-50`}
                >
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-[9px] opacity-60">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality slider */}
          {format === "mp4" && (
            <div>
              <label className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                <span>Quality</span>
                <span className="normal-case tracking-normal text-[var(--foreground)]">{quality}%</span>
              </label>
              <input
                type="range"
                min={30}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={isExporting}
                className="w-full accent-[var(--primary)]"
              />
              <div className="mt-0.5 flex justify-between text-[9px] text-[var(--text-muted)]">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {stage !== "idle" && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--foreground)]">
                  {statusText}
                </span>
                {isExporting && (
                  <button
                    onClick={handleCancel}
                    className="text-[10px] text-red-400 hover:text-red-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-light)]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    stage === "complete"
                      ? "bg-green-500"
                      : stage === "error"
                        ? "bg-red-500"
                        : "bg-[var(--primary)]"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error message */}
          {stage === "error" && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] px-6 py-4">
          {stage === "complete" ? (
            <>
              <button
                onClick={handleClose}
                className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)]"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="rounded-lg bg-green-600 px-5 py-2 text-xs font-semibold text-white hover:bg-green-500"
              >
                Download ({fileSize} MB)
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleClose}
                className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="rounded-lg bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
              >
                {isExporting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-3 w-3 animate-spin" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" />
                    </svg>
                    Exporting...
                  </span>
                ) : (
                  "Start Export"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
