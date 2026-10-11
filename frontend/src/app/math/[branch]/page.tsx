import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRANCHES, findBranch } from "@/lib/math/curriculum";
import { BranchView } from "./branch-view";

// All 15 branches are known at build time. (dynamicParams isn't available with Cache Components,
// so unknown ids are handled with notFound() below.)
export function generateStaticParams() {
  return BRANCHES.map((branch) => ({ branch: branch.id }));
}

export async function generateMetadata({ params }: PageProps<"/math/[branch]">): Promise<Metadata> {
  const branch = findBranch((await params).branch);
  return { title: branch ? `${branch.title} · Thynk` : "Math · Thynk" };
}

export default async function BranchPage({ params }: PageProps<"/math/[branch]">) {
  const { branch } = await params;
  if (!findBranch(branch)) notFound();
  return <BranchView branchId={branch} />;
}
