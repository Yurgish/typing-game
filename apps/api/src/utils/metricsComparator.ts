export type MetricData = {
  adjustedWPM: number;
  accuracy: number;
  errors: number;
  backspaces: number;
  timeTaken: number;
};

type MetricWeights = {
  adjustedWPM: number;
  accuracy: number;
  errors: number;
  backspaces: number;
  timeTaken: number;
};

const DEFAULT_METRIC_WEIGHTS: MetricWeights = {
  adjustedWPM: 40,
  accuracy: 30,
  errors: 15,
  backspaces: 10,
  timeTaken: 5
};

/**
 * Determines if the new set of metrics is better than the existing set, based on weighted scoring.
 *
 * Each metric is normalized and weighted according to the provided weights. Metrics where higher values are better
 * (e.g., adjustedWPM, accuracy) are scored positively, while metrics where lower values are better (e.g., errors, backspaces, timeTaken)
 * are scored negatively. If no existing metrics are provided, the function returns `true`.
 *
 * @param newMetrics - The new set of metric data to evaluate.
 * @param existingMetrics - The existing set of metric data to compare against. If null or undefined, new metrics are considered better.
 * @param weights - The weights to apply to each metric when calculating the score. Defaults to `DEFAULT_METRIC_WEIGHTS`.
 * @returns `true` if the new metrics are better (i.e., have a higher weighted score) than the existing metrics, otherwise `false`.
 */
export function areNewMetricsBetter(
  newMetrics: MetricData,
  existingMetrics: MetricData | null | undefined,
  weights: MetricWeights = DEFAULT_METRIC_WEIGHTS
): boolean {
  if (!existingMetrics) {
    return true;
  }

  const normalizeValue = (value: number | null | undefined, isHigherBetter: boolean): number => {
    const val = value ?? (isHigherBetter ? 0 : 9999999);
    return isHigherBetter ? val : -val;
  };

  const calculateScore = (metrics: MetricData): number => {
    let score = 0;

    score += normalizeValue(metrics.adjustedWPM, true) * (weights.adjustedWPM / 100);
    score += normalizeValue(metrics.accuracy, true) * (weights.accuracy / 100);
    score += normalizeValue(metrics.errors, false) * (weights.errors / 100);
    score += normalizeValue(metrics.backspaces, false) * (weights.backspaces / 100);
    score += normalizeValue((metrics.timeTaken ?? 0) / 1000, false) * (weights.timeTaken / 100);

    return score;
  };

  const newScore = calculateScore(newMetrics);
  const existingScore = calculateScore(existingMetrics);

  return newScore > existingScore;
}
