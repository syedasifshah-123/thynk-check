"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { findLesson, SECTION } from "@/components/lesson/lessons";
import { Spinner } from "@/components/loading-button";
import { useSession } from "@/lib/fake-auth";
import { saveLessonResult } from "@/lib/progress";

export function LessonView({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const session = useSession();
  // The router keeps visited pages alive in the background. Bump the key when this page is
  // hidden, so coming back to a lesson starts it fresh instead of on the old finish screen.
  const [visit, setVisit] = useState(0);
  useEffect(() => () => setVisit((v) => v + 1), []);

  useEffect(() => {
    if (session === null) router.replace("/auth/login");
  }, [session, router]);

  const lesson = findLesson(lessonId);
  if (!session || !lesson) {
    return (
      <main className="flex min-h-dvh items-center justify-center text-muted" aria-busy="true">
        <Spinner className="size-8" />
      </main>
    );
  }

  const next = SECTION.lessons[SECTION.lessons.indexOf(lesson) + 1];

  return (
    <LessonPlayer
      key={visit}
      lesson={lesson}
      exitHref="/home"
      nextLesson={next && { href: `/home/${next.id}`, title: next.title }}
      onComplete={(xp) => saveLessonResult(lesson.id, xp)}
    />
  );
}
