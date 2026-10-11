"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { Spinner } from "@/components/loading-button";
import { useSession } from "@/lib/fake-auth";
import { findLesson, isPlayable, lessonHref, lessonKey, mathProgress, sectionLessons, toLessonContent } from "@/lib/math/curriculum";
import { saveLessonResult, useProgress } from "@/lib/progress";

export function LessonView({ sectionId, lessonId }: { sectionId: string; lessonId: string }) {
  const router = useRouter();
  const session = useSession();
  const progress = useProgress();
  // The router keeps visited pages alive in the background. Bump the key when this page is
  // hidden, so coming back to a lesson starts it fresh instead of on the old finish screen.
  const [visit, setVisit] = useState(0);
  useEffect(() => () => setVisit((v) => v + 1), []);

  useEffect(() => {
    if (session === null) router.replace("/auth/login");
  }, [session, router]);

  const found = findLesson(sectionId, lessonId);
  if (!session || !progress || !found || !isPlayable(found.lesson)) {
    return (
      <main className="flex min-h-dvh items-center justify-center text-muted" aria-busy="true">
        <Spinner className="size-8" />
      </main>
    );
  }

  const { section, lesson } = found;
  const sectionHref = `/math/${section.id}`;
  const state = mathProgress(progress).sections[section.id].lessons[lesson.id];

  // Typed-in URL for a lesson that isn't unlocked yet.
  if (state === "locked") {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <div className="max-w-sm rounded-[24px] border-2 border-border bg-surface p-6 text-center shadow-[0_4px_0_var(--border)]">
          <p className="font-cofo text-xs font-bold uppercase tracking-[0.12em] text-muted">Lesson {lesson.number} · Locked</p>
          <h1 className="mt-1 font-cofo text-xl font-bold">{lesson.title}</h1>
          <p className="mt-2 text-sm text-muted">Finish the lessons before this one to unlock it.</p>
          <Link href={sectionHref} className="btn btn-secondary mt-5 h-11 w-full text-base">
            Back to {section.short}
          </Link>
        </div>
      </main>
    );
  }

  const lessons = sectionLessons(section);
  const next = lessons.slice(lessons.indexOf(lesson) + 1).find(isPlayable);

  return (
    <LessonPlayer
      key={visit}
      lesson={toLessonContent(lesson)}
      eyebrow={`${section.short} · Lesson ${lesson.number}`}
      color={section.color}
      exitHref={sectionHref}
      nextLesson={next && { href: lessonHref(section.id, next.id), title: next.title }}
      onComplete={(xp) => saveLessonResult(lessonKey(section.id, lesson.id), xp)}
    />
  );
}
