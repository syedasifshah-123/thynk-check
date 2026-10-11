import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findLesson, SECTION } from "@/components/lesson/lessons";
import { LessonView } from "./lesson-view";

// Every lesson is known at build time. (dynamicParams isn't available with Cache Components,
// so unknown ids are handled with notFound() below.)
export function generateStaticParams() {
  return SECTION.lessons.map((lesson) => ({ lesson: lesson.id }));
}

export async function generateMetadata({ params }: PageProps<"/home/[lesson]">): Promise<Metadata> {
  const lesson = findLesson((await params).lesson);
  return { title: lesson ? `${lesson.title} · Thynk` : "Lesson · Thynk" };
}

export default async function LessonPage({ params }: PageProps<"/home/[lesson]">) {
  const { lesson: id } = await params;
  if (!findLesson(id)) notFound();
  return <LessonView lessonId={id} />;
}
