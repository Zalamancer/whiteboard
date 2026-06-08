"use client";

import { EditorLayout } from "@/components/editor/EditorLayout";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

/**
 * Local editor mode — no auth required, works with localStorage.
 * Good for trying the app and for development.
 */
export default function EditorPage() {
  return (
    <ErrorBoundary>
      <EditorLayout />
    </ErrorBoundary>
  );
}
