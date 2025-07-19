import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel,
  Tooltip,
  Button,
  LinearProgress
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Star,
  StarBorder,
  Download,
  Refresh
} from '@mui/icons-material';
import { benchmarkValidator, getPerformanceBadge } from '../utils/benchmarkUtils';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../utils/watchlistUtils';
import { exportValidatorsToCSV, exportComplianceReport } from '../utils/exportUtils';

interface Validator {
  address: string;
  token_symbol: string;
  token_name: string;
  name: string;
  url?: string;
  network: string;
  creation_time: string;
  public_commission_rate_percent?: number;
  complianceStatus?: string;
  badges: Array<{
    type: string;
    label: string;
    color: string;
  }>;
  uptime: string;
  commission: number | string;
  apy: string;
  lastSlashing?: string | null;
}

const ValidatorTable: React.FC = () => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<keyof Validator>('name');
  const [filter, setFilter] = useState<string>('');
  const [networkFilter, setNetworkFilter] = useState<string>('');
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  const [benchmarks, setBenchmarks] = useState<any[]>([]);

  useEffect(() => {
    fetchValidators();
  }, []);

  useEffect(() => {
    if (validators.length > 0) {
      calculateBenchmarks();
    }
  }, [validators]);

  const fetchValidators = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/validators');
      if (!response.ok) {
        throw new Error('Failed to fetch validators');
      }
      const data = await response.json();
      setValidators(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching validators:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  const calculateBenchmarks = () => {
    const validatorBenchmarks = validators.map(validator => 
      benchmarkValidator(validator, validators)
    );
    setBenchmarks(validatorBenchmarks);
  };

  const handleToggleWatchlist = (validator: Validator) => {
    const inWatchlist = isInWatchlist(validator.address, 'validator');
    
    if (inWatchlist) {
      removeFromWatchlist(validator.address, 'validator');
    } else {
      addToWatchlist({
        id: validator.address,
        type: 'validator',
        name: validator.name,
        address: validator.address,
        network: validator.network
      });
    }
    
    // Force re-render to update star icons
    setValidators([...validators]);
  };

  const handleExportCompliance = () => {
    exportComplianceReport(validators);
  };

  const handleExportValidators = () => {
    exportValidatorsToCSV(filteredValidators);
  };

  const handleSortRequest = (property: keyof Validator) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const filteredValidators = validators
    .filter((validator) =>
      validator.name.toLowerCase().includes(filter.toLowerCase())
    )
    .filter((validator) =>
      validator.network.toLowerCase().includes(networkFilter.toLowerCase())
    )
    .filter((validator) => 
      !showWatchlistOnly || isInWatchlist(validator.address, 'validator')
    );

  const sortedValidators = filteredValidators.sort((a, b) => {
    const aValue = a[sortBy] ?? '';
    const bValue = b[sortBy] ?? '';

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getStatusColor = (status?: string) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'gold':
        return { bgcolor: '#FFF3CD', color: '#856404' };
      case 'green':
        return { bgcolor: '#D4EDDA', color: '#155724' };
      case 'blue':
        return { bgcolor: '#CCE5FF', color: '#004085' };
      default:
        return { bgcolor: '#E2E3E5', color: '#383D41' };
    }
  };

  const getComplianceStatus = (status: string) => {
    switch (status) {
      case 'CLEAR':
        return {
          icon: <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />,
          text: 'Clear',
          color: 'success.main'
        };
      case 'FLAGGED':
        return {
          icon: <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />,
          text: 'Flagged',
          color: 'error.main'
        };
      case 'ERROR':
        return {
          icon: <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />,
          text: 'Error',
          color: 'warning.main'
        };
      default:
        return {
          icon: <WarningIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
          text: 'Unknown',
          color: 'text.secondary'
        };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        {error} - Showing mock data for demonstration
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search by validator name"
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, mr: 1 }}
        />
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Network</InputLabel>
          <Select
            value={networkFilter}
            onChange={(e) => setNetworkFilter(e.target.value)}
            label="Network"
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {Array.from(new Set(validators.map((v) => v.network))).map((network) => (
              <MenuItem key={network} value={network}>
                {network}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          size="small"
          onClick={() => setShowWatchlistOnly(!showWatchlistOnly)}
          startIcon={showWatchlistOnly ? <StarBorder /> : <Star />}
        >
          {showWatchlistOnly ? 'Show All' : 'Show Watchlist'}
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortDirection}
                  onClick={() => handleSortRequest('name')}
                >
                  Validator
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'network'}
                  direction={sortDirection}
                  onClick={() => handleSortRequest('network')}
                >
                  Network
                </TableSortLabel>
              </TableCell>
              <TableCell>Token</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'uptime'}
                  direction={sortDirection}
                  onClick={() => handleSortRequest('uptime')}
                >
                  Uptime
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'commission'}
                  direction={sortDirection}
                  onClick={() => handleSortRequest('commission')}
                >
                  Commission
                </TableSortLabel>
              </TableCell>
              <TableCell>APY</TableCell>
              <TableCell>Compliance</TableCell>
              <TableCell>Reputation</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedValidators.map((validator, index) => {
              const benchmark = benchmarks.find(b => b.validator.address === validator.address);
              const performanceBadge = benchmark ? getPerformanceBadge(benchmark) : null;
              const inWatchlist = isInWatchlist(validator.address, 'validator');
              
              return (
                <TableRow key={validator.address || index} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {validator.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {validator.address}
                      </Typography>
                      {performanceBadge && (
                        <Chip
                          label={performanceBadge.label}
                          size="small"
                          color={performanceBadge.color as any}
                          sx={{ mt: 0.5, display: 'block', width: 'fit-content' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={validator.network}
                      color="info"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {validator.token_symbol?.toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {validator.token_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {validator.uptime}%
                      </Typography>
                      {benchmark && (
                        <LinearProgress
                          variant="determinate"
                          value={benchmark.uptime.percentile}
                          color={benchmark.uptime.color as any}
                          sx={{ width: 40, height: 4, borderRadius: 2 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {validator.commission}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SecurityIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="bold">
                        {validator.apy}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getComplianceStatus(validator.complianceStatus || 'UNKNOWN').icon}
                      <Typography 
                        variant="body2" 
                        color={getComplianceStatus(validator.complianceStatus || 'UNKNOWN').color}
                        fontWeight="bold"
                      >
                        {getComplianceStatus(validator.complianceStatus || 'UNKNOWN').text}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {validator.badges.map((badge, index) => (
                        <Chip
                          key={index}
                          label={badge.label}
                          size="small"
                          sx={getBadgeColor(badge.color)}
                        />
                      ))}
                      {validator.badges.length === 0 && (
                        <Typography variant="caption" color="text.secondary">
                          No badges
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleToggleWatchlist(validator)}
                          color={inWatchlist ? "primary" : "default"}
                        >
                          {inWatchlist ? <Star /> : <StarBorder />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View details">
                        <IconButton size="small" color="primary">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ValidatorTable;
