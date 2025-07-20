import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Close,
  TrendingUp,
  TrendingDown,
  Timeline,
  Assessment,
  History,
  Info,
  Speed,
  AccountBalance,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface MetricDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  metricType: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  subtitle?: string;
  isWatched: boolean;
  onWatchlistToggle: () => void;
}

const MetricDetailsDialog: React.FC<MetricDetailsDialogProps> = ({
  open,
  onClose,
  metricType,
  title,
  value,
  change,
  changeType,
  icon,
  subtitle,
  isWatched,
  onWatchlistToggle,
}) => {
  const theme = useTheme();

  // Mock historical data and details
  const getMetricDetails = () => {
    switch (metricType) {
      case 'total_staked':
        return {
          description: 'Total amount of ETH currently staked across all validators',
          trend: '+2.4% this week',
          trendDirection: 'up',
          details: [
            { label: 'Active Validators', value: '1,135,000' },
            { label: 'Pending Validators', value: '22,700' },
            { label: 'Exiting Validators', value: '1,245' },
            { label: 'Average Stake', value: '32.0 ETH' },
          ],
          historicalData: [
            { period: '1 week ago', value: '31,742,000 ETH' },
            { period: '1 month ago', value: '30,892,000 ETH' },
            { period: '3 months ago', value: '28,654,000 ETH' },
            { period: '6 months ago', value: '24,123,000 ETH' },
          ]
        };
      case 'active_validators':
        return {
          description: 'Number of validators currently participating in consensus',
          trend: '+1.8% this week',
          trendDirection: 'up',
          details: [
            { label: 'Total Validators', value: '1,135,000' },
            { label: 'Effectiveness', value: '97.8%' },
            { label: 'Average Uptime', value: '99.95%' },
            { label: 'Slashing Events', value: '0.001%' },
          ],
          historicalData: [
            { period: '1 week ago', value: '1,115,234' },
            { period: '1 month ago', value: '1,087,456' },
            { period: '3 months ago', value: '998,123' },
            { period: '6 months ago', value: '854,789' },
          ]
        };
      case 'network_apr':
        return {
          description: 'Annual percentage yield for Ethereum staking rewards',
          trend: '+0.15% this week',
          trendDirection: 'up',
          details: [
            { label: 'Base APY', value: '3.42%' },
            { label: 'MEV Boost', value: '+0.28%' },
            { label: 'Protocol Rewards', value: '+0.12%' },
            { label: 'Total APY', value: '3.82%' },
          ],
          historicalData: [
            { period: '1 week ago', value: '3.27%' },
            { period: '1 month ago', value: '3.18%' },
            { period: '3 months ago', value: '3.45%' },
            { period: '6 months ago', value: '4.12%' },
          ]
        };
      case 'unique_integrators':
        return {
          description: 'Total USD value of all staked ETH at current prices',
          trend: '+8.2% this week',
          trendDirection: 'up',
          details: [
            { label: 'ETH Price', value: '$3,650' },
            { label: 'Total ETH', value: '32,450,000' },
            { label: 'Market Cap Impact', value: '24.8%' },
            { label: 'Staking Ratio', value: '27.1%' },
          ],
          historicalData: [
            { period: '1 week ago', value: '$115.2B' },
            { period: '1 month ago', value: '$108.7B' },
            { period: '3 months ago', value: '$92.4B' },
            { period: '6 months ago', value: '$78.1B' },
          ]
        };
      default:
        return {
          description: 'Detailed information about this metric',
          trend: 'No change',
          trendDirection: 'neutral',
          details: [],
          historicalData: []
        };
    }
  };

  const metricData = getMetricDetails();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {metricData.description}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          {/* Current Value Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Value
                  </Typography>
                </Box>
                <Chip
                  icon={metricData.trendDirection === 'up' ? <TrendingUp /> : 
                        metricData.trendDirection === 'down' ? <TrendingDown /> : 
                        <Timeline />}
                  label={metricData.trend}
                  color={metricData.trendDirection === 'up' ? 'success' : 
                         metricData.trendDirection === 'down' ? 'error' : 'default'}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
            mb: 3 
          }}>
            {metricData.details.map((detail, index) => (
              <Card key={index}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {detail.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {detail.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Historical Data */}
          {metricData.historicalData.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <History sx={{ mr: 1 }} />
                  Historical Data
                </Typography>
                <List dense>
                  {metricData.historicalData.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Assessment fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.period}
                        secondary={item.value}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onClose}>
          Add to Watchlist
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MetricDetailsDialog;
