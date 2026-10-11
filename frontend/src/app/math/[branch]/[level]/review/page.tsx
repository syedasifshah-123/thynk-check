import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRANCHES, findLevel } from "@/lib/math/curriculum";
import { hasContent } from "@/lib/math/session";
import { LevelView } from "../level-view";

export function generateStaticParams() {
  return BRANCHES.flatMap((branch) => branch.levels.filter(hasContent).map((level) => ({ branch: branch.id, level: String(level.number) })));
}

export async function generateMetadata({ params }: PageProps<"/math/[branch]/[level]/review">): Promise<Metadata> {
  const { branch, level } = await params;
  const found = findLevel(branch, Number(level));
  return { title: found ? `Review: ${found.level.title} · Thynk` : "Review · Thynk" };
}

export default async function ReviewPage({ params }: PageProps<"/math/[branch]/[level]/review">) {
  const { branch, level } = await params;
  const found = findLevel(branch, Number(level));
  if (!found || !hasContent(found.level) || String(found.level.number) !== level) notFound();
  return <LevelView branchId={branch} levelNumber={found.level.number} mode="review" />;
}
