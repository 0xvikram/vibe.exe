export function estimatePercentile(value: number, mean: number, stdDev: number, higherIsBetter: boolean = true): number {
  // Simple approximation of CDF for normal distribution
  const z = (value - mean) / stdDev;
  const percentile = (1 + erf(z / Math.sqrt(2))) / 2;
  const p = higherIsBetter ? percentile : 1 - percentile;
  // Keep it between 1 and 99
  return Math.max(1, Math.min(99, Math.round(p * 100)));
}

// Error function approximation
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

export function generatePercentiles(nightOwlPercent: number, variance: number, reposCount: number) {
  // Approximate normal distributions
  // Night Owl: mean 0.15, std 0.1
  const nightOwlRank = estimatePercentile(nightOwlPercent, 0.15, 0.1, true);
  
  // Consistency (variance): mean 2.5, std 1.5, lower variance is better consistency
  const consistencyRank = estimatePercentile(variance, 2.5, 1.5, false);

  // Repos Activity: mean 15, std 10
  const activityRank = estimatePercentile(reposCount, 15, 10, true);

  return {
    nightOwlRank,
    consistencyRank,
    activityRank
  };
}
