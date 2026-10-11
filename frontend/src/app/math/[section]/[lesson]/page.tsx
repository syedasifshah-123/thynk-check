import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findLesson, isPlayable, MATH, sectionLessons } from "@/lib/math/curriculum";
import { LessonView } from "./lesson-view";

// Only lessons with content get a page; "coming soon" lessons 404.
export function generateStaticParams() {
  return MATH.flatMap((section) =>
    sectionLessons(section)
      .filter(isPlayable)
      .map((lesson) => ({ section: section.id, lesson: lesson.id })),
  );
}

export async function generateMetadata({ params }: PageProps<"/math/[section]/[lesson]">): Promise<Metadata> {
  const { section, lesson } = await params;
  const found = findLesson(section, lesson);
  return { title: found ? `${found.lesson.title} · Thynk` : "Lesson · Thynk" };
}

export default async function LessonPage({ params }: PageProps<"/math/[section]/[lesson]">) {
  const { section, lesson } = await params;
  const found = findLesson(section, lesson);
  if (!found || !isPlayable(found.lesson)) notFound();
  return <LessonView sectionId={section} lessonId={lesson} />;
}
