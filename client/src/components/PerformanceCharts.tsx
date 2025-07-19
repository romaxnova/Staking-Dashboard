import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Assessment, CompareArrows } from '@mui/icons-material';
import { calculatePerformancePercentile, calculateBenchmarkScore } from '../utils/benchmarkUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface PerformanceData {
  validatorId: string;
  apy: number;
  uptime: number;
  effectiveness: number;
  slashingRisk: number;
  timestamp: string;
}

interface BenchmarkMetrics {
  totalValidators: number;
  avgApy: number;
  avgUptime: number;
  avgEffectiveness: number;
  topPerformers: PerformanceData[];
  riskDistribution: { low: number; medium: number; high: number };
}

const PerformanceCharts: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [benchmarkMetrics, setBenchmarkMetrics] = useState<BenchmarkMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      
      // Generate mock performance data for demonstration
      const mockData = generateMockPerformanceData();
      setPerformanceData(mockData);
      
      // Calculate benchmark metrics
      const metrics = calculateBenchmarkMetrics(mockData);
      setBenchmarkMetrics(metrics);
      
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPerformanceData = (): PerformanceData[] => {
    const validators = Array.from({ length: 50 }, (_, i) => ({
      validatorId: `validator_${i + 1}`,
      apy: 4.5 + Math.random() * 2, // 4.5% - 6.5%
      uptime: 95 + Math.random() * 5, // 95% - 100%
      effectiveness: 90 + Math.random() * 10, // 90% - 100%
      slashingRisk: Math.random() * 0.5, // 0% - 0.5%
      timestamp: new Date().toISOString()
    }));
    
    return validators;
  };

  const calculateBenchmarkMetrics = (data: PerformanceData[]): BenchmarkMetrics => {
    const totalValidators = data.length;
    const avgApy = data.reduce((sum, v) => sum + v.apy, 0) / totalValidators;
    const avgUptime = data.reduce((sum, v) => sum + v.uptime, 0) / totalValidators;
    const avgEffectiveness = data.reduce((sum, v) => sum + v.effectiveness, 0) / totalValidators;
    
    // Sort by benchmark score to find top performers
    const sortedValidators = data
      .map(v => ({
        ...v,
        benchmarkScore: calculateBenchmarkScore(v.apy, v.uptime, v.effectiveness, v.slashingRisk)
      }))
      .sort((a, b) => b.benchmarkScore - a.benchmarkScore);
    
    const topPerformers = sortedValidators.slice(0, 10);
    
    // Calculate risk distribution
    const riskDistribution = {
      low: data.filter(v => v.slashingRisk < 0.1).length,
      medium: data.filter(v => v.slashingRisk >= 0.1 && v.slashingRisk < 0.3).length,
      high: data.filter(v => v.slashingRisk >= 0.3).length
    };
    
    return {
      totalValidators,
      avgApy: Number(avgApy.toFixed(2)),
      avgUptime: Number(avgUptime.toFixed(2)),
      avgEffectiveness: Number(avgEffectiveness.toFixed(2)),
      topPerformers,
      riskDistribution
    };
  };

  const generateApyTrendData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString();
    });
    
    let baseApy = 5.2;
    const data = labels.map(() => {
      baseApy += (Math.random() - 0.5) * 0.2;
      return Number(baseApy.toFixed(2));
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Network Average APY',
          data,
          borderColor: 'rgb(255, 107, 53)',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const generatePerformanceDistributionData = () => {
    if (!benchmarkMetrics) return null;
    
    const apyRanges = {
      '< 4%': performanceData.filter(v => v.apy < 4).length,
      '4-5%': performanceData.filter(v => v.apy >= 4 && v.apy < 5).length,
      '5-6%': performanceData.filter(v => v.apy >= 5 && v.apy < 6).length,
      '> 6%': performanceData.filter(v => v.apy >= 6).length,
    };
    
    return {
      labels: Object.keys(apyRanges),
      datasets: [
        {
          label: 'Validator Count',
          data: Object.values(apyRanges),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const generateRiskDistributionData = () => {
    if (!benchmarkMetrics) return null;
    
    return {
      labels: ['Low Risk', 'Medium Risk', 'High Risk'],
      datasets: [
        {
          data: [
            benchmarkMetrics.riskDistribution.low,
            benchmarkMetrics.riskDistribution.medium,
            benchmarkMetrics.riskDistribution.high,
          ],
          backgroundColor: [
            'rgba(76, 175, 80, 0.8)',
            'rgba(255, 193, 7, 0.8)',
            'rgba(244, 67, 54, 0.8)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Performance Data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          📊 Performance Analytics & Benchmarking
        </Typography>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <MenuItem value="7d">7 Days</MenuItem>
            <MenuItem value="30d">30 Days</MenuItem>
            <MenuItem value="90d">90 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Benchmark Summary Cards */}
      {benchmarkMetrics && (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 4 }}>
          <Box>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary">Avg Network APY</Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {benchmarkMetrics.avgApy}%
                </Typography>
                <Chip 
                  label={`${benchmarkMetrics.totalValidators} validators`} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
              </CardContent>
            </Card>
          </Box>
          
          <Box>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assessment color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="success.main">Avg Uptime</Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {benchmarkMetrics.avgUptime}%
                </Typography>
                <Chip 
                  label="Network Health" 
                  size="small" 
                  color="success" 
                  variant="outlined" 
                />
              </CardContent>
            </Card>
          </Box>
          
          <Box>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CompareArrows color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="secondary">Effectiveness</Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {benchmarkMetrics.avgEffectiveness}%
                </Typography>
                <Chip 
                  label="Performance" 
                  size="small" 
                  color="secondary" 
                  variant="outlined" 
                />
              </CardContent>
            </Card>
          </Box>
          
          <Box>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="warning.main">🏆 Top Performers</Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {benchmarkMetrics.topPerformers.length}
                </Typography>
                <Chip 
                  label="Elite Validators" 
                  size="small" 
                  color="warning" 
                  variant="outlined" 
                />
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Charts Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>
        <Box>
          <Paper elevation={3} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              APY Trend Analysis
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={generateApyTrendData()} options={chartOptions} />
            </Box>
          </Paper>
        </Box>
        
        <Box>
          <Paper elevation={3} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Risk Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              {generateRiskDistributionData() && (
                <Doughnut data={generateRiskDistributionData()!} options={doughnutOptions} />
              )}
            </Box>
          </Paper>
        </Box>
        
        <Box>
          <Paper elevation={3} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              APY Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              {generatePerformanceDistributionData() && (
                <Bar data={generatePerformanceDistributionData()!} options={chartOptions} />
              )}
            </Box>
          </Paper>
        </Box>
        
        <Box>
          <Paper elevation={3} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Top Performers Leaderboard
            </Typography>
            <Box sx={{ height: 300, overflowY: 'auto' }}>
              {benchmarkMetrics?.topPerformers.slice(0, 8).map((validator, index) => (
                <Box key={validator.validatorId} sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  mb: 1,
                  bgcolor: index < 3 ? 'warning.light' : 'background.default',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ mr: 2, minWidth: 30 }}>
                      #{index + 1}
                    </Typography>
                    <Box>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {validator.validatorId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Score: {calculateBenchmarkScore(
                          validator.apy, 
                          validator.uptime, 
                          validator.effectiveness, 
                          validator.slashingRisk
                        ).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight={600} color="primary">
                      {validator.apy.toFixed(2)}% APY
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      {validator.uptime.toFixed(1)}% uptime
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PerformanceCharts;
