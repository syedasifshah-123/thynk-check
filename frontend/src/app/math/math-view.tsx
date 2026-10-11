"use client";

import { Spinner } from "@/components/loading-button";
import { AuthedPage } from "@/components/dashboard/authed-page";
import { MathCourseCard } from "@/components/math/course-card";
import type { Session } from "@/lib/fake-auth";
import { useMathProgress } from "@/lib/math/progress-store";

export function MathView() {
  return <AuthedPage active="math">{({ session }) => <MathContent session={session} />}</AuthedPage>;
}

function MathContent({ session }: { session: Session }) {
  const data = useMathProgress(session.email);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-5 sm:px-8 sm:pt-10">
      <h1 className="font-headline text-[1.75rem] leading-none tracking-[-0.02em] sm:text-5xl">Your topics</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Levels unlock in order inside each branch. Advanced branches open once you pass the level they build on.
      </p>
      <div className="mt-6 sm:mt-10">
        {data ? (
          <MathCourseCard data={data} layout="grid" />
        ) : (
          <div className="grid min-h-60 place-items-center text-muted" aria-busy="true">
            <Spinner className="size-8" />
          </div>
        )}
      </div>
    </main>
  );
}
