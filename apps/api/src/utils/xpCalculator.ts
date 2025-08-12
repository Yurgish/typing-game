import { FullMetricData } from '@api/types';
import { areNewMetricsBetter, MetricData } from '@api/utils/metricsComparator';
import { LessonDifficulty } from '@repo/database';

type XpCalculationResult = {
  xpEarned: number;
  metricsToUpdate: Partial<FullMetricData>;
  isBetterPerformance: boolean;
};

/**
 * An array representing the total experience points required to reach each level.
 *
 * The index `i` corresponds to level `i+1`. For example, LEVEL_THRESHOLDS[0] is for Level 1,
 *
 * LEVEL_THRESHOLDS[1] is the threshold for Level 2, and so on.
 */
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
  22500 // Level 10 (need 4500 XP from Level 9) - Maximum defined level
];

/**
 * The minimum amount of experience points a user can earn on a reattempt,
 * regardless of whether their performance was better or not.
 */
export const BASE_XP_ON_REATTEMPT = 10;

/**
 * Calculates a difficulty-based multiplier for XP.
 * @param xp - The base XP amount.
 * @param difficulty - The difficulty of the lesson.
 * @returns The XP amount multiplied by a factor corresponding to the difficulty.
 */
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
 * Calculates the XP a user earns for completing a single screen.
 * The calculation is based on accuracy, WPM, and penalties for errors and backspaces.
 *
 * @param metrics - The performance metrics for the screen.
 * @param difficulty - The difficulty of the lesson.
 * @returns The calculated and rounded XP amount. Minimum XP is 0.
 */
export function calculateXpForScreen(
  metrics: FullMetricData,
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

/**
 * Calculates the XP a user earns for completing an entire lesson.
 * This includes a base XP, an accuracy bonus, and a bonus for a perfect, error-free completion.
 *
 * @param metrics - The aggregated metrics for the entire lesson.
 * @param difficulty - The difficulty of the lesson.
 * @returns The calculated and rounded XP amount.
 */
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

/**
 * Calculates a user's current level and the amount of XP needed for the next level
 * based on their total experience.
 *
 * @param totalExperience - The user's total accumulated XP.
 * @returns An object containing the current level and XP required for the next.
 */
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
    xpToNextLevel: xpNeededForNextLevel
  };
}

/**
 * Determines the XP to be awarded and the metrics to be saved for a new performance,
 * comparing it against an existing record.
 *
 * - If there are no existing metrics, it calculates the full XP and saves the current metrics.
 * - If new metrics are better than existing ones, it calculates the XP gain from the reattempt and updates the metrics.
 * - If new metrics are not better, it awards a base XP amount for the reattempt.
 *
 * @param currentMetrics - The metrics from the current attempt.
 * @param existingMetrics - The metrics from the previous best attempt.
 * @param lessonDifficulty - The difficulty of the lesson.
 * @param type - The type of activity (lesson or screen).
 * @returns An object containing the earned XP, metrics to update, and a flag indicating a better performance.
 */
export function determineXpAndMetricsUpdate(
  currentMetrics: FullMetricData,
  existingMetrics: FullMetricData | null | undefined,
  lessonDifficulty: LessonDifficulty,
  type: 'lesson' | 'screen'
): XpCalculationResult {
  let xpEarned = 0;
  let metricsToUpdate: Partial<FullMetricData> = {};
  let isBetterPerformance = false;

  const calculateBaseXpFn = type === 'lesson' ? calculateXpForLessonCompletion : calculateXpForScreen;

  if (!existingMetrics) {
    metricsToUpdate = currentMetrics;
    xpEarned = calculateBaseXpFn(currentMetrics, lessonDifficulty);
    isBetterPerformance = true;
  } else {
    const newMetricsForComparison: MetricData = {
      adjustedWPM: currentMetrics.adjustedWPM,
      accuracy: currentMetrics.accuracy,
      errors: currentMetrics.errors,
      backspaces: currentMetrics.backspaces,
      timeTaken: currentMetrics.timeTaken
    };
    const existingMetricsForComparison: MetricData = {
      adjustedWPM: existingMetrics.adjustedWPM ?? 0,
      accuracy: existingMetrics.accuracy ?? 0,
      errors: existingMetrics.errors ?? 0,
      backspaces: existingMetrics.backspaces ?? 0,
      timeTaken: existingMetrics.timeTaken ?? 0
    };

    if (areNewMetricsBetter(newMetricsForComparison, existingMetricsForComparison)) {
      metricsToUpdate = currentMetrics;
      xpEarned = calculateXpGainOnReattempt(currentMetrics, existingMetrics, lessonDifficulty, calculateBaseXpFn);
      isBetterPerformance = true;
    } else {
      xpEarned = BASE_XP_ON_REATTEMPT;
      isBetterPerformance = false;
    }
  }

  return { xpEarned, metricsToUpdate, isBetterPerformance };
}

/**
 * Calculates the XP gain when a user reattempts a lesson or screen.
 * This function uses a weighted comparison (`areNewMetricsBetter`) to determine if the new attempt is an improvement.
 * If it is, the XP gain is the difference between the new and old XP, with a minimum of `BASE_XP_ON_REATTEMPT`.
 * If it is not, a base XP amount is awarded.
 *
 * @param newMetrics - The metrics from the current attempt.
 * @param oldMetrics - The metrics from the previous best attempt.
 * @param difficulty - The difficulty of the lesson.
 * @param calculateFn - The function used to calculate the XP value.
 * @returns The XP amount to be awarded.
 */
export function calculateXpGainOnReattempt(
  newMetrics: FullMetricData,
  oldMetrics: FullMetricData,
  difficulty: LessonDifficulty,
  calculateFn: (metrics: FullMetricData, difficulty: LessonDifficulty) => number
): number {
  const newMetricsForComparison: MetricData = {
    adjustedWPM: newMetrics.adjustedWPM,
    accuracy: newMetrics.accuracy,
    errors: newMetrics.errors,
    backspaces: newMetrics.backspaces,
    timeTaken: newMetrics.timeTaken
  };
  const oldMetricsForComparison: MetricData = {
    adjustedWPM: oldMetrics.adjustedWPM,
    accuracy: oldMetrics.accuracy,
    errors: oldMetrics.errors,
    backspaces: oldMetrics.backspaces,
    timeTaken: oldMetrics.timeTaken
  };

  if (areNewMetricsBetter(newMetricsForComparison, oldMetricsForComparison)) {
    const xpNew = calculateFn(newMetrics, difficulty);
    const xpOld = calculateFn(oldMetrics, difficulty);
    return Math.max(BASE_XP_ON_REATTEMPT, xpNew - xpOld);
  }

  return BASE_XP_ON_REATTEMPT;
}
