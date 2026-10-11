// Arithmetic: all 10 levels written (lesson + 30-exercise bank each).

import type { LevelContent } from "../../schema";
import { LEVEL_1 } from "./level-01";
import { LEVEL_2 } from "./level-02";
import { LEVEL_3 } from "./level-03";
import { LEVEL_4 } from "./level-04";
import { LEVEL_5 } from "./level-05";
import { LEVEL_6 } from "./level-06";
import { LEVEL_7 } from "./level-07";
import { LEVEL_8 } from "./level-08";
import { LEVEL_9 } from "./level-09";
import { LEVEL_10 } from "./level-10";

export const ARITHMETIC_CONTENT: Record<number, LevelContent> = {
  1: LEVEL_1,
  2: LEVEL_2,
  3: LEVEL_3,
  4: LEVEL_4,
  5: LEVEL_5,
  6: LEVEL_6,
  7: LEVEL_7,
  8: LEVEL_8,
  9: LEVEL_9,
  10: LEVEL_10,
};
