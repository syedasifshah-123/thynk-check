"use client";

import { useSyncExternalStore } from "react";
import { dismiss, getServerToasts, getToasts, subscribe, type ToastType } from "./toast-store";

// Toast stack: top-center on mobile, top-right from `sm` up (just below the navbar so it
// doesn't cover the theme toggle / Log out). Click a toast to close it.
export function Toaster() {
  const toasts = useSyncExternalStore(subscribe, getToasts, getServerToasts);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:right-8 sm:top-[100px] sm:items-end sm:px-0"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.type === "error" ? "alert" : "status"}
          onClick={() => dismiss(t.id)}
          className={`toast pointer-events-auto ${t.leaving ? "toast-leave" : ""}`}
        >
          <ToastIcon type={t.type} />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

const ICON_BG: Record<ToastType, string> = {
  success: "bg-primary",
  error: "bg-red-500",
  warning: "bg-amber-500",
};

function ToastIcon({ type }: { type: ToastType }) {
  return (
    <span className={`grid size-7 shrink-0 place-items-center rounded-full text-white ${ICON_BG[type]}`} aria-hidden="true">
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        {type === "success" && <path d="M5 12.5l4.5 4.5L19 7.5" />}
        {type === "error" && <path d="M7 7l10 10M17 7L7 17" />}
        {type === "warning" && (
          <>
            <path d="M12 6v8" />
            <path d="M12 18.5h.01" />
          </>
        )}
      </svg>
    </span>
  );
}
