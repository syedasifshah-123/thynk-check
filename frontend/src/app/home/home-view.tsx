"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LEARN_ITEMS } from "@/components/dashboard/nav-items";
import { SECTION } from "@/components/lesson/lessons";
import { Spinner } from "@/components/loading-button";
import { Mascot } from "@/components/mascot";
import { toast } from "@/components/toast/toast-store";
import { useSession } from "@/lib/fake-auth";
import { streakDays, useProgress, xpToday, type Progress } from "@/lib/progress";

const DAILY_GOAL_XP = 50;
const COMING_SOON = ["brain", "games", "iq"];

// Logged-in home dashboard. Visitors without a (fake) session go to login.
export function HomeView() {
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

  const firstName = session.name.split(" ")[0];
  const doneCount = SECTION.lessons.filter((lesson) => progress[lesson.id]).length;
  const totalXp = SECTION.lessons.reduce((sum, lesson) => sum + (progress[lesson.id]?.bestXp ?? 0), 0);
  const streak = streakDays(progress);
  // The first lesson not done yet is the one we nudge towards.
  const upNext = SECTION.lessons.find((lesson) => !progress[lesson.id]);

  return (
    <DashboardShell session={session} active="home">
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:px-8 sm:pt-10">
        {/* Greeting */}
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <Mascot className="pointer-events-none size-16 shrink-0 select-none sm:size-20" />
            <div>
              <p className="text-muted">Welcome back, {firstName}</p>
              <h1 className="font-headline text-4xl leading-none tracking-[-0.02em] sm:text-5xl">Ready to thynk?</h1>
            </div>
          </div>
          <Link
            href={`/home/${(upNext ?? SECTION.lessons[0]).id}`}
            className="btn btn-primary h-12 w-full px-6 text-base sm:w-auto"
          >
            {upNext ? `Continue: ${upNext.title}` : "Replay a lesson"}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          <Stat icon={<FlameGlyph />} tone="bg-orange-500/15 text-orange-500" value={`${streak}`} label={streak === 1 ? "Day streak" : "Days streak"} />
          <Stat icon={<SparkGlyph />} tone="bg-primary/15 text-primary" value={`${totalXp}`} label="Total XP" />
          <Stat icon={<CheckGlyph />} tone="bg-sky-500/15 text-sky-500" value={`${doneCount}/${SECTION.lessons.length}`} label="Lessons done" />
        </div>

        {/* Side rail only from xl; below that it drops under the section (two-up on tablets) */}
        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <SectionCard progress={progress} doneCount={doneCount} totalXp={totalXp} upNextId={upNext?.id} />

          <div className="grid items-start gap-6 sm:grid-cols-2 xl:grid-cols-1">
            <DailyGoal xp={xpToday(progress)} />
            <ComingSoon />
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}

function Stat({ icon, tone, value, label }: { icon: React.ReactNode; tone: string; value: string; label: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-[22px] border-2 border-border bg-surface p-3.5 shadow-[0_4px_0_var(--border)] sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl sm:size-12 ${tone}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block font-cofo text-2xl font-bold leading-none tabular-nums sm:text-3xl">{value}</span>
        <span className="mt-1 block truncate text-xs text-muted sm:text-sm">{label}</span>
      </span>
    </div>
  );
}

function SectionCard({ progress, doneCount, totalXp, upNextId }: { progress: Progress; doneCount: number; totalXp: number; upNextId?: string }) {
  return (
    <section className="overflow-hidden rounded-[28px] border-2 border-border bg-surface shadow-[0_4px_0_var(--border)]">
      <div className="flex items-center gap-4 border-b-2 border-border p-5 sm:gap-6 sm:p-7">
        <SectionArt />
        <div className="min-w-0">
          <p className="font-cofo text-xs font-bold uppercase tracking-[0.12em] text-primary">{SECTION.label}</p>
          <h2 className="mt-1 font-headline text-3xl leading-none tracking-[-0.02em] sm:text-4xl">{SECTION.title}</h2>
          <p className="mt-2 text-muted">{SECTION.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-5 pt-5 sm:px-7">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-700"
            style={{ width: `${(doneCount / SECTION.lessons.length) * 100}%` }}
          />
        </div>
        <p className="shrink-0 font-cofo text-sm font-bold text-muted">
          {doneCount}/{SECTION.lessons.length} done · {totalXp} XP
        </p>
      </div>

      <ol className="flex flex-col gap-3 p-5 sm:p-7">
        {SECTION.lessons.map((lesson, i) => {
          const result = progress[lesson.id];
          const isNext = lesson.id === upNextId;
          return (
            <li key={lesson.id}>
              <Link
                href={`/home/${lesson.id}`}
                className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition-colors sm:p-5 ${
                  isNext
                    ? "border-primary bg-primary/5 shadow-[0_3px_0_var(--primary-shadow)]"
                    : "border-border shadow-[0_3px_0_var(--border)] hover:border-border-strong"
                }`}
              >
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-full font-cofo text-lg font-bold ${
                    result
                      ? "bg-primary text-primary-foreground"
                      : isNext
                        ? "border-2 border-primary text-primary"
                        : "border-2 border-border-strong text-muted"
                  }`}
                >
                  {result ? <CheckGlyph /> : i + 1}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-cofo text-lg font-bold">{lesson.title}</span>
                    <span className="rounded-full bg-foreground/[0.07] px-2.5 py-0.5 font-cofo text-xs font-bold text-muted">{lesson.level}</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {lesson.blurb} · {lesson.questions.length} questions
                    {result && <span className="text-primary"> · Best {result.bestXp} XP</span>}
                  </span>
                </span>

                <span
                  className={`btn btn-sm hidden h-10 shrink-0 px-5 text-base sm:inline-flex ${isNext ? "btn-primary" : "btn-secondary"}`}
                  aria-hidden="true"
                >
                  {result ? "Replay" : "Start"}
                </span>
                <svg className="size-5 shrink-0 text-muted sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function DailyGoal({ xp }: { xp: number }) {
  const ratio = Math.min(xp / DAILY_GOAL_XP, 1);
  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <section className="rounded-[28px] border-2 border-border bg-surface p-5 shadow-[0_4px_0_var(--border)] sm:p-6">
      <h2 className="font-cofo text-lg font-bold">Daily goal</h2>
      <div className="mt-4 flex items-center gap-5">
        <svg viewBox="0 0 80 80" className="size-20 shrink-0 -rotate-90" aria-hidden="true">
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
          <p className="font-cofo text-2xl font-bold tabular-nums">
            {Math.min(xp, DAILY_GOAL_XP)}
            <span className="text-base text-muted">/{DAILY_GOAL_XP} XP</span>
          </p>
          <p className="mt-1 text-sm text-muted">{ratio >= 1 ? "Goal smashed. Brilliant thynking!" : "Finish a lesson to fill your ring."}</p>
        </div>
      </div>
    </section>
  );
}

function ComingSoon() {
  const items = LEARN_ITEMS.filter((item) => COMING_SOON.includes(item.id));

  return (
    <section className="rounded-[28px] border-2 border-border bg-surface p-5 shadow-[0_4px_0_var(--border)] sm:p-6">
      <h2 className="font-cofo text-lg font-bold">Coming soon</h2>
      <ul className="mt-3 flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toast.warning(`${item.label} is coming soon!`)}
              className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-foreground/[0.06]">{item.icon}</span>
              <span className="flex-1 font-cofo font-bold">{item.label}</span>
              <span className="rounded-full border-2 border-border px-2 py-0.5 font-cofo text-[11px] font-bold uppercase tracking-wide">Soon</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Small scale illustration for the section header.
function SectionArt() {
  return (
    <svg viewBox="0 0 96 96" className="size-20 shrink-0 sm:size-24" aria-hidden="true">
      <rect width="96" height="96" rx="24" fill="color-mix(in srgb, var(--primary) 14%, transparent)" />
      <path d="M30 40 L40 23 L50 40 Z" fill="#f6c343" stroke="#c99212" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="52" y="24" width="16" height="16" rx="3" fill="#6d8cff" stroke="#4363d8" strokeWidth="2" />
      <rect x="22" y="42" width="52" height="5" rx="2" fill="#c4c4c4" />
      <path d="M26 51 H70 L73 72 H23 Z" fill="#4b4b4b" />
      <rect x="31" y="55" width="34" height="11" rx="2" fill="#f3f3f3" />
      <text x="48" y="64" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#111">
        12
      </text>
    </svg>
  );
}

function FlameGlyph() {
  return (
    <svg className="size-5 sm:size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4-10-2.5 1.5-3.5 4-3.5 6-1-.5-2-2-2-3.5C6.5 9.5 5 12 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}
function SparkGlyph() {
  return (
    <svg className="size-5 sm:size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" />
    </svg>
  );
}
function CheckGlyph() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
