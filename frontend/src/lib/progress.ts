// Lesson progress, kept in localStorage until there's a backend.

import { useMemo, useSyncExternalStore } from "react";

export type LessonResult = { bestXp: number; completedAt: number };
export type Progress = Record<string, LessonResult>;

const KEY = "thynk-progress";
const EVENT = "thynk-progress-change";

function readRaw() {
  try {
    return localStorage.getItem(KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

export function saveLessonResult(lessonId: string, xp: number) {
  const progress = JSON.parse(readRaw()) as Progress;
  const previous = progress[lessonId];
  progress[lessonId] = { bestXp: Math.max(xp, previous?.bestXp ?? 0), completedAt: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const dayKey = (time: number) => new Date(time).toDateString();

/** XP from lessons completed today (best score per lesson). */
export function xpToday(progress: Progress) {
  const today = dayKey(Date.now());
  return Object.values(progress)
    .filter((r) => dayKey(r.completedAt) === today)
    .reduce((sum, r) => sum + r.bestXp, 0);
}

/** Consecutive days (ending today or yesterday) with at least one completed lesson. */
export function streakDays(progress: Progress) {
  const days = new Set(Object.values(progress).map((r) => dayKey(r.completedAt)));
  const cursor = new Date();
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** `undefined` during server render, then the saved progress. */
export function useProgress(): Progress | undefined {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  return useMemo(() => (raw === null ? undefined : (JSON.parse(raw) as Progress)), [raw]);
}
