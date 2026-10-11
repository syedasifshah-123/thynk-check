// Thynk Math: 8 sections → 4 units ("levels") each → 5 lessons each = 160 lessons.
// Only lessons with content are playable; the rest are listed as "coming soon".

import type { LessonContent, Question } from "@/components/lesson/types";
import type { Progress } from "@/lib/progress";
import { ALGEBRA_U2 } from "./content/algebra";
import { NUMBER_SENSE_U1 } from "./content/number-sense";

export type SectionColor = {
  /** Main accent (buttons, path nodes, highlights). */
  main: string;
  /** Darker edge under buttons / nodes. */
  shadow: string;
  /** Text color on top of `main`. */
  ink: string;
};

export type MathLesson = { id: string; number: number; title: string; questions?: Question[] };
export type MathUnit = { id: string; number: number; title: string; lessons: MathLesson[] };
export type MathSection = {
  id: string;
  number: number;
  title: string;
  short: string;
  grade: string;
  tagline: string;
  description: string;
  color: SectionColor;
  units: MathUnit[];
};

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type SectionSpec = Omit<MathSection, "units" | "number"> & { units: [string, string[]][] };

const CONTENT: Record<string, Record<string, Question[]>> = {
  "number-sense": NUMBER_SENSE_U1,
  algebra: ALGEBRA_U2,
};

const SPECS: SectionSpec[] = [
  {
    id: "number-sense",
    title: "Number Sense & Arithmetic",
    short: "Number Sense",
    grade: "GR 3–5",
    tagline: "The foundation of numbers",
    description: "Place value, the number line, negative numbers and mental math tricks that make every other topic easier.",
    color: { main: "#4f6bff", shadow: "#3346d6", ink: "#ffffff" },
    units: [
      ["Understanding Numbers", ["Counting & Comparing", "Place Value", "The Number Line", "Negative Numbers", "Number Patterns"]],
      ["Addition & Subtraction", ["Adding Within 100", "Carrying Over", "Subtracting & Borrowing", "Fact Families", "Adding Negative Numbers"]],
      ["Multiplication & Division", ["Multiplication as Groups", "Times-Table Tricks", "Division as Sharing", "Remainders", "Multiplying Big Numbers"]],
      ["Mental Math & Estimation", ["Rounding", "Estimating Sums", "Mental Math Shortcuts", "Order of Operations", "Number Sense Challenge"]],
    ],
  },
  {
    id: "fractions",
    title: "Fractions, Ratios & Percentages",
    short: "Fractions",
    grade: "GR 4–6",
    tagline: "How numbers relate",
    description: "Equivalent fractions, decimals, ratios and percentages, from sharing pizza to working out discounts.",
    color: { main: "#ff8a3d", shadow: "#d9661a", ink: "#ffffff" },
    units: [
      ["Fractions", ["What Is a Fraction?", "Equivalent Fractions", "Comparing Fractions", "Adding Fractions", "Fractions of a Number"]],
      ["Decimals", ["Tenths & Hundredths", "Decimals on a Number Line", "Fractions to Decimals", "Adding Decimals", "Multiplying Decimals"]],
      ["Ratios & Proportions", ["What Is a Ratio?", "Equivalent Ratios", "Unit Rates", "Proportions", "Scaling Recipes"]],
      ["Percentages & Real-Life Math", ["What Is a Percent?", "Percent of a Number", "Discounts & Sales", "Profit & Loss", "Percent Puzzles"]],
    ],
  },
  {
    id: "algebra",
    title: "Algebra",
    short: "Algebra",
    grade: "GR 6–8",
    tagline: "Solving for the unknown",
    description: "Variables, balancing equations, inequalities and simultaneous equations, built up one idea at a time.",
    color: { main: "#8b5cf6", shadow: "#6d3fd9", ink: "#ffffff" },
    units: [
      ["Variables & Expressions", ["What Is a Variable?", "Writing Expressions", "Evaluating Expressions", "Combining Like Terms", "Expression Puzzles"]],
      ["One-Step & Two-Step Equations", ["Weigh It Out", "Balancing Act", "Solving x + a = b", "Two-Step Equations", "Word Problems to Equations"]],
      ["Inequalities", ["Greater Than & Less Than", "Inequalities on a Number Line", "Solving Inequalities", "Compound Inequalities", "Inequality Puzzles"]],
      ["Expanding, Factoring & Systems", ["Expanding Brackets", "Factoring Basics", "Simultaneous Equations", "Solving by Substitution", "Algebra Challenge"]],
    ],
  },
  {
    id: "patterns",
    title: "Patterns, Sequences & Functions",
    short: "Patterns",
    grade: "GR 5–7",
    tagline: "Discovering the rules",
    description: "Spot the rule behind a sequence, feed numbers through function machines and read relationships off a graph.",
    color: { main: "#14b8a6", shadow: "#0d8f81", ink: "#ffffff" },
    units: [
      ["Number Patterns", ["Missing Numbers", "Shape Patterns", "Odd & Even Patterns", "Square Numbers", "Pattern Detective"]],
      ["Arithmetic & Geometric Sequences", ["Arithmetic Sequences", "The nth Term", "Geometric Sequences", "Growth & Doubling", "Sequence Challenge"]],
      ["Functions & Input-Output Machines", ["Function Machines", "Reverse Machines", "Two-Step Machines", "Function Tables", "Function Rules"]],
      ["Coordinates, Graphs & Relationships", ["The Coordinate Plane", "Plotting Points", "Reading Graphs", "Straight-Line Graphs", "Graph Patterns"]],
    ],
  },
  {
    id: "geometry",
    title: "Geometry & Spatial Math",
    short: "Geometry",
    grade: "GR 4–7",
    tagline: "Understanding shapes",
    description: "Angles, triangles, area and circles, then symmetry, rotations and 3D shapes you can picture in your head.",
    color: { main: "#ec4899", shadow: "#c22d78", ink: "#ffffff" },
    units: [
      ["Lines, Angles & Shapes", ["Types of Angles", "Measuring Angles", "Missing Angles", "Parallel & Perpendicular Lines", "Classifying Shapes"]],
      ["Triangles & Polygons", ["Triangle Angle Sum", "Types of Triangles", "Polygons & Their Angles", "Quadrilaterals", "Shape Puzzles"]],
      ["Perimeter, Area & Circles", ["Perimeter", "Area of Rectangles", "Area of Triangles", "Circles & π", "Area Puzzles"]],
      ["3D Shapes, Symmetry & Transformations", ["Faces, Edges & Vertices", "Nets of 3D Shapes", "Symmetry", "Reflections & Rotations", "Volume"]],
    ],
  },
  {
    id: "measurement",
    title: "Measurement & Applied Math",
    short: "Measurement",
    grade: "GR 4–6",
    tagline: "Math in real life",
    description: "Units and conversions, time and speed, money and budgets, and multi-step word problems from everyday life.",
    color: { main: "#f5b301", shadow: "#c98f00", ink: "#2a1f00" },
    units: [
      ["Units & Conversions", ["Length Units", "Mass & Capacity", "Converting Units", "Metric vs Imperial", "Unit Puzzles"]],
      ["Time, Distance & Speed", ["Reading Time", "Time Intervals", "Speed, Distance & Time", "Travel Time Problems", "Timetables"]],
      ["Money, Budgeting & Comparisons", ["Counting Money", "Making Change", "Best Buy Comparisons", "Budgeting", "Saving & Interest"]],
      ["Multi-Step Word Problems", ["Read, Plan, Solve", "Two-Step Problems", "Hidden Information", "Working Backwards", "Real-World Challenge"]],
    ],
  },
  {
    id: "statistics",
    title: "Probability & Statistics",
    short: "Statistics",
    grade: "GR 5–7",
    tagline: "Data and uncertainty",
    description: "Read charts, find averages and reason about chance with coins, dice and spinners.",
    color: { main: "#0ea5e9", shadow: "#0a7fb5", ink: "#ffffff" },
    units: [
      ["Reading Tables & Charts", ["Tally Charts", "Bar Charts", "Pictograms", "Line Graphs", "Pie Charts"]],
      ["Mean, Median, Mode & Range", ["The Mean", "The Median", "The Mode", "The Range", "Choosing the Best Average"]],
      ["Basic Probability", ["Likely or Unlikely?", "Probability as a Fraction", "Coins & Dice", "Spinners", "Combined Events"]],
      ["Experiments & Data Interpretation", ["Running Experiments", "Expected Results", "Comparing Data Sets", "Misleading Graphs", "Data Detective"]],
    ],
  },
  {
    id: "reasoning",
    title: "Mathematical Reasoning",
    short: "Reasoning",
    grade: "GR 6–8+",
    tagline: "Thinking challenges",
    description: "Logic, counting and olympiad-style puzzles that reward clever thinking over memorised steps.",
    color: { main: "#ef4444", shadow: "#c42c2c", ink: "#ffffff" },
    units: [
      ["Mathematical Logic", ["True or False?", "If… Then…", "Logic Grids", "Elimination Puzzles", "Odd One Out"]],
      ["Multi-Step Challenges", ["Number Grid Puzzles", "Magic Squares", "Tricky Word Problems", "Work It Backwards", "Mixed Challenges"]],
      ["Counting & Combinatorics Basics", ["Listing Outcomes", "The Counting Principle", "Arrangements", "Choosing Groups", "Handshake Problems"]],
      ["Olympiad-Style Puzzles", ["Clever Shortcuts", "Digit Puzzles", "Pigeonhole Principle", "Invariants", "Olympiad Warm-Up"]],
    ],
  },
];

export const MATH: MathSection[] = SPECS.map((spec, s) => {
  let lessonNumber = 0;
  return {
    ...spec,
    number: s + 1,
    units: spec.units.map(([title, lessons], u) => ({
      id: slug(title),
      number: u + 1,
      title,
      lessons: lessons.map((lessonTitle) => {
        const id = slug(lessonTitle);
        return { id, number: ++lessonNumber, title: lessonTitle, questions: CONTENT[spec.id]?.[id] };
      }),
    })),
  };
});

export const findSection = (id: string) => MATH.find((section) => section.id === id);

export function findLesson(sectionId: string, lessonId: string) {
  const section = findSection(sectionId);
  for (const unit of section?.units ?? []) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (section && lesson) return { section, unit, lesson };
  }
  return undefined;
}

export const sectionLessons = (section: MathSection) => section.units.flatMap((unit) => unit.lessons);
export const isPlayable = (lesson: MathLesson): lesson is MathLesson & { questions: Question[] } => Boolean(lesson.questions?.length);
export const lessonKey = (sectionId: string, lessonId: string) => `${sectionId}/${lessonId}`;
export const lessonHref = (sectionId: string, lessonId: string) => `/math/${sectionId}/${lessonId}`;

export function toLessonContent(lesson: MathLesson & { questions: Question[] }): LessonContent {
  return { id: lesson.id, title: lesson.title, questions: lesson.questions };
}

/* ───────────── Progression rules ─────────────
 * Sections unlock in order: a section opens once every playable lesson in all earlier sections is done.
 * Inside a section, playable lessons unlock one after another.
 * Lessons without content are "soon" and don't block the path (nothing to complete yet);
 * a section with no content at all is "soon" too.
 */

export type NodeState = "locked" | "open" | "done" | "soon";

export type SectionStatus = {
  state: NodeState;
  lessons: Record<string, NodeState>;
  done: number;
  playable: number;
};

export function mathProgress(progress: Progress) {
  const sections: Record<string, SectionStatus> = {};
  let reachable = true;
  let next: { section: MathSection; lesson: MathLesson } | undefined;

  for (const section of MATH) {
    const lessons: Record<string, NodeState> = {};
    let open = reachable;
    let done = 0;
    let playable = 0;

    for (const lesson of sectionLessons(section)) {
      if (!isPlayable(lesson)) {
        lessons[lesson.id] = "soon";
        continue;
      }
      playable++;
      if (progress[lessonKey(section.id, lesson.id)]) {
        lessons[lesson.id] = "done";
        done++;
      } else if (open) {
        lessons[lesson.id] = "open";
        next ??= { section, lesson };
        open = false; // everything after the first unfinished lesson waits
      } else {
        lessons[lesson.id] = "locked";
      }
    }

    const complete = done === playable;
    const state: NodeState = !reachable ? "locked" : playable === 0 ? "soon" : complete ? "done" : "open";
    sections[section.id] = { state, lessons, done, playable };
    reachable = reachable && complete;
  }

  return { sections, next };
}
