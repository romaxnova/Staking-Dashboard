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
  Tabs,
  Tab,
  Divider,
  Badge,
} from '@mui/material';
import {
  Search,
  FilterList,
  Security,
  Info,
  Timeline,
  Assessment,
  Warning,
  CheckCircle,
  Launch,
  Star,
  StarBorder,
  LocationOn,
  Business,
  Schedule,
  TrendingUp,
  TrendingDown,
  Visibility,
  VisibilityOff,
  Shield,
  Speed,
  Public,
  AccountBalance,
} from '@mui/icons-material';
import { Line, Doughnut, Radar } from 'react-chartjs-2';

interface OperatorData {
  id: string;
  name: string;
  logo: string;
  totalStaked: number;
  totalStakedFormatted: string;
  valueUsd: string;
  validatorCount: number;
  integrators: number;
  apy: number;
  effectiveness: number;
  uptime: number;
  slashingEvents: number;
  feeRate: number;
  established: string;
  headquarters: string;
  jurisdictions: string[];
  riskScore: 'Low' | 'Medium' | 'High';
  certifications: string[];
  infrastructureScore: number;
  securityScore: number;
  reputationScore: number;
  clientDistribution: { [key: string]: number };
  geographicDistribution: { [key: string]: number };
  monthlyGrowth: number;
  isWatched: boolean;
  keyPersonnel: {
    ceo: string;
    cto: string;
    headOfStaking: string;
  };
  businessModel: 'White-label' | 'Direct' | 'Hybrid';
  serviceLevel: 'Enterprise' | 'Professional' | 'Standard';
  minStakeAmount: number;
  maxCapacity: number;
  currentUtilization: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const OperatorsPage: React.FC = () => {
  const theme = useTheme();
  const [operators, setOperators] = useState<OperatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalStaked');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterJurisdiction, setFilterJurisdiction] = useState('all');
  const [filterBusinessModel, setFilterBusinessModel] = useState('all');
  const [selectedOperator, setSelectedOperator] = useState<OperatorData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    fetchOperatorsData();
  }, []);

  const fetchOperatorsData = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from the Kiln Connect API
      const mockData: OperatorData[] = [
        {
          id: 'kiln',
          name: 'Kiln',
          logo: '🔥',
          totalStaked: 2456789,
          totalStakedFormatted: '2,456,789 ETH',
          valueUsd: '$8.76B',
          validatorCount: 76774,
          integrators: 15,
          apy: 3.45,
          effectiveness: 99.4,
          uptime: 99.9,
          slashingEvents: 0,
          feeRate: 8.0,
          established: '2018-01',
          headquarters: 'Paris, France',
          jurisdictions: ['France', 'Singapore', 'USA'],
          riskScore: 'Low',
          certifications: ['SOC 2 Type II', 'ISO 27001', 'PCI DSS'],
          infrastructureScore: 95,
          securityScore: 98,
          reputationScore: 96,
          clientDistribution: {
            'Geth': 45,
            'Lighthouse': 30,
            'Prysm': 15,
            'Teku': 10,
          },
          geographicDistribution: {
            'Europe': 50,
            'North America': 30,
            'Asia-Pacific': 20,
          },
          monthlyGrowth: 12.3,
          isWatched: false,
          keyPersonnel: {
            ceo: 'Laszlo Szabo',
            cto: 'Someone',
            headOfStaking: 'Somebody',
          },
          businessModel: 'White-label',
          serviceLevel: 'Enterprise',
          minStakeAmount: 32,
          maxCapacity: 5000000,
          currentUtilization: 49,
        },
        {
          id: 'consensys',
          name: 'Consensys Staking',
          logo: '⚡',
          totalStaked: 456123,
          totalStakedFormatted: '456,123 ETH',
          valueUsd: '$1.63B',
          validatorCount: 14254,
          integrators: 8,
          apy: 3.28,
          effectiveness: 98.7,
          uptime: 99.6,
          slashingEvents: 1,
          feeRate: 10.0,
          established: '2019-03',
          headquarters: 'Brooklyn, USA',
          jurisdictions: ['USA', 'UK', 'Germany'],
          riskScore: 'Low',
          certifications: ['SOC 2 Type II', 'ISO 27001'],
          infrastructureScore: 92,
          securityScore: 94,
          reputationScore: 91,
          clientDistribution: {
            'Geth': 40,
            'Lighthouse': 25,
            'Prysm': 25,
            'Teku': 10,
          },
          geographicDistribution: {
            'North America': 45,
            'Europe': 35,
            'Asia-Pacific': 20,
          },
          monthlyGrowth: 8.7,
          isWatched: false,
          keyPersonnel: {
            ceo: 'Joseph Placeholder',
            cto: 'Nicolas Ctochin',
            headOfStaking: 'Tim Stako',
          },
          businessModel: 'Direct',
          serviceLevel: 'Enterprise',
          minStakeAmount: 32,
          maxCapacity: 1000000,
          currentUtilization: 45,
        },
        {
          id: 'coinbase-cloud',
          name: 'Coinbase Cloud',
          logo: '☁️',
          totalStaked: 234567,
          totalStakedFormatted: '234,567 ETH',
          valueUsd: '$837M',
          validatorCount: 7330,
          integrators: 5,
          apy: 3.12,
          effectiveness: 97.9,
          uptime: 99.3,
          slashingEvents: 2,
          feeRate: 15.0,
          established: '2020-06',
          headquarters: 'San Francisco, USA',
          jurisdictions: ['USA', 'Ireland'],
          riskScore: 'Medium',
          certifications: ['SOC 2 Type II'],
          infrastructureScore: 88,
          securityScore: 90,
          reputationScore: 92,
          clientDistribution: {
            'Geth': 50,
            'Lighthouse': 20,
            'Prysm': 20,
            'Teku': 10,
          },
          geographicDistribution: {
            'North America': 60,
            'Europe': 25,
            'Asia-Pacific': 15,
          },
          monthlyGrowth: 15.2,
          isWatched: false,
          keyPersonnel: {
            ceo: 'Brian Armweak',
            cto: 'Tim Mozart',
            headOfStaking: 'Alexey Miller',
          },
          businessModel: 'Hybrid',
          serviceLevel: 'Professional',
          minStakeAmount: 32,
          maxCapacity: 500000,
          currentUtilization: 47,
        },
        {
          id: 'figment',
          name: 'Figment',
          logo: '🎯',
          totalStaked: 123456,
          totalStakedFormatted: '123,456 ETH',
          valueUsd: '$440M',
          validatorCount: 3858,
          integrators: 3,
          apy: 3.35,
          effectiveness: 98.2,
          uptime: 99.4,
          slashingEvents: 0,
          feeRate: 12.0,
          established: '2019-01',
          headquarters: 'Toronto, Canada',
          jurisdictions: ['Canada', 'USA'],
          riskScore: 'Low',
          certifications: ['SOC 2 Type II', 'ISO 27001'],
          infrastructureScore: 91,
          securityScore: 93,
          reputationScore: 89,
          clientDistribution: {
            'Geth': 35,
            'Lighthouse': 35,
            'Prysm': 20,
            'Teku': 10,
          },
          geographicDistribution: {
            'North America': 70,
            'Europe': 20,
            'Asia-Pacific': 10,
          },
          monthlyGrowth: 6.8,
          isWatched: false,
          keyPersonnel: {
            ceo: 'Lorien Gobelin',
            cto: 'Andrew Cronky',
            headOfStaking: 'Matt Flipstone',
          },
          businessModel: 'Direct',
          serviceLevel: 'Professional',
          minStakeAmount: 32,
          maxCapacity: 250000,
          currentUtilization: 49,
        },
      ];

      setOperators(mockData);
    } catch (error) {
      console.error('Error fetching operators data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const toggleWatchlist = (operatorId: string) => {
    setWatchlist(prev => {
      if (prev.includes(operatorId)) {
        return prev.filter(id => id !== operatorId);
      } else {
        return [...prev, operatorId];
      }
    });

    setOperators(prev =>
      prev.map(op =>
        op.id === operatorId ? { ...op, isWatched: !op.isWatched } : op
      )
    );
  };

  const openOperatorDetails = (operator: OperatorData) => {
    setSelectedOperator(operator);
    setDetailsOpen(true);
    setActiveTab(0);
  };

  const filteredAndSortedOperators = operators
    .filter(operator => {
      const matchesSearch = operator.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesJurisdiction = filterJurisdiction === 'all' || 
        operator.jurisdictions.some(j => j.toLowerCase().includes(filterJurisdiction.toLowerCase()));
      const matchesBusinessModel = filterBusinessModel === 'all' || 
        operator.businessModel.toLowerCase() === filterBusinessModel;
      return matchesSearch && matchesJurisdiction && matchesBusinessModel;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof OperatorData];
      const bValue = b[sortBy as keyof OperatorData];
      
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

  const getServiceLevelColor = (level: string) => {
    switch (level) {
      case 'Enterprise': return 'primary';
      case 'Professional': return 'secondary';
      case 'Standard': return 'default';
      default: return 'default';
    }
  };

  const generateRadarData = (operator: OperatorData) => ({
    labels: ['Infrastructure', 'Security', 'Reputation', 'Effectiveness', 'Uptime'],
    datasets: [{
      label: operator.name,
      data: [
        operator.infrastructureScore,
        operator.securityScore,
        operator.reputationScore,
        operator.effectiveness,
        operator.uptime,
      ],
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    }],
  });

  const generateClientDistributionData = (operator: OperatorData) => ({
    labels: Object.keys(operator.clientDistribution),
    datasets: [{
      data: Object.values(operator.clientDistribution),
      backgroundColor: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
      ],
    }],
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Staking Operators
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Professional validator operators powering Ethereum's staking ecosystem
        </Typography>

        {/* Search and Filters */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search operators..."
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
              <InputLabel>Jurisdiction</InputLabel>
              <Select
                value={filterJurisdiction}
                label="Jurisdiction"
                onChange={(e) => setFilterJurisdiction(e.target.value)}
              >
                <MenuItem value="all">All Jurisdictions</MenuItem>
                <MenuItem value="usa">USA</MenuItem>
                <MenuItem value="france">France</MenuItem>
                <MenuItem value="canada">Canada</MenuItem>
                <MenuItem value="uk">UK</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Business Model</InputLabel>
              <Select
                value={filterBusinessModel}
                label="Business Model"
                onChange={(e) => setFilterBusinessModel(e.target.value)}
              >
                <MenuItem value="all">All Models</MenuItem>
                <MenuItem value="white-label">White-label</MenuItem>
                <MenuItem value="direct">Direct</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<FilterList />}
              sx={{
                height: '56px',
                background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)',
              }}
            >
              Advanced
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Operators Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Watch</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortBy === 'name' ? sortOrder : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Operator
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortBy === 'totalStaked'}
                      direction={sortBy === 'totalStaked' ? sortOrder : 'asc'}
                      onClick={() => handleSort('totalStaked')}
                    >
                      Total Staked
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Service Level</TableCell>
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
                  <TableCell align="center">Integrators</TableCell>
                  <TableCell align="right">Fee Rate</TableCell>
                  <TableCell align="right">Growth</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedOperators.map((operator) => (
                  <TableRow key={operator.id} hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleWatchlist(operator.id)}
                        color={operator.isWatched || watchlist.includes(operator.id) ? 'warning' : 'default'}
                      >
                        {operator.isWatched || watchlist.includes(operator.id) ? <Star /> : <StarBorder />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 2, fontSize: '1.5rem' }}>
                          {operator.logo}
                        </Typography>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {operator.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <LocationOn sx={{ fontSize: '0.75rem', mr: 0.5 }} />
                            {operator.headquarters}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {operator.totalStakedFormatted}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {operator.valueUsd} • {operator.validatorCount.toLocaleString()} validators
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={operator.serviceLevel}
                        size="small"
                        color={getServiceLevelColor(operator.serviceLevel)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {operator.apy.toFixed(2)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Box sx={{ width: 60, mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={operator.effectiveness}
                            color={operator.effectiveness > 99 ? 'success' : 'warning'}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                        <Typography variant="body2">
                          {operator.effectiveness.toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={operator.riskScore}
                        size="small"
                        color={getRiskColor(operator.riskScore)}
                        icon={
                          operator.riskScore === 'Low' ? <CheckCircle /> :
                          operator.riskScore === 'Medium' ? <Warning /> :
                          <Warning />
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Badge badgeContent={operator.integrators} color="primary">
                        <Business color="action" />
                      </Badge>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {operator.feeRate.toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {operator.monthlyGrowth > 0 ? (
                          <TrendingUp color="success" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        ) : (
                          <TrendingDown color="error" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        )}
                        <Typography
                          variant="body2"
                          color={operator.monthlyGrowth > 0 ? 'success.main' : 'error.main'}
                        >
                          {operator.monthlyGrowth > 0 ? '+' : ''}{operator.monthlyGrowth.toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openOperatorDetails(operator)}
                        startIcon={<Info />}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Operator Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{ sx: { minHeight: '80vh' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mr: 2, fontSize: '1.5rem' }}>
                {selectedOperator?.logo}
              </Typography>
              <Box>
                <Typography variant="h6">{selectedOperator?.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedOperator?.headquarters} • Since {selectedOperator?.established}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={selectedOperator?.serviceLevel}
              color={getServiceLevelColor(selectedOperator?.serviceLevel || '')}
              variant="outlined"
            />
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 0 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Overview" />
            <Tab label="Performance" />
            <Tab label="Infrastructure" />
            <Tab label="Compliance" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Business Overview</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Business Model</Typography>
                        <Typography variant="body1">{selectedOperator?.businessModel}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Min Stake Amount</Typography>
                        <Typography variant="body1">{selectedOperator?.minStakeAmount} ETH</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Current Utilization</Typography>
                        <Typography variant="body1">{selectedOperator?.currentUtilization}%</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Jurisdictions</Typography>
                        <Typography variant="body1">{selectedOperator?.jurisdictions.join(', ')}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Key Personnel</Typography>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">CEO</Typography>
                        <Typography variant="body1">{selectedOperator?.keyPersonnel.ceo}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">CTO</Typography>
                        <Typography variant="body1">{selectedOperator?.keyPersonnel.cto}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Head of Staking</Typography>
                        <Typography variant="body1">{selectedOperator?.keyPersonnel.headOfStaking}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Performance Radar</Typography>
                    <Box sx={{ height: 300 }}>
                      {selectedOperator && (
                        <Radar
                          data={generateRadarData(selectedOperator)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              r: {
                                beginAtZero: true,
                                max: 100,
                              },
                            },
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Client Distribution</Typography>
                    <Box sx={{ height: 300 }}>
                      {selectedOperator && (
                        <Doughnut
                          data={generateClientDistributionData(selectedOperator)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'bottom' },
                            },
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Infrastructure Details</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Detailed infrastructure information would be displayed here, including:
                    </Typography>
                    <ul>
                      <li>Geographic distribution of validators</li>
                      <li>Client software diversity</li>
                      <li>Hardware specifications</li>
                      <li>Network connectivity and redundancy</li>
                      <li>Monitoring and alerting systems</li>
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Certifications & Compliance</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                      {selectedOperator?.certifications.map((cert) => (
                        <Chip key={cert} label={cert} color="success" variant="outlined" />
                      ))}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Compliance details and audit reports would be available here for premium users.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Launch />}>
            View Full Profile
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OperatorsPage;
