import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findSection, MATH } from "@/lib/math/curriculum";
import { SectionView } from "./section-view";

// All 8 sections are known at build time. (dynamicParams isn't available with Cache Components,
// so unknown ids are handled with notFound() below.)
export function generateStaticParams() {
  return MATH.map((section) => ({ section: section.id }));
}

export async function generateMetadata({ params }: PageProps<"/math/[section]">): Promise<Metadata> {
  const section = findSection((await params).section);
  return { title: section ? `${section.short} · Thynk` : "Math · Thynk" };
}

export default async function SectionPage({ params }: PageProps<"/math/[section]">) {
  const { section: id } = await params;
  if (!findSection(id)) notFound();
  return <SectionView sectionId={id} />;
}
