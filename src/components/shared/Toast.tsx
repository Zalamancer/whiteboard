"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback for components outside provider — use console
    return {
      success: (m) => console.info("[toast]", m),
      error: (m) => console.error("[toast]", m),
      info: (m) => console.info("[toast]", m),
    };
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

const TOAST_DURATION = 4000;

const ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M5.5 8L7.5 10L10.5 6" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M6 6L10 10M10 6L6 10" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7V11M8 5V5.5" />
    </svg>
  ),
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const value = useRef<ToastContextValue>({
    success: (m) => addToast(m, "success"),
    error: (m) => addToast(m, "error"),
    info: (m) => addToast(m, "info"),
  });

  // Keep ref callbacks up to date
  useEffect(() => {
    value.current.success = (m) => addToast(m, "success");
    value.current.error = (m) => addToast(m, "error");
    value.current.info = (m) => addToast(m, "info");
  }, [addToast]);

  return (
    <ToastContext.Provider value={value.current}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-2.5 rounded-lg border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur-sm animate-in slide-in-from-right-5 fade-in duration-200"
            style={{
              animation: "toastIn 0.2s ease-out",
            }}
          >
            {ICONS[toast.type]}
            <span className="text-sm text-white/90">{toast.message}</span>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
              className="ml-2 text-white/30 hover:text-white/60"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 2L10 10M10 2L2 10" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Animation keyframe */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
