"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/loading-button";
import { useSession, type Session } from "@/lib/fake-auth";
import { useProgress, type Progress } from "@/lib/progress";
import { DashboardShell } from "./dashboard-shell";

// Logged-in page wrapper: sends visitors without a (fake) session to login, waits for saved
// progress, then renders the dashboard shell around the page content.
export function AuthedPage({
  active,
  children,
}: {
  active: string;
  children: (ctx: { session: Session; progress: Progress }) => React.ReactNode;
}) {
  const router = useRouter();
  const session = useSession();
  const progress = useProgress();

  useEffect(() => {
    if (session === null) router.replace("/auth/login");
  }, [session, router]);

  if (!session || !progress) {
    return (
      <main className="flex min-h-dvh flex-1 items-center justify-center text-muted" aria-busy="true">
        <Spinner className="size-8" />
      </main>
    );
  }

  return (
    <DashboardShell session={session} progress={progress} active={active}>
      {children({ session, progress })}
    </DashboardShell>
  );
}
