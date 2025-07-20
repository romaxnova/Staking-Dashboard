import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Badge,
  useTheme,
  alpha,
  Tab,
  Tabs,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Person,
  Star,
  StarBorder,
  Visibility,
  Timeline,
  Assessment,
  Upgrade,
  Download,
  Share,
  Settings,
  Notifications,
  Security,
  Help,
  Lock,
  CheckCircle,
  Warning,
  Info,
  TrendingUp,
  Business,
  AccountBalance,
  ShowChart,
  PieChart,
  BarChart,
  FileDownload,
  Email,
  Calendar,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';

interface WatchlistItem {
  id: string;
  type: 'integrator' | 'operator' | 'validator';
  name: string;
  logo: string;
  apy?: number;
  effectiveness?: number;
  riskScore?: string;
  stakedAmount?: string;
  change24h?: number;
  alerts: {
    apyThreshold: number;
    effectivenessThreshold: number;
    enabled: boolean;
  };
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  tier: 'free' | 'premium';
  memberSince: string;
  reportsGenerated: number;
  reportsLimit: number;
  watchlistLimit: number;
  features: {
    basicAnalytics: boolean;
    advancedCharts: boolean;
    customReports: boolean;
    realTimeAlerts: boolean;
    historicalData: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
  };
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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const FreeProfileSystem: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [addToWatchlistOpen, setAddToWatchlistOpen] = useState(false);
  const [reportGenerationOpen, setReportGenerationOpen] = useState(false);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user-123',
    email: 'user@example.com',
    name: 'Alex Johnson',
    avatar: 'A',
    tier: 'free',
    memberSince: '2024-01-15',
    reportsGenerated: 1,
    reportsLimit: 1,
    watchlistLimit: 3,
    features: {
      basicAnalytics: true,
      advancedCharts: false,
      customReports: false,
      realTimeAlerts: false,
      historicalData: false,
      apiAccess: false,
      prioritySupport: false,
    },
  });

  useEffect(() => {
    // Load user watchlist and profile data
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // In a real implementation, this would fetch from your backend
    const mockWatchlist: WatchlistItem[] = [
      {
        id: 'ledger-live',
        type: 'integrator',
        name: 'Ledger Live',
        logo: '🔷',
        apy: 3.54,
        effectiveness: 99.2,
        riskScore: 'Low',
        stakedAmount: '426,400 ETH',
        change24h: 0.12,
        alerts: {
          apyThreshold: 3.0,
          effectivenessThreshold: 95.0,
          enabled: true,
        },
      },
      {
        id: 'kiln',
        type: 'operator',
        name: 'Kiln',
        logo: '🔥',
        apy: 3.45,
        effectiveness: 99.4,
        riskScore: 'Low',
        stakedAmount: '2,456,789 ETH',
        change24h: 0.08,
        alerts: {
          apyThreshold: 3.2,
          effectivenessThreshold: 98.0,
          enabled: true,
        },
      },
    ];
    setWatchlist(mockWatchlist);
  };

  const handleAddToWatchlist = (item: WatchlistItem) => {
    if (watchlist.length >= profile.watchlistLimit && profile.tier === 'free') {
      setUpgradeDialogOpen(true);
      return;
    }
    setWatchlist(prev => [...prev, item]);
    setAddToWatchlistOpen(false);
  };

  const handleRemoveFromWatchlist = (itemId: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== itemId));
  };

  const handleGenerateReport = () => {
    if (profile.reportsGenerated >= profile.reportsLimit && profile.tier === 'free') {
      setUpgradeDialogOpen(true);
      return;
    }
    setReportGenerationOpen(true);
  };

  const getFeatureStatus = (feature: keyof UserProfile['features']) => {
    return profile.features[feature];
  };

  const getUsageColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 100) return 'error';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  const premiumFeatures = [
    { name: 'Unlimited Watchlist Items', current: 'Limited to 3 items' },
    { name: 'Unlimited Monthly Reports', current: 'Limited to 1 report/month' },
    { name: 'Advanced Analytics & Charts', current: 'Basic analytics only' },
    { name: 'Real-time Alerts & Notifications', current: 'No alerts' },
    { name: 'Historical Data (6+ months)', current: 'Limited to 30 days' },
    { name: 'Custom Report Templates', current: 'Standard reports only' },
    { name: 'API Access', current: 'No API access' },
    { name: 'Priority Support', current: 'Community support only' },
    { name: 'Export to Excel/PDF', current: 'View only' },
    { name: 'Portfolio Performance Tracking', current: 'Basic tracking' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              {profile.avatar}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
              {profile.name}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
              {profile.email}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={profile.tier === 'free' ? 'Free Profile' : 'Premium Member'}
                color={profile.tier === 'free' ? 'default' : 'primary'}
                icon={profile.tier === 'free' ? <Person /> : <Star />}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Member since {new Date(profile.memberSince).toLocaleDateString()}
              </Typography>
            </Stack>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              startIcon={<Upgrade />}
              onClick={() => setUpgradeDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)',
                boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E55528 0%, #CC4A22 100%)',
                },
              }}
            >
              Upgrade to Premium
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Usage Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Reports
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(profile.reportsGenerated / profile.reportsLimit) * 100}
                    color={getUsageColor(profile.reportsGenerated, profile.reportsLimit)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {profile.reportsGenerated}/{profile.reportsLimit}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {profile.reportsLimit - profile.reportsGenerated} reports remaining this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Watchlist Usage
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(watchlist.length / profile.watchlistLimit) * 100}
                    color={getUsageColor(watchlist.length, profile.watchlistLimit)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {watchlist.length}/{profile.watchlistLimit}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {profile.watchlistLimit - watchlist.length} slots available
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab icon={<Visibility />} label="Watchlist" />
            <Tab icon={<Assessment />} label="Reports" />
            <Tab icon={<Settings />} label="Settings" />
            <Tab icon={<Upgrade />} label="Upgrade" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Your Watchlist</Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setAddToWatchlistOpen(true)}
              disabled={watchlist.length >= profile.watchlistLimit && profile.tier === 'free'}
            >
              Add Item
            </Button>
          </Box>

          {watchlist.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your watchlist is empty
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Add integrators, operators, or validators to track their performance and receive updates.
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={() => setAddToWatchlistOpen(true)}>
                Add Your First Item
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {watchlist.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ mr: 2, fontSize: '1.5rem' }}>
                            {item.logo}
                          </Typography>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                            <Chip
                              label={item.type}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {item.apy && (
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="caption" color="text.secondary">APY</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.apy.toFixed(2)}%
                              </Typography>
                            </Box>
                          )}
                          {item.effectiveness && (
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="caption" color="text.secondary">Effectiveness</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.effectiveness.toFixed(1)}%
                              </Typography>
                            </Box>
                          )}
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveFromWatchlist(item.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {profile.tier === 'free' && watchlist.length > 0 && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <AlertTitle>Free Profile Limitations</AlertTitle>
              You can track up to {profile.watchlistLimit} items. Upgrade to Premium for unlimited watchlist items and real-time alerts.
            </Alert>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Your Reports</Typography>
            <Button
              variant="contained"
              startIcon={<FileDownload />}
              onClick={handleGenerateReport}
              disabled={profile.reportsGenerated >= profile.reportsLimit && profile.tier === 'free'}
            >
              Generate Report
            </Button>
          </Box>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>Free Profile Report Limit</AlertTitle>
            You have used {profile.reportsGenerated} of {profile.reportsLimit} monthly reports. 
            Upgrade to Premium for unlimited report generation.
          </Alert>

          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No reports generated yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Generate comprehensive reports on your tracked integrators, operators, and performance metrics.
            </Typography>
            {profile.reportsGenerated < profile.reportsLimit ? (
              <Button variant="contained" startIcon={<FileDownload />} onClick={handleGenerateReport}>
                Generate Your First Report
              </Button>
            ) : (
              <Button variant="outlined" startIcon={<Upgrade />} onClick={() => setUpgradeDialogOpen(true)}>
                Upgrade for More Reports
              </Button>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>Account Settings</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Profile Information</Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="Name"
                      value={profile.name}
                      fullWidth
                      variant="outlined"
                    />
                    <TextField
                      label="Email"
                      value={profile.email}
                      fullWidth
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Notification Preferences</Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Email notifications</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getFeatureStatus('realTimeAlerts') ? 'Enabled' : 'Premium only'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Performance alerts</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getFeatureStatus('realTimeAlerts') ? 'Enabled' : 'Premium only'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>Upgrade to Premium</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Unlock the full potential of Kiln's staking analytics platform with Premium features.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Premium Features</Typography>
                  <List>
                    {premiumFeatures.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.name}
                          secondary={`Currently: ${feature.current}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    $29
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                    per month
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                    onClick={() => setUpgradeDialogOpen(true)}
                  >
                    Upgrade Now
                  </Button>
                  <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.8 }}>
                    Cancel anytime • 14-day free trial
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onClose={() => setUpgradeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Upgrade to Premium
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Unlock unlimited access to Kiln's comprehensive staking analytics platform.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>What you'll get:</Typography>
              <List dense>
                {premiumFeatures.slice(0, 5).map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={feature.name} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>&nbsp;</Typography>
              <List dense>
                {premiumFeatures.slice(5).map((feature, index) => (
                  <ListItem key={index + 5}>
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={feature.name} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialogOpen(false)}>Not Now</Button>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)' }}
          >
            Start Free Trial
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add to Watchlist Dialog */}
      <Dialog open={addToWatchlistOpen} onClose={() => setAddToWatchlistOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add to Watchlist</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Search and add integrators, operators, or validators to your watchlist.
          </Typography>
          <TextField
            fullWidth
            placeholder="Search for integrators, operators, or validators..."
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Popular items to add would be listed here...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddToWatchlistOpen(false)}>Cancel</Button>
          <Button variant="contained">Add to Watchlist</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FreeProfileSystem;
