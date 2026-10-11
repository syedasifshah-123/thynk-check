"use client";

import Link from "next/link";
import { AuthedPage } from "@/components/dashboard/authed-page";
import { LEARN_ITEMS } from "@/components/dashboard/nav-items";
import { MathCourseCard } from "@/components/math/course-card";
import { Mascot } from "@/components/mascot";
import { toast } from "@/components/toast/toast-store";
import { lessonHref, mathProgress } from "@/lib/math/curriculum";
import { xpToday } from "@/lib/progress";

const DAILY_GOAL_XP = 50;
const COMING_SOON = ["brain", "games", "iq"];

// Logged-in home dashboard: greeting, the Math course, daily goal.
export function HomeView() {
  return (
    <AuthedPage active="home">
      {({ session, progress }) => {
        const firstName = session.name.split(" ")[0];
        const { next } = mathProgress(progress);

        return (
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-5 sm:px-8 sm:pt-10">
            {/* Greeting */}
            <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <Mascot className="pointer-events-none size-12 shrink-0 select-none sm:size-20" />
                <div>
                  <p className="text-sm text-muted sm:text-base">Welcome back, {firstName}</p>
                  <h1 className="font-headline text-[1.75rem] leading-none tracking-[-0.02em] sm:text-5xl">Ready to thynk?</h1>
                </div>
              </div>
              {next ? (
                <Link
                  href={lessonHref(next.section.id, next.lesson.id)}
                  style={{ "--accent": next.section.color.main, "--accent-shadow": next.section.color.shadow, "--accent-ink": next.section.color.ink } as React.CSSProperties}
                  className="btn btn-accent h-12 w-full px-6 text-sm sm:w-auto sm:text-base"
                >
                  Continue: {next.lesson.title}
                </Link>
              ) : (
                <Link href="/math" className="btn btn-primary h-12 w-full px-6 text-sm sm:w-auto sm:text-base">
                  Explore Math
                </Link>
              )}
            </div>

            <div className="mt-8 sm:mt-10">
              <MathCourseCard progress={progress} />
            </div>

            <div className="mt-8 grid items-start gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
              <DailyGoal xp={xpToday(progress)} />
              <ComingSoon />
            </div>
          </main>
        );
      }}
    </AuthedPage>
  );
}

function DailyGoal({ xp }: { xp: number }) {
  const ratio = Math.min(xp / DAILY_GOAL_XP, 1);
  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <section className="rounded-[24px] border-2 border-border bg-surface p-5 shadow-[0_4px_0_var(--border)] sm:rounded-[28px] sm:p-6">
      <h2 className="font-cofo text-base font-bold sm:text-lg">Daily goal</h2>
      <div className="mt-3 flex items-center gap-4 sm:mt-4 sm:gap-5">
        <svg viewBox="0 0 80 80" className="size-16 shrink-0 -rotate-90 sm:size-20" aria-hidden="true">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ratio)}
            className="transition-[stroke-dashoffset] duration-700"
          />
        </svg>
        <div>
          <p className="font-cofo text-xl font-bold tabular-nums sm:text-2xl">
            {Math.min(xp, DAILY_GOAL_XP)}
            <span className="text-sm text-muted sm:text-base">/{DAILY_GOAL_XP} XP</span>
          </p>
          <p className="mt-1 text-xs text-muted sm:text-sm">{ratio >= 1 ? "Goal smashed. Brilliant thynking!" : "Finish a lesson to fill your ring."}</p>
        </div>
      </div>
    </section>
  );
}

function ComingSoon() {
  const items = LEARN_ITEMS.filter((item) => COMING_SOON.includes(item.id));

  return (
    <section className="rounded-[24px] border-2 border-border bg-surface p-5 shadow-[0_4px_0_var(--border)] sm:rounded-[28px] sm:p-6">
      <h2 className="font-cofo text-base font-bold sm:text-lg">Coming soon</h2>
      <ul className="mt-2 flex flex-col gap-1 sm:mt-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toast.warning(`${item.label} is coming soon!`)}
              className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-foreground/[0.06] sm:size-10">{item.icon}</span>
              <span className="flex-1 font-cofo text-sm font-bold sm:text-base">{item.label}</span>
              <span className="rounded-full border-2 border-border px-2 py-0.5 font-cofo text-[10px] font-bold uppercase tracking-wide sm:text-[11px]">Soon</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
