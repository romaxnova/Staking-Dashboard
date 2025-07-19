import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  Timeline,
  AccountBalance,
  Speed,
  Security,
  Refresh,
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  description: string;
}

interface ValidatorPerformance {
  id: string;
  pubkey: string;
  apy: number;
  uptime: number;
  effectiveness: number;
  balance: number;
  rewards: number;
  status: 'active' | 'pending' | 'exiting';
}

const StakingPerformance: React.FC = () => {
  const { addNotification } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [validators, setValidators] = useState<ValidatorPerformance[]>([]);
  
  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    setLoading(true);
    console.log('🔄 Fetching staking performance data...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock performance metrics
      const metrics: PerformanceMetric[] = [
        {
          id: 'apy',
          name: 'Average APY',
          value: 3.42,
          unit: '%',
          change: 0.15,
          status: 'excellent',
          description: 'Annual percentage yield from staking rewards'
        },
        {
          id: 'uptime',
          name: 'Network Uptime',
          value: 99.95,
          unit: '%',
          change: 0.02,
          status: 'excellent',
          description: 'Percentage of time validators are online'
        },
        {
          id: 'effectiveness',
          name: 'Validator Effectiveness',
          value: 97.8,
          unit: '%',
          change: -0.3,
          status: 'good',
          description: 'How well validators perform their duties'
        },
        {
          id: 'rewards',
          name: 'Total Rewards',
          value: 1247.56,
          unit: 'ETH',
          change: 12.4,
          status: 'excellent',
          description: 'Total staking rewards earned'
        },
        {
          id: 'slashing',
          name: 'Slashing Risk',
          value: 0.01,
          unit: '%',
          change: -0.005,
          status: 'excellent',
          description: 'Risk of validator penalties'
        },
      ];

      // Mock validator performance data
      const validatorData: ValidatorPerformance[] = Array.from({ length: 10 }, (_, i) => ({
        id: `validator_${i + 1}`,
        pubkey: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
        apy: 3.2 + Math.random() * 0.5,
        uptime: 99.5 + Math.random() * 0.5,
        effectiveness: 95 + Math.random() * 5,
        balance: 32 + Math.random() * 0.8,
        rewards: Math.random() * 2.5,
        status: Math.random() > 0.9 ? 'pending' : 'active'
      }));

      setPerformanceMetrics(metrics);
      setValidators(validatorData);
      
      console.log('📊 Performance data loaded successfully');
    } catch (error) {
      console.error('❌ Error fetching performance data:', error);
      addNotification({
        title: 'Performance Data Error',
        message: 'Failed to load staking performance data',
        type: 'error',
        read: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'average': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  const getValidatorStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'exiting': return 'error';
      default: return 'default';
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Refreshing performance data...');
    fetchPerformanceData();
    addNotification({
      title: 'Performance Data Refreshed',
      message: 'Latest staking performance metrics have been loaded',
      type: 'success',
      read: false,
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading performance data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Staking Performance
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor your validators' performance and earnings
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="24h">24 Hours</MenuItem>
              <MenuItem value="7d">7 Days</MenuItem>
              <MenuItem value="30d">30 Days</MenuItem>
              <MenuItem value="90d">90 Days</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Performance Metrics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
        {performanceMetrics.map((metric) => (
          <Card key={metric.id} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  {metric.id === 'apy' && <TrendingUp />}
                  {metric.id === 'uptime' && <Timeline />}
                  {metric.id === 'effectiveness' && <Assessment />}
                  {metric.id === 'rewards' && <AccountBalance />}
                  {metric.id === 'slashing' && <Security />}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {metric.name}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {metric.value.toFixed(2)}{metric.unit}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip 
                  label={metric.status.toUpperCase()} 
                  color={getStatusColor(metric.status) as any}
                  size="small"
                />
                <Typography 
                  variant="caption" 
                  color={metric.change >= 0 ? 'success.main' : 'error.main'}
                  sx={{ fontWeight: 600 }}
                >
                  {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}{metric.unit}
                </Typography>
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {metric.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Validator Performance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Validator Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Validator</TableCell>
                  <TableCell align="right">APY</TableCell>
                  <TableCell align="right">Uptime</TableCell>
                  <TableCell align="right">Effectiveness</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="right">Rewards</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {validators.map((validator) => (
                  <TableRow key={validator.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'secondary.main' }}>
                          {validator.id.slice(-1)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {validator.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {validator.pubkey}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {validator.apy.toFixed(2)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {validator.uptime.toFixed(2)}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={validator.uptime} 
                          sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {validator.effectiveness.toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {validator.balance.toFixed(3)} ETH
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        +{validator.rewards.toFixed(4)} ETH
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={validator.status.toUpperCase()} 
                        color={getValidatorStatusColor(validator.status) as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StakingPerformance;
