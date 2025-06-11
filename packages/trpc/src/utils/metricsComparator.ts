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
  timeTaken: 5,
};

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
