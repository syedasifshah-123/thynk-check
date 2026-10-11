"use client";

import Link from "next/link";
import { AuthedPage } from "@/components/dashboard/authed-page";
import { SectionPath } from "@/components/math/section-path";
import { findSection, mathProgress } from "@/lib/math/curriculum";

export function SectionView({ sectionId }: { sectionId: string }) {
  const section = findSection(sectionId)!;

  return (
    <AuthedPage active="math">
      {({ progress }) => {
        const status = mathProgress(progress).sections[section.id];
        const current = Object.entries(status.lessons).find(([, s]) => s === "open")?.[0];

        return (
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-5 sm:px-8 sm:pt-10">
            {status.state === "locked" || status.state === "soon" ? (
              <div className="mx-auto max-w-md rounded-[24px] border-2 border-border bg-surface p-6 text-center shadow-[0_4px_0_var(--border)]">
                <p className="font-cofo text-xs font-bold uppercase tracking-[0.12em] text-muted">Section {section.number}</p>
                <h1 className="mt-1 font-cofo text-xl font-bold sm:text-2xl">{section.title}</h1>
                <p className="mt-2 text-sm text-muted sm:text-base">
                  {status.state === "soon"
                    ? "These lessons are being built. Check back soon!"
                    : `Finish Section ${section.number - 1} first. Sections unlock in order.`}
                </p>
                <Link href="/math" className="btn btn-secondary mt-5 h-11 w-full text-base">
                  Back to sections
                </Link>
              </div>
            ) : (
              // Re-key on the current lesson so the selected node follows your progress.
              <SectionPath key={current ?? "all-done"} section={section} progress={progress} />
            )}
          </main>
        );
      }}
    </AuthedPage>
  );
}
