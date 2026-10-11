"use client";

import { useEffect } from "react";

// Registers /sw.js (offline fallback + cached static assets). Production only:
// a service worker in `next dev` would cache stale builds while you're editing.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
  }, []);

  return null;
}
