"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LevelPlayer } from "@/components/lesson/level-player";
import { Spinner } from "@/components/loading-button";
import { useSession } from "@/lib/fake-auth";
import { BRANCHES, findLevel, levelHref } from "@/lib/math/curriculum";
import { loadMathProgress, recordSession, useMathProgress } from "@/lib/math/progress-store";
import type { Branch, Level } from "@/lib/math/schema";
import { buildReview, buildSession, hasContent, levelStatus, type LevelRecord, type Session } from "@/lib/math/session";

type Mode = "level" | "review";

export function LevelView({ branchId, levelNumber, mode }: { branchId: string; levelNumber: number; mode: Mode }) {
  const router = useRouter();
  const session = useSession();
  const data = useMathProgress(session?.email);
  // The router keeps visited pages alive in the background. Bump the key when this page is
  // hidden, so coming back to a level starts it fresh instead of on the old results screen.
  const [visit, setVisit] = useState(0);
  useEffect(() => () => setVisit((v) => v + 1), []);

  useEffect(() => {
    if (session === null) router.replace("/auth/login");
  }, [session, router]);

  const found = findLevel(branchId, levelNumber);
  if (!session || !data || !found || !hasContent(found.level)) {
    return (
      <main className="flex min-h-dvh items-center justify-center text-muted" aria-busy="true">
        <Spinner className="size-8" />
      </main>
    );
  }

  const { branch, level } = found;
  const status = levelStatus(level, branch, BRANCHES, data);

  // Typed-in URL for a level that isn't unlocked yet.
  if (status === "locked") {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <div className="max-w-sm rounded-[24px] border-2 border-border bg-surface p-6 text-center shadow-[0_4px_0_var(--border)]">
          <p className="font-cofo text-xs font-bold uppercase tracking-[0.12em] text-muted">Level {level.number} · Locked</p>
          <h1 className="mt-1 font-cofo text-xl font-bold">{level.title}</h1>
          <p className="mt-2 text-sm text-muted">
            {level.number > 1 ? `Complete Level ${level.number - 1} of ${branch.title} first.` : `Unlock ${branch.title} first.`}
          </p>
          <Link href={`/math/${branch.id}`} className="btn btn-secondary mt-5 h-11 w-full text-base">
            Back to {branch.title}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <LevelRunner
      key={`${visit}-${mode}`}
      userKey={session.email}
      branch={branch}
      level={level}
      initialRecord={data.levels[level.id]}
      initialMode={mode}
    />
  );
}

type Run = { mode: Mode; session: Session; awarded: string[]; n: number };

function build(level: Level, mode: Mode, record: LevelRecord | undefined, n: number): Run {
  // Vary the questions between attempts: level sessions by how many you've played, reviews by run.
  const session = mode === "review" ? buildReview(level, record, (record?.sessions ?? 0) * 31 + n) : buildSession(level, record?.sessions ?? 0);
  return { mode, session, awarded: record?.awarded ?? [], n };
}

// Holds the session being played. It's built once per run (not from live progress), so saving
// the result doesn't swap the questions out from under the results screen.
function LevelRunner({
  userKey,
  branch,
  level,
  initialRecord,
  initialMode,
}: {
  userKey: string;
  branch: Branch;
  level: Level;
  initialRecord: LevelRecord | undefined;
  initialMode: Mode;
}) {
  const [run, setRun] = useState<Run>(() => build(level, initialMode, initialRecord, 0));
  const nextLevel = branch.levels.find((l) => l.number === level.number + 1);

  function restart(mode: Mode) {
    const record = loadMathProgress(userKey).levels[level.id];
    setRun(build(level, mode, record, run.n + 1));
    window.scrollTo({ top: 0 });
  }

  if (run.session.items.length === 0) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <div className="max-w-sm rounded-[24px] border-2 border-border bg-surface p-6 text-center shadow-[0_4px_0_var(--border)]">
          <h1 className="font-cofo text-xl font-bold">Nothing to review yet</h1>
          <p className="mt-2 text-sm text-muted">Play the level first. Questions you miss will show up here.</p>
          <Link href={levelHref(level)} className="btn btn-accent mt-5 h-11 w-full text-base">
            Play {level.title}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <LevelPlayer
      key={run.n}
      session={run.session}
      branch={branch}
      level={level}
      awarded={run.awarded}
      exitHref={`/math/${branch.id}`}
      next={nextLevel && { href: levelHref(nextLevel), title: nextLevel.title, number: nextLevel.number, ready: hasContent(nextLevel) }}
      onFinish={(result) => recordSession(userKey, level.id, result, level.content!.exercises)}
      onRetry={() => restart("level")}
      onReview={() => restart("review")}
    />
  );
}
