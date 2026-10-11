"use client";

import Link from "next/link";
import { AuthedPage } from "@/components/dashboard/authed-page";
import { Spinner } from "@/components/loading-button";
import { BranchArt } from "@/components/math/branch-art";
import { BranchPath } from "@/components/math/branch-path";
import type { Session } from "@/lib/fake-auth";
import { BRANCHES, findBranch } from "@/lib/math/curriculum";
import { useMathProgress } from "@/lib/math/progress-store";
import { branchStatus } from "@/lib/math/session";

export function BranchView({ branchId }: { branchId: string }) {
  return <AuthedPage active="math">{({ session }) => <BranchContent session={session} branchId={branchId} />}</AuthedPage>;
}

function BranchContent({ session, branchId }: { session: Session; branchId: string }) {
  const branch = findBranch(branchId)!;
  const data = useMathProgress(session.email);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-5 sm:px-8 sm:pt-10">
      {!data ? (
        <div className="grid min-h-60 place-items-center text-muted" aria-busy="true">
          <Spinner className="size-8" />
        </div>
      ) : branchStatus(branch, BRANCHES, data) === "locked" ? (
        <LockedBranch branchId={branchId} />
      ) : (
        <BranchPath branch={branch} data={data} />
      )}
    </main>
  );
}

function LockedBranch({ branchId }: { branchId: string }) {
  const branch = findBranch(branchId)!;
  const pre = branch.prerequisite!;
  const preBranch = findBranch(pre.branchId);
  return (
    <div className="mx-auto max-w-md rounded-[24px] border-2 border-border bg-surface p-6 text-center shadow-[0_4px_0_var(--border)]">
      <BranchArt id={branch.id} color={branch.color} className="mx-auto size-20 opacity-50 grayscale" />
      <p className="mt-3 font-cofo text-xs font-bold uppercase tracking-[0.12em] text-muted">Branch {branch.number} · Locked</p>
      <h1 className="mt-1 font-cofo text-xl font-bold sm:text-2xl">{branch.title}</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        {branch.title} builds on {preBranch?.title}. Pass {preBranch?.title} Level {pre.level} to open it.
      </p>
      <div className="mt-5 flex flex-col gap-2.5">
        <Link href={`/math/${pre.branchId}`} className="btn btn-accent h-11 w-full text-base" style={{ "--accent": preBranch?.color.main, "--accent-shadow": preBranch?.color.shadow } as React.CSSProperties}>
          Go to {preBranch?.title}
        </Link>
        <Link href="/math" className="btn btn-secondary h-11 w-full text-base">
          All branches
        </Link>
      </div>
    </div>
  );
}
