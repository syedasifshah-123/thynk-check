"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { Spinner } from "@/components/loading-button";
import { useSession } from "@/lib/fake-auth";

// Logged-in home: the try-out puzzle lesson. Visitors without a (fake) session go to login.
export function HomeView() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session === null) router.replace("/auth/login");
  }, [session, router]);

  if (!session) {
    return (
      <main className="flex min-h-dvh items-center justify-center text-muted" aria-busy="true">
        <Spinner className="size-8" />
      </main>
    );
  }

  return <LessonPlayer onExitHref="/" />;
}
