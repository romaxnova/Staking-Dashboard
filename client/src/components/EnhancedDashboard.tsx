import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  useTheme,
  alpha,
  Skeleton,
  Fade,
  Zoom,
  Paper,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Security,
  MonetizationOn,
  Group,
  Visibility,
  Star,
  StarBorder,
  LaunchOutlined,
  Refresh,
  InfoOutlined,
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import MetricDetailsDialog from './MetricDetailsDialog';
import etherscanService from '../services/etherscanService';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  subtitle,
}) => {
  const theme = useTheme();
  const { addToWatchlist, addNotification } = useAppContext();
  const [loaded, setLoaded] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), Math.random() * 500 + 200);
    return () => clearTimeout(timer);
  }, []);

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return theme.palette.success.main;
      case 'negative':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleWatchlistToggle = () => {
    console.log('Watchlist toggle clicked for:', title);
    setIsWatched(!isWatched);
    if (!isWatched) {
      addToWatchlist(title);
      console.log('Added to watchlist:', title);
    } else {
      console.log('Removed from watchlist:', title);
    }
    addNotification({
      title: isWatched ? 'Removed from Watchlist' : 'Added to Watchlist',
      message: `${title} ${isWatched ? 'removed from' : 'added to'} your watchlist`,
      type: 'success',
      read: false,
    });
  };

  const handleViewDetails = () => {
    console.log('View details clicked for:', title);
    setDetailsOpen(true);
  };

  return (
    <Zoom in={loaded} timeout={600}>
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            '& .metric-actions': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        <CardContent sx={{ p: 3, pb: '16px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Avatar
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mr: 2,
                width: 48,
                height: 48,
              }}
            >
              {icon}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, mb: 0.5 }}
              >
                {title}
              </Typography>
              {loaded ? (
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {value}
                </Typography>
              ) : (
                <Skeleton width={120} height={40} />
              )}
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Chip
              size="small"
              label={change}
              icon={
                changeType === 'positive' ? (
                  <TrendingUp sx={{ fontSize: '16px !important' }} />
                ) : changeType === 'negative' ? (
                  <TrendingDown sx={{ fontSize: '16px !important' }} />
                ) : undefined
              }
              sx={{
                backgroundColor: alpha(getChangeColor(), 0.1),
                color: getChangeColor(),
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: 'inherit',
                },
              }}
            />
          </Box>

          {/* Hover Actions */}
          <Box
            className="metric-actions"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              opacity: 0,
              transform: 'translateY(-8px)',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              gap: 0.5,
            }}
          >
            <Tooltip title="View details">
              <IconButton 
                size="small" 
                onClick={handleViewDetails}
                sx={{ backgroundColor: alpha('#fff', 0.9) }}
              >
                <Visibility sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={isWatched ? "Remove from watchlist" : "Add to watchlist"}>
              <IconButton 
                size="small" 
                onClick={handleWatchlistToggle}
                sx={{ backgroundColor: alpha('#fff', 0.9) }}
              >
                {isWatched ? (
                  <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                ) : (
                  <StarBorder sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Details Dialog */}
          <MetricDetailsDialog
            open={detailsOpen}
            onClose={() => setDetailsOpen(false)}
            metricType={title.toLowerCase().replace(/\s+/g, '_')}
            title={title}
            value={value}
            change={change}
            changeType={changeType}
            icon={icon}
            subtitle={subtitle}
            isWatched={isWatched}
            onWatchlistToggle={handleWatchlistToggle}
          />
        </CardContent>
      </Card>
    </Zoom>
  );
};

const EnhancedDashboard: React.FC = () => {
  const theme = useTheme();
  const { addNotification } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from Etherscan
  const fetchRealTimeData = async () => {
    try {
      console.log('Fetching real-time data from Etherscan...');
      setError(null);
      
      // Start with just ETH price - the simplest endpoint
      const ethPrice = await etherscanService.getEthPrice();
      console.log('ETH Price data received:', ethPrice);
      
      const currentPrice = parseFloat(ethPrice.ethusd);
      
      const data = {
        ethPrice: currentPrice,
        lastUpdated: new Date().toISOString()
      };
      
      console.log('Processed data:', data);
      setRealTimeData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching real-time data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchRealTimeData();
      setLoading(false);
    };

    initializeData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshData = async () => {
    console.log('Manual refresh triggered');
    setRefreshing(true);
    
    try {
      await fetchRealTimeData();
      setSnackbarOpen(true);
      addNotification({
        title: 'Data Refreshed',
        message: 'Dashboard metrics updated with latest Etherscan data',
        type: 'success',
        read: false,
      });
    } catch (err) {
      addNotification({
        title: 'Refresh Failed',
        message: 'Failed to fetch latest data. Please try again.',
        type: 'error',
        read: false,
      });
    }
    
    setRefreshing(false);
  };

  // Generate metrics with real data
  const getMetrics = () => {
    if (!realTimeData) {
      return [
        {
          title: 'ETH Price',
          value: 'Loading...',
          change: '...',
          changeType: 'neutral' as const,
          icon: <MonetizationOn />,
          subtitle: 'Live from Etherscan',
        },
        {
          title: 'Active Validators',
          value: '35,559',
          change: '+127 (24h)',
          changeType: 'positive' as const,
          icon: <Security />,
          subtitle: '99.98% Uptime (Placeholder)',
        },
        {
          title: 'Network APR',
          value: '3.42%',
          change: '+0.05% (7d)',
          changeType: 'positive' as const,
          icon: <AccountBalance />,
          subtitle: 'Annualized Return (Placeholder)',
        },
        {
          title: 'Unique Integrators',
          value: '147,020',
          change: '+2,341 (24h)',
          changeType: 'positive' as const,
          icon: <Group />,
          subtitle: 'Active Users (Placeholder)',
        },
      ];
    }

    return [
      {
        title: 'ETH Price',
        value: `$${realTimeData.ethPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: 'Live data ✓',
        changeType: 'positive' as const,
        icon: <MonetizationOn />,
        subtitle: `Updated: ${new Date(realTimeData.lastUpdated).toLocaleTimeString()}`,
      },
      {
        title: 'Active Validators',
        value: '35,559',
        change: '+127 (24h)',
        changeType: 'positive' as const,
        icon: <Security />,
        subtitle: '99.98% Uptime (Placeholder)',
      },
      {
        title: 'Network APR',
        value: '3.42%',
        change: '+0.05% (7d)',
        changeType: 'positive' as const,
        icon: <AccountBalance />,
        subtitle: 'Annualized Return (Placeholder)',
      },
      {
        title: 'Unique Integrators',
        value: '147,020',
        change: '+2,341 (24h)',
        changeType: 'positive' as const,
        icon: <Group />,
        subtitle: 'Active Users (Placeholder)',
      },
    ];
  };

  const metrics = getMetrics();

  const topIntegrators = [
    { name: 'Ledger Live', amount: '426,400 ETH', value: '$1.52B', type: 'Dedicated', provider: 'Kiln', logo: '🔷' },
    { name: 'MetaMask', amount: '117,216 ETH', value: '$418M', type: 'Dedicated', provider: 'Consensys', logo: '🦊' },
    { name: 'Trust Wallet', amount: '100,367 ETH', value: '$358M', type: 'Pooled', provider: 'Kiln', logo: '🛡️' },
    { name: 'Coinbase Wallet', amount: '40,458 ETH', value: '$144M', type: 'Pooled', provider: 'Coinbase Cloud', logo: '🔵' },
    { name: 'Safe Wallet', amount: '39,584 ETH', value: '$141M', type: 'Dedicated', provider: 'Kiln', logo: '🔐' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pt: 10 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome back to KilnPM
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                Live Ethereum data powered by Etherscan API
                {realTimeData && (
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    Last updated: {new Date(realTimeData.lastUpdated).toLocaleTimeString()}
                  </Typography>
                )}
              </Typography>
              {error && (
                <Alert severity="warning" sx={{ mt: 2, maxWidth: 500 }}>
                  <strong>API Error:</strong> {error}. Using cached data if available.
                </Alert>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
                onClick={handleRefreshData}
                disabled={refreshing}
                sx={{ minWidth: 120 }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Key Metrics */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
          gap: 3,
          mb: 4 
        }}>
          {metrics.map((metric, index) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </Box>

        {/* Main Content Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3 
        }}>
          {/* Chart Section */}
          <Box>
            <Fade in timeout={1200}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Staking Performance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last 30 days overview
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined">7D</Button>
                    <Button size="small" variant="contained">30D</Button>
                    <Button size="small" variant="outlined">90D</Button>
                  </Box>
                </Box>
                <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {loading ? (
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      Chart visualization coming soon...
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Fade>
          </Box>

          {/* Top Integrators */}
          <Box>
            <Fade in timeout={1400}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Top Integrators
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      By total staked amount
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <LaunchOutlined />
                  </IconButton>
                </Box>
                <Stack spacing={2} sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {topIntegrators.map((integrator, index) => (
                    <Box
                      key={integrator.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Typography variant="h6" sx={{ mr: 2, fontSize: '1.2rem' }}>
                        {integrator.logo}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {integrator.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {integrator.amount} • {integrator.value}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={integrator.type}
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Fade>
          </Box>
        </Box>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Dashboard data refreshed successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnhancedDashboard;
