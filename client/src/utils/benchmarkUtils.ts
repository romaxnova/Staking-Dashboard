/**
 * Performance benchmarking utilities for comparing validators and integrators
 * against network medians and percentiles
 */

export interface PerformanceMetrics {
  uptime: number;
  apy: number;
  commission: number;
  totalStaked?: number;
  validatorCount?: number;
  marketShare?: number;
}

export interface BenchmarkResult {
  value: number;
  percentile: number;
  rank: 'top' | 'above_average' | 'average' | 'below_average' | 'poor';
  comparison: string;
  color: 'success' | 'info' | 'warning' | 'error';
}

export interface ValidatorBenchmark {
  validator: any;
  uptime: BenchmarkResult;
  apy: BenchmarkResult;
  commission: BenchmarkResult;
  overall: BenchmarkResult;
}

export interface IntegratorBenchmark {
  integrator: any;
  apy: BenchmarkResult;
  marketShare: BenchmarkResult;
  validatorCount: BenchmarkResult;
  overall: BenchmarkResult;
}

/**
 * Calculate percentile rank for a value in a dataset
 */
const calculatePercentile = (value: number, dataset: number[]): number => {
  const sorted = dataset.slice().sort((a, b) => a - b);
  const index = sorted.findIndex(v => v >= value);
  return index === -1 ? 100 : (index / sorted.length) * 100;
};

/**
 * Get performance rank based on percentile
 */
const getPerformanceRank = (percentile: number): BenchmarkResult['rank'] => {
  if (percentile >= 90) return 'top';
  if (percentile >= 70) return 'above_average';
  if (percentile >= 30) return 'average';
  if (percentile >= 10) return 'below_average';
  return 'poor';
};

/**
 * Get color based on rank
 */
const getRankColor = (rank: BenchmarkResult['rank']): BenchmarkResult['color'] => {
  switch (rank) {
    case 'top': return 'success';
    case 'above_average': return 'info';
    case 'average': return 'info';
    case 'below_average': return 'warning';
    case 'poor': return 'error';
  }
};

/**
 * Generate comparison text
 */
const getComparisonText = (percentile: number, metricName: string, higherIsBetter = true): string => {
  const rank = getPerformanceRank(percentile);
  const direction = higherIsBetter ? 'higher' : 'lower';
  const oppositeDirection = higherIsBetter ? 'lower' : 'higher';
  
  switch (rank) {
    case 'top': return `Top 10% ${metricName} - excellent performance`;
    case 'above_average': return `${direction} than 70% of validators`;
    case 'average': return `Average ${metricName} performance`;
    case 'below_average': return `${oppositeDirection} than 70% of validators`;
    case 'poor': return `Bottom 10% ${metricName} - needs improvement`;
  }
};

/**
 * Benchmark individual validator performance
 */
export const benchmarkValidator = (validator: any, allValidators: any[]): ValidatorBenchmark => {
  // Extract metrics from all validators
  const uptimes = allValidators.map(v => parseFloat(v.uptime)).filter(v => !isNaN(v));
  const apys = allValidators.map(v => parseFloat(v.apy)).filter(v => !isNaN(v));
  const commissions = allValidators.map(v => parseFloat(v.commission)).filter(v => !isNaN(v));
  
  // Calculate benchmarks for this validator
  const uptimePercentile = calculatePercentile(parseFloat(validator.uptime), uptimes);
  const apyPercentile = calculatePercentile(parseFloat(validator.apy), apys);
  const commissionPercentile = calculatePercentile(parseFloat(validator.commission), commissions);
  
  // Overall score (weighted average)
  const overallScore = (uptimePercentile * 0.4 + apyPercentile * 0.4 + (100 - commissionPercentile) * 0.2);
  
  return {
    validator,
    uptime: {
      value: parseFloat(validator.uptime),
      percentile: uptimePercentile,
      rank: getPerformanceRank(uptimePercentile),
      comparison: getComparisonText(uptimePercentile, 'uptime'),
      color: getRankColor(getPerformanceRank(uptimePercentile))
    },
    apy: {
      value: parseFloat(validator.apy),
      percentile: apyPercentile,
      rank: getPerformanceRank(apyPercentile),
      comparison: getComparisonText(apyPercentile, 'APY'),
      color: getRankColor(getPerformanceRank(apyPercentile))
    },
    commission: {
      value: parseFloat(validator.commission),
      percentile: commissionPercentile,
      rank: getPerformanceRank(100 - commissionPercentile), // Lower commission is better
      comparison: getComparisonText(100 - commissionPercentile, 'commission', false),
      color: getRankColor(getPerformanceRank(100 - commissionPercentile))
    },
    overall: {
      value: overallScore,
      percentile: overallScore,
      rank: getPerformanceRank(overallScore),
      comparison: getComparisonText(overallScore, 'overall performance'),
      color: getRankColor(getPerformanceRank(overallScore))
    }
  };
};

/**
 * Benchmark integrator performance
 */
export const benchmarkIntegrator = (integrator: any, allIntegrators: any[]): IntegratorBenchmark => {
  const apys = allIntegrators.map(i => i.apy).filter(v => !isNaN(v));
  const marketShares = allIntegrators.map(i => i.marketShare).filter(v => !isNaN(v));
  const validatorCounts = allIntegrators.map(i => i.validators).filter(v => !isNaN(v));
  
  const apyPercentile = calculatePercentile(integrator.apy, apys);
  const marketSharePercentile = calculatePercentile(integrator.marketShare, marketShares);
  const validatorCountPercentile = calculatePercentile(integrator.validators, validatorCounts);
  
  const overallScore = (apyPercentile * 0.4 + marketSharePercentile * 0.3 + validatorCountPercentile * 0.3);
  
  return {
    integrator,
    apy: {
      value: integrator.apy,
      percentile: apyPercentile,
      rank: getPerformanceRank(apyPercentile),
      comparison: getComparisonText(apyPercentile, 'APY'),
      color: getRankColor(getPerformanceRank(apyPercentile))
    },
    marketShare: {
      value: integrator.marketShare,
      percentile: marketSharePercentile,
      rank: getPerformanceRank(marketSharePercentile),
      comparison: getComparisonText(marketSharePercentile, 'market share'),
      color: getRankColor(getPerformanceRank(marketSharePercentile))
    },
    validatorCount: {
      value: integrator.validators,
      percentile: validatorCountPercentile,
      rank: getPerformanceRank(validatorCountPercentile),
      comparison: getComparisonText(validatorCountPercentile, 'validator count'),
      color: getRankColor(getPerformanceRank(validatorCountPercentile))
    },
    overall: {
      value: overallScore,
      percentile: overallScore,
      rank: getPerformanceRank(overallScore),
      comparison: getComparisonText(overallScore, 'overall performance'),
      color: getRankColor(getPerformanceRank(overallScore))
    }
  };
};

/**
 * Calculate network statistics
 */
export const calculateNetworkStats = (validators: any[]) => {
  const uptimes = validators.map(v => parseFloat(v.uptime)).filter(v => !isNaN(v));
  const apys = validators.map(v => parseFloat(v.apy)).filter(v => !isNaN(v));
  const commissions = validators.map(v => parseFloat(v.commission)).filter(v => !isNaN(v));
  
  return {
    uptime: {
      median: uptimes.sort((a, b) => a - b)[Math.floor(uptimes.length / 2)],
      average: uptimes.reduce((a, b) => a + b, 0) / uptimes.length,
      min: Math.min(...uptimes),
      max: Math.max(...uptimes),
      p25: uptimes[Math.floor(uptimes.length * 0.25)],
      p75: uptimes[Math.floor(uptimes.length * 0.75)]
    },
    apy: {
      median: apys.sort((a, b) => a - b)[Math.floor(apys.length / 2)],
      average: apys.reduce((a, b) => a + b, 0) / apys.length,
      min: Math.min(...apys),
      max: Math.max(...apys),
      p25: apys[Math.floor(apys.length * 0.25)],
      p75: apys[Math.floor(apys.length * 0.75)]
    },
    commission: {
      median: commissions.sort((a, b) => a - b)[Math.floor(commissions.length / 2)],
      average: commissions.reduce((a, b) => a + b, 0) / commissions.length,
      min: Math.min(...commissions),
      max: Math.max(...commissions),
      p25: commissions[Math.floor(commissions.length * 0.25)],
      p75: commissions[Math.floor(commissions.length * 0.75)]
    }
  };
};

/**
 * Get performance badge based on overall rank
 */
export const getPerformanceBadge = (benchmark: ValidatorBenchmark | IntegratorBenchmark) => {
  const rank = benchmark.overall.rank;
  
  switch (rank) {
    case 'top':
      return { label: '🏆 Top Performer', color: 'success' };
    case 'above_average':
      return { label: '⭐ Above Average', color: 'info' };
    case 'average':
      return { label: '📊 Average', color: 'default' };
    case 'below_average':
      return { label: '📉 Below Average', color: 'warning' };
    case 'poor':
      return { label: '⚠️ Needs Improvement', color: 'error' };
  }
};

/**
 * Calculate performance percentile (alias for calculatePercentile)
 */
export const calculatePerformancePercentile = calculatePercentile;

/**
 * Calculate benchmark score for a validator
 */
export const calculateBenchmarkScore = (apy: number, uptime: number, effectiveness: number, slashingRisk: number): number => {
  // Weighted score calculation
  const apyScore = Math.min(apy / 6.5 * 100, 100); // Normalize APY to 0-100 (6.5% = 100)
  const uptimeScore = uptime; // Already a percentage
  const effectivenessScore = effectiveness; // Already a percentage
  const riskPenalty = slashingRisk * 200; // Risk penalty (0.5% risk = 100 point penalty)
  
  // Weighted average with risk penalty
  const baseScore = (apyScore * 0.4 + uptimeScore * 0.3 + effectivenessScore * 0.3);
  const finalScore = Math.max(0, baseScore - riskPenalty);
  
  return Number(finalScore.toFixed(2));
};
