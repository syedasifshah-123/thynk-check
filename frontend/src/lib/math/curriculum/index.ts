// The full Thynk Math curriculum: 15 branches, 104 levels, in learning order.

import type { Branch, Level } from "../schema";
import { ABSTRACT_ALGEBRA } from "./abstract-algebra";
import { ALGEBRA } from "./algebra";
import { ANALYSIS } from "./analysis";
import { ARITHMETIC } from "./arithmetic";
import { CALCULUS } from "./calculus";
import { defineBranch } from "./define";
import { DISCRETE } from "./discrete";
import { GEOMETRY } from "./geometry";
import { LINEAR_ALGEBRA } from "./linear-algebra";
import { LOGIC } from "./logic";
import { NUMBER_THEORY } from "./number-theory";
import { PROBABILITY } from "./probability";
import { SET_THEORY } from "./set-theory";
import { STATISTICS } from "./statistics";
import { TOPOLOGY } from "./topology";
import { TRIGONOMETRY } from "./trigonometry";

const SPECS = [
  ARITHMETIC,
  ALGEBRA,
  GEOMETRY,
  TRIGONOMETRY,
  CALCULUS,
  STATISTICS,
  PROBABILITY,
  LINEAR_ALGEBRA,
  NUMBER_THEORY,
  DISCRETE,
  ANALYSIS,
  ABSTRACT_ALGEBRA,
  LOGIC,
  SET_THEORY,
  TOPOLOGY,
];

export const BRANCHES: Branch[] = SPECS.map((spec, i) => defineBranch(spec, i + 1));

export const findBranch = (id: string) => BRANCHES.find((b) => b.id === id);

export function findLevel(branchId: string, levelNumber: number): { branch: Branch; level: Level } | undefined {
  const branch = findBranch(branchId);
  const level = branch?.levels.find((l) => l.number === levelNumber);
  return branch && level ? { branch, level } : undefined;
}

export const levelHref = (level: Pick<Level, "branchId" | "number">) => `/math/${level.branchId}/${level.number}`;

export const totalLevels = () => BRANCHES.reduce((sum, b) => sum + b.levels.length, 0);
export const writtenLevels = (branch: Branch) => branch.levels.filter((l) => l.content?.exercises.length).length;
