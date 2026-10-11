// Per-user math progress. Lives in localStorage until there's a backend; everything goes
// through load/save here, so swapping in an API later only touches this file.

import { useMemo, useSyncExternalStore } from "react";
import { saveLessonResult } from "@/lib/progress";
import { applySession, type LevelRecord, type MathProgressData, type SessionResult } from "./session";
import type { Exercise } from "./schema";

const EVENT = "thynk-math-progress-change";
const keyFor = (userKey: string) => `thynk-math:${userKey.toLowerCase()}`;
const EMPTY: MathProgressData = { levels: {} };

function readRaw(userKey: string) {
  try {
    return localStorage.getItem(keyFor(userKey)) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): MathProgressData {
  try {
    const data = raw ? (JSON.parse(raw) as MathProgressData) : EMPTY;
    return data && typeof data === "object" && data.levels ? data : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function loadMathProgress(userKey: string): MathProgressData {
  return parse(readRaw(userKey));
}

function save(userKey: string, data: MathProgressData) {
  try {
    localStorage.setItem(keyFor(userKey), JSON.stringify(data));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Record a finished session. Also reports the level's lifetime XP to the shared Thynk progress
 * store, so dashboard XP, streak and the daily goal include math.
 */
export function recordSession(userKey: string, levelId: string, result: SessionResult, exercises: Exercise[]) {
  const data = loadMathProgress(userKey);
  const byId = Object.fromEntries(exercises.map((e) => [e.id, e]));
  const outcome = applySession(data.levels[levelId], result, byId, Date.now());
  save(userKey, { levels: { ...data.levels, [levelId]: outcome.record } });
  saveLessonResult(`math/${levelId}`, outcome.record.xp);
  return outcome;
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** `undefined` until we're on the client, then this user's math progress. */
export function useMathProgress(userKey: string | undefined): MathProgressData | undefined {
  const raw = useSyncExternalStore(
    subscribe,
    () => (userKey ? readRaw(userKey) : null),
    () => null,
  );
  return useMemo(() => (raw === null ? undefined : parse(raw)), [raw]);
}

export type { LevelRecord };
