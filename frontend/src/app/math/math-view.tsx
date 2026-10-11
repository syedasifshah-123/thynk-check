"use client";

import { AuthedPage } from "@/components/dashboard/authed-page";
import { MathCourseCard } from "@/components/math/course-card";

export function MathView() {
  return (
    <AuthedPage active="math">
      {({ progress }) => (
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-5 sm:px-8 sm:pt-10">
          <h1 className="font-headline text-[1.75rem] leading-none tracking-[-0.02em] sm:text-5xl">Your topics</h1>
          <p className="mt-2 text-sm text-muted sm:text-base">Sections unlock in order. Finish one to open the next.</p>
          <div className="mt-6 sm:mt-10">
            <MathCourseCard progress={progress} layout="grid" />
          </div>
        </main>
      )}
    </AuthedPage>
  );
}
