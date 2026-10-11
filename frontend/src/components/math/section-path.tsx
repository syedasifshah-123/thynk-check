"use client";

import Link from "next/link";
import { useState } from "react";
import { Mascot } from "@/components/mascot";
import {
  isPlayable,
  lessonHref,
  mathProgress,
  sectionLessons,
  type MathLesson,
  type MathSection,
  type NodeState,
} from "@/lib/math/curriculum";
import type { Progress } from "@/lib/progress";
import { SectionArt } from "./section-art";

// Zig-zag offsets (px at full size) so the lesson path snakes like Brilliant's.
const ZIGZAG = [0, 56, 84, 56, 0, -56, -84, -56];

// Section page: an info card + numbered levels (units) with a winding path of numbered lessons.
export function SectionPath({ section, progress }: { section: MathSection; progress: Progress }) {
  const status = mathProgress(progress).sections[section.id];
  const lessons = sectionLessons(section);
  const current = lessons.find((l) => status.lessons[l.id] === "open");
  const [selected, setSelected] = useState<string | undefined>(current?.id);
  const exercises = lessons.reduce((sum, l) => sum + (l.questions?.length ?? 0), 0);

  const accent = {
    "--accent": section.color.main,
    "--accent-shadow": section.color.shadow,
    "--accent-ink": section.color.ink,
  } as React.CSSProperties;

  return (
    <div style={accent} className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-10">
      {/* Section card */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <Link href="/math" className="mb-4 inline-flex items-center gap-1.5 font-cofo text-sm font-bold text-muted hover:text-foreground">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          All sections
        </Link>
        <div className="rounded-[24px] border-2 border-border bg-surface p-5 shadow-[0_4px_0_var(--border)] sm:rounded-[28px] sm:p-7">
          <div className="flex items-center gap-4 lg:block">
            <SectionArt id={section.id} color={section.color} className="size-16 shrink-0 sm:size-24" />
            <div className="min-w-0 lg:mt-4">
              <p className="font-cofo text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--accent)] sm:text-xs">
                Section {section.number} · {section.grade}
              </p>
              <h1 className="mt-1 font-cofo text-xl font-bold leading-tight sm:text-3xl">{section.title}</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted sm:mt-4 sm:text-base">{section.description}</p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-cofo text-sm font-bold sm:mt-5">
            <span className="flex items-center gap-1.5">
              <BookIcon /> {lessons.length} Lessons
            </span>
            <span className="flex items-center gap-1.5">
              <PuzzleIcon /> {exercises} Exercises
            </span>
          </div>

          <div className="mt-4 sm:mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-700"
                style={{ width: `${status.playable ? (status.done / status.playable) * 100 : 0}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted sm:text-sm">
              {status.done}/{status.playable} available lessons done
            </p>
          </div>
        </div>
      </aside>

      {/* Levels + path */}
      <div className="flex flex-col gap-10 pb-6 [--zig:0.55px] sm:[--zig:1px]">
        {section.units.map((unit) => (
          <section key={unit.id} aria-labelledby={`unit-${unit.id}`}>
            <div className="mx-auto max-w-md rounded-[20px] border-2 border-[var(--accent)] bg-surface px-4 py-3 text-center shadow-[0_4px_0_var(--accent-shadow)]">
              <p className="font-cofo text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent)] sm:text-xs">Level {unit.number}</p>
              <h2 id={`unit-${unit.id}`} className="font-cofo text-base font-bold sm:text-lg">
                {unit.title}
              </h2>
            </div>

            <ol className="mt-6 flex flex-col items-center gap-5 sm:mt-8 sm:gap-6">
              {unit.lessons.map((lesson) => {
                const state = status.lessons[lesson.id];
                const offset = ZIGZAG[(lesson.number - 1) % ZIGZAG.length];
                const isSelected = selected === lesson.id;
                return (
                  // extra room above the current lesson for the mascot standing on it
                  <li key={lesson.id} className={`flex w-full flex-col items-center ${lesson.id === current?.id ? "pt-10 sm:pt-12" : ""}`}>
                    <div
                      className="flex items-center gap-3 sm:gap-4"
                      style={{ transform: `translateX(calc(${offset} * var(--zig)))` }}
                    >
                      <LessonNode
                        lesson={lesson}
                        state={state}
                        isCurrent={lesson.id === current?.id}
                        selected={isSelected}
                        onSelect={() => setSelected(isSelected ? undefined : lesson.id)}
                      />
                      <span className={`w-28 font-cofo text-sm font-bold leading-tight sm:w-40 sm:text-base ${state === "locked" || state === "soon" ? "text-muted" : ""}`}>
                        <span className="block text-[11px] uppercase tracking-wide text-muted sm:text-xs">Lesson {lesson.number}</span>
                        {lesson.title}
                      </span>
                    </div>
                    {isSelected && <LessonCard section={section} lesson={lesson} state={state} />}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function LessonNode({
  lesson,
  state,
  isCurrent,
  selected,
  onSelect,
}: {
  lesson: MathLesson;
  state: NodeState;
  isCurrent: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const look: Record<NodeState, string> = {
    done: "bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_5px_0_var(--accent-shadow)]",
    open: "bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_5px_0_var(--accent-shadow)] node-pulse",
    locked: "bg-border text-muted shadow-[0_5px_0_var(--border-strong)]",
    soon: "border-2 border-dashed border-border-strong bg-surface text-muted",
  };

  return (
    <div className="relative">
      {isCurrent && <Mascot className="pointer-events-none absolute -top-12 left-1/2 size-12 -translate-x-1/2 select-none sm:-top-14 sm:size-14" />}
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        aria-label={`Lesson ${lesson.number}: ${lesson.title} (${state})`}
        className={`grid size-14 place-items-center rounded-full font-cofo text-lg font-bold transition-transform active:translate-y-1 sm:size-[68px] sm:text-xl ${look[state]} ${
          selected ? "ring-4 ring-[color-mix(in_srgb,var(--accent)_35%,transparent)]" : ""
        }`}
      >
        {state === "done" ? (
          <svg className="size-6 sm:size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        ) : state === "locked" ? (
          <svg className="size-5 sm:size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        ) : (
          lesson.number
        )}
      </button>
    </div>
  );
}

function LessonCard({ section, lesson, state }: { section: MathSection; lesson: MathLesson; state: NodeState }) {
  const count = lesson.questions?.length ?? 0;
  return (
    <div className="question-in mt-4 w-full max-w-sm rounded-[22px] border-2 border-border bg-surface p-4 text-center shadow-[0_4px_0_var(--border)] sm:p-5">
      <p className="font-cofo text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--accent)] sm:text-xs">Lesson {lesson.number}</p>
      <h3 className="mt-0.5 font-cofo text-lg font-bold sm:text-xl">{lesson.title}</h3>
      {state === "soon" ? (
        <p className="mt-2 text-sm text-muted">This lesson is being built. Check back soon!</p>
      ) : state === "locked" ? (
        <p className="mt-2 text-sm text-muted">Finish the lesson before this one to unlock it.</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">{count} questions · about {Math.max(2, Math.round(count * 0.8))} min</p>
          {isPlayable(lesson) && (
            <Link href={lessonHref(section.id, lesson.id)} className="btn btn-accent mt-4 h-12 w-full text-base sm:text-lg">
              {state === "done" ? "Replay" : "Start"}
            </Link>
          )}
        </>
      )}
    </div>
  );
}

function BookIcon() {
  return (
    <svg className="size-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19V5M19 19v2H6" />
    </svg>
  );
}
function PuzzleIcon() {
  return (
    <svg className="size-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10 3a2 2 0 0 1 4 0v2h4a1 1 0 0 1 1 1v4h-2a2 2 0 1 0 0 4h2v4a1 1 0 0 1-1 1h-4v-2a2 2 0 1 0-4 0v2H6a1 1 0 0 1-1-1v-4h2a2 2 0 1 0 0-4H5V6a1 1 0 0 1 1-1h4z" />
    </svg>
  );
}
