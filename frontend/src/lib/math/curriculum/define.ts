import type { Branch, BranchColor, LevelContent, Stage, Topic } from "../schema";

export type LevelSpec = {
  title: string;
  /** Compact topic list: "Topic: sub; sub; sub | Next topic: sub; sub". */
  topics: string;
};

export type BranchSpec = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: BranchColor;
  /** 0 = school maths, 1 = university / proof-based (stages start higher). */
  tier: 0 | 1;
  prerequisite?: { branchId: string; level: number };
  levels: LevelSpec[];
  /** Lesson + exercise bank per level number, for levels that are written. */
  content?: Record<number, LevelContent>;
};

export function parseTopics(compact: string): Topic[] {
  return compact.split("|").map((part) => {
    const [title, subs = ""] = part.split(":");
    return {
      title: title.trim(),
      subtopics: subs
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  });
}

const STAGES: Stage[] = ["Foundation", "Core", "Intermediate", "Advanced", "Expert"];

/** Stage from position in the branch; university-level branches start two stages higher. */
export function stageFor(index: number, count: number, tier: 0 | 1): Stage {
  const position = count > 1 ? index / (count - 1) : 0;
  const base = position < 0.2 ? 0 : position < 0.45 ? 1 : position < 0.7 ? 2 : position < 0.9 ? 3 : 4;
  return STAGES[Math.min(STAGES.length - 1, base + tier * 2)];
}

export function defineBranch(spec: BranchSpec, number: number): Branch {
  return {
    id: spec.id,
    number,
    title: spec.title,
    subtitle: spec.subtitle,
    description: spec.description,
    color: spec.color,
    prerequisite: spec.prerequisite,
    levels: spec.levels.map((level, i) => ({
      id: `${spec.id}-${i + 1}`,
      branchId: spec.id,
      number: i + 1,
      title: level.title,
      stage: stageFor(i, spec.levels.length, spec.tier),
      topics: parseTopics(level.topics),
      content: spec.content?.[i + 1],
    })),
  };
}
