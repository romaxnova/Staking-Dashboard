import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  LinearProgress,
  Stack,
  Paper,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  FilterList,
  CompareArrows,
  TrendingUp,
  TrendingDown,
  Security,
  Info,
  Timeline,
  Assessment,
  Warning,
  CheckCircle,
  Launch,
} from '@mui/icons-material';
import { Line, Bar } from 'react-chartjs-2';

interface IntegratorData {
  id: string;
  name: string;
  logo: string;
  stakedAmount: number;
  stakedAmountFormatted: string;
  valueUsd: string;
  type: 'Dedicated' | 'Pooled';
  operator: {
    name: string;
    logo: string;
  };
  validatorCount: number;
  apy: number;
  effectiveness: number;
  uptime: number;
  slashingEvents: number;
  feeRate: number;
  established: string;
  riskScore: 'Low' | 'Medium' | 'High';
  userSatisfaction: number;
  geographicPresence: string[];
  monthlyGrowth: number;
}

const IntegratorsPage: React.FC = () => {
  const theme = useTheme();
  const [integrators, setIntegrators] = useState<IntegratorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('stakedAmount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState('all');
  const [selectedIntegrators, setSelectedIntegrators] = useState<string[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    fetchIntegratorsData();
  }, []);

  const fetchIntegratorsData = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from our enhanced API
      const mockData: IntegratorData[] = [
        {
          id: 'ledger-live',
          name: 'Ledger Live',
          logo: '🔷',
          stakedAmount: 426400,
          stakedAmountFormatted: '426,400 ETH',
          valueUsd: '$1.52B',
          type: 'Dedicated',
          operator: { name: 'Kiln', logo: '🔥' },
          validatorCount: 13325,
          apy: 3.54,
          effectiveness: 99.2,
          uptime: 99.8,
          slashingEvents: 0,
          feeRate: 8.0,
          established: '2022-03',
          riskScore: 'Low',
          userSatisfaction: 4.6,
          geographicPresence: ['Europe', 'North America', 'Asia'],
          monthlyGrowth: 12.5,
        },
        {
          id: 'metamask',
          name: 'MetaMask',
          logo: '🦊',
          stakedAmount: 117216,
          stakedAmountFormatted: '117,216 ETH',
          valueUsd: '$418M',
          type: 'Dedicated',
          operator: { name: 'Consensys', logo: '⚡' },
          validatorCount: 3663,
          apy: 3.34,
          effectiveness: 98.9,
          uptime: 99.5,
          slashingEvents: 1,
          feeRate: 10.0,
          established: '2023-01',
          riskScore: 'Low',
          userSatisfaction: 4.4,
          geographicPresence: ['Global'],
          monthlyGrowth: 18.3,
        },
        {
          id: 'trust-wallet',
          name: 'Trust Wallet',
          logo: '🛡️',
          stakedAmount: 100367,
          stakedAmountFormatted: '100,367 ETH',
          valueUsd: '$358M',
          type: 'Pooled',
          operator: { name: 'Kiln', logo: '🔥' },
          validatorCount: 3136,
          apy: 3.06,
          effectiveness: 98.1,
          uptime: 99.3,
          slashingEvents: 0,
          feeRate: 12.0,
          established: '2022-08',
          riskScore: 'Low',
          userSatisfaction: 4.2,
          geographicPresence: ['Europe', 'Asia'],
          monthlyGrowth: 8.7,
        },
        {
          id: 'coinbase-wallet',
          name: 'Coinbase Wallet',
          logo: '🔵',
          stakedAmount: 40458,
          stakedAmountFormatted: '40,458 ETH',
          valueUsd: '$144M',
          type: 'Pooled',
          operator: { name: 'Coinbase Cloud', logo: '☁️' },
          validatorCount: 1264,
          apy: 3.01,
          effectiveness: 97.8,
          uptime: 99.1,
          slashingEvents: 2,
          feeRate: 15.0,
          established: '2023-06',
          riskScore: 'Medium',
          userSatisfaction: 4.0,
          geographicPresence: ['North America', 'Europe'],
          monthlyGrowth: 25.1,
        },
        {
          id: 'safe-wallet',
          name: 'Safe Wallet',
          logo: '🔐',
          stakedAmount: 39584,
          stakedAmountFormatted: '39,584 ETH',
          valueUsd: '$141M',
          type: 'Dedicated',
          operator: { name: 'Kiln', logo: '🔥' },
          validatorCount: 1237,
          apy: 3.31,
          effectiveness: 99.0,
          uptime: 99.6,
          slashingEvents: 0,
          feeRate: 9.0,
          established: '2022-11',
          riskScore: 'Low',
          userSatisfaction: 4.5,
          geographicPresence: ['Europe', 'North America'],
          monthlyGrowth: 15.2,
        },
      ];

      setIntegrators(mockData);
      generateChartsData(mockData);
    } catch (error) {
      console.error('Error fetching integrators data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartsData = (data: IntegratorData[]) => {
    // Performance comparison chart
    const performanceData = {
      labels: data.slice(0, 5).map(i => i.name),
      datasets: [
        {
          label: 'APY (%)',
          data: data.slice(0, 5).map(i => i.apy),
          backgroundColor: alpha(theme.palette.primary.main, 0.8),
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
        {
          label: 'Effectiveness (%)',
          data: data.slice(0, 5).map(i => i.effectiveness),
          backgroundColor: alpha(theme.palette.success.main, 0.8),
          borderColor: theme.palette.success.main,
          borderWidth: 2,
        },
      ],
    };

    // Growth trend chart
    const growthData = {
      labels: ['6mo ago', '5mo ago', '4mo ago', '3mo ago', '2mo ago', '1mo ago', 'Now'],
      datasets: data.slice(0, 3).map((integrator, index) => ({
        label: integrator.name,
        data: [
          integrator.stakedAmount * 0.6,
          integrator.stakedAmount * 0.7,
          integrator.stakedAmount * 0.8,
          integrator.stakedAmount * 0.85,
          integrator.stakedAmount * 0.92,
          integrator.stakedAmount * 0.96,
          integrator.stakedAmount,
        ],
        borderColor: [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main][index],
        backgroundColor: alpha([theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main][index], 0.1),
        fill: false,
        tension: 0.4,
      })),
    };

    setChartData({ performance: performanceData, growth: growthData });
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleCompareToggle = (integratorId: string) => {
    setSelectedIntegrators(prev => {
      if (prev.includes(integratorId)) {
        return prev.filter(id => id !== integratorId);
      } else if (prev.length < 3) {
        return [...prev, integratorId];
      }
      return prev;
    });
  };

  const filteredAndSortedIntegrators = integrators
    .filter(integrator => {
      const matchesSearch = integrator.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || integrator.type.toLowerCase() === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof IntegratorData];
      const bValue = b[sortBy as keyof IntegratorData];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

  const getRiskColor = (riskScore: string) => {
    switch (riskScore) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Staking Integrators
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Comprehensive analysis of Ethereum staking platforms and their performance
        </Typography>

        {/* Search and Filters */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search integrators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="dedicated">Dedicated</MenuItem>
                <MenuItem value="pooled">Pooled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<CompareArrows />}
                onClick={() => setComparisonOpen(true)}
                disabled={selectedIntegrators.length < 2}
              >
                Compare ({selectedIntegrators.length})
              </Button>
              <Button
                variant="contained"
                startIcon={<FilterList />}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)',
                }}
              >
                Advanced Filters
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Performance Charts */}
      {chartData && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Historical Growth Trends
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line
                    data={chartData.growth}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: 'Staked Amount (ETH)' },
                          ticks: {
                            callback: function(value) {
                              return (Number(value) / 1000).toFixed(0) + 'K';
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Comparison
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={chartData.performance}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Integrators Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortBy === 'name' ? sortOrder : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Integrator
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortBy === 'stakedAmount'}
                      direction={sortBy === 'stakedAmount' ? sortOrder : 'asc'}
                      onClick={() => handleSort('stakedAmount')}
                    >
                      Staked Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell>Operator</TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortBy === 'apy'}
                      direction={sortBy === 'apy' ? sortOrder : 'asc'}
                      onClick={() => handleSort('apy')}
                    >
                      APY
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortBy === 'effectiveness'}
                      direction={sortBy === 'effectiveness' ? sortOrder : 'asc'}
                      onClick={() => handleSort('effectiveness')}
                    >
                      Effectiveness
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Risk Score</TableCell>
                  <TableCell align="right">Fee Rate</TableCell>
                  <TableCell align="right">Growth</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedIntegrators.map((integrator) => (
                  <TableRow key={integrator.id} hover>
                    <TableCell padding="checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIntegrators.includes(integrator.id)}
                        onChange={() => handleCompareToggle(integrator.id)}
                        disabled={!selectedIntegrators.includes(integrator.id) && selectedIntegrators.length >= 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 2, fontSize: '1.5rem' }}>
                          {integrator.logo}
                        </Typography>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {integrator.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {integrator.validatorCount.toLocaleString()} validators
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {integrator.stakedAmountFormatted}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {integrator.valueUsd}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={integrator.type}
                        size="small"
                        color={integrator.type === 'Dedicated' ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {integrator.operator.logo}
                        </Typography>
                        <Typography variant="body2">
                          {integrator.operator.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {integrator.apy.toFixed(2)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Box sx={{ width: 60, mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={integrator.effectiveness}
                            color={integrator.effectiveness > 99 ? 'success' : 'warning'}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                        <Typography variant="body2">
                          {integrator.effectiveness.toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={integrator.riskScore}
                        size="small"
                        color={getRiskColor(integrator.riskScore)}
                        icon={
                          integrator.riskScore === 'Low' ? <CheckCircle /> :
                          integrator.riskScore === 'Medium' ? <Warning /> :
                          <Warning />
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {integrator.feeRate.toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {integrator.monthlyGrowth > 0 ? (
                          <TrendingUp color="success" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        ) : (
                          <TrendingDown color="error" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        )}
                        <Typography
                          variant="body2"
                          color={integrator.monthlyGrowth > 0 ? 'success.main' : 'error.main'}
                        >
                          {integrator.monthlyGrowth > 0 ? '+' : ''}{integrator.monthlyGrowth.toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View detailed analytics">
                        <IconButton size="small">
                          <Launch />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View risk assessment">
                        <IconButton size="small">
                          <Info />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Comparison Dialog */}
      <Dialog open={comparisonOpen} onClose={() => setComparisonOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Compare Integrators</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Side-by-side comparison of selected integrators
          </Typography>
          {/* Comparison content would go here */}
          <Typography variant="h6">Feature coming soon...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComparisonOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default IntegratorsPage;
