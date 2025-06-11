import { LessonDifficulty } from "../../src/types";
import { MetricData } from "./metricsComparator";

const LEVEL_THRESHOLDS = [
  0, // Level 1
  500, // Level 2 (need 500 XP from 0)
  1500, // Level 3 (need 1000 XP from Level 2)
  3000, // Level 4 (need 1500 XP from Level 3)
  5000, // Level 5 (need 2000 XP from Level 4)
  7500, // Level 6 (need 2500 XP from Level 5)
  10500, // Level 7 (need 3000 XP from Level 6)
  14000, // Level 8 (need 3500 XP from Level 7)
  18000, // Level 9 (need 4000 XP from Level 8)
  22500, // Level 10 (need 4500 XP from Level 9) - Maximum defined level
];

export const BASE_XP_ON_REATTEMPT = 10;

const getMultipliedXP = (xp: number, difficulty: LessonDifficulty): number => {
  switch (difficulty) {
    case LessonDifficulty.BEGINNER:
      return xp * 1.0;
    case LessonDifficulty.INTERMEDIATE:
      return xp * 1.2;
    case LessonDifficulty.ADVANCED:
      return xp * 1.5;
    default:
      return xp * 1.0;
  }
};

/**
 * Розраховує XP за проходження одного екрану.
 * @param metrics Метрики проходження екрану.
 * @param difficulty Складність уроку.
 * @returns Обчислені XP за екран.
 */
export function calculateXpForScreen(
  metrics: MetricData,
  difficulty: LessonDifficulty = LessonDifficulty.BEGINNER
): number {
  const accuracyBonus = metrics.accuracy * 0.5;
  const speedBonus = metrics.adjustedWPM / 10;
  const errorPenalty = (metrics.errors + metrics.backspaces) * 0.5;

  let xp = 20;
  xp += accuracyBonus + speedBonus - errorPenalty;

  xp = getMultipliedXP(xp, difficulty);

  return Math.max(0, Math.round(xp));
}

export function calculateXpForLessonCompletion(
  metrics: MetricData,
  difficulty: LessonDifficulty = LessonDifficulty.BEGINNER
): number {
  const baseCompletionXP = 50;
  const accuracyBonus = metrics.accuracy * 0.5;
  const perfectLessonBonus = metrics.errors === 0 && metrics.backspaces === 0 ? 100 : 0;

  let xp = baseCompletionXP + accuracyBonus + perfectLessonBonus;

  xp = getMultipliedXP(xp, difficulty);

  return Math.round(xp);
}

export function calculateXpDifference(
  newMetrics: MetricData,
  oldMetrics: MetricData,
  difficulty: LessonDifficulty,
  calculateFn: (metrics: MetricData, difficulty: LessonDifficulty) => number
): number {
  const xpNew = calculateFn(newMetrics, difficulty);
  const xpOld = calculateFn(oldMetrics, difficulty);

  if (xpNew > xpOld) {
    return xpNew - xpOld;
  }

  return BASE_XP_ON_REATTEMPT;
}

export function calculateLevel(totalExperience: number) {
  const MAX_LEVEL_IN_SYSTEM = LEVEL_THRESHOLDS.length;

  let currentLevel = 1;
  let xpNeededForNextLevel = 0;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (LEVEL_THRESHOLDS[i] !== undefined && totalExperience >= LEVEL_THRESHOLDS[i]!) {
      currentLevel = i + 1;
    } else if (LEVEL_THRESHOLDS[i] !== undefined) {
      xpNeededForNextLevel = LEVEL_THRESHOLDS[i]! - totalExperience;
      break;
    }
  }

  if (totalExperience >= LEVEL_THRESHOLDS[MAX_LEVEL_IN_SYSTEM - 1]!) {
    currentLevel = MAX_LEVEL_IN_SYSTEM;
    xpNeededForNextLevel = 0;
  }

  return {
    currentLevel: currentLevel,
    xpToNextLevel: xpNeededForNextLevel,
  };
}
