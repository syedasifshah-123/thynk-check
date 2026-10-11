import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Offline · Thynk",
};

// Served by the service worker (public/sw.js) when a page can't load without a connection.
export default function OfflinePage() {
  return (
    <AuthShell title="You're offline" subtitle="Your brain can rest for a sec. Reconnect and we'll pick up where you left off.">
      {/* A full page load on purpose: retry the network instead of a client-side navigation */}
      <a href="/home" className="btn btn-primary mt-8 h-[52px] w-full text-lg">
        Try again
      </a>
    </AuthShell>
  );
}
