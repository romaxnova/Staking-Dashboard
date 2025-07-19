import React, { useState, useEffect, useMemo } from 'react';
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
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  Search,
  EmojiEvents,
  Security,
  Star,
  StarBorder,
  Download,
  Refresh,
  Visibility
} from '@mui/icons-material';
import { benchmarkValidator, calculateNetworkStats, getPerformanceBadge } from '../utils/benchmarkUtils';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../utils/watchlistUtils';
import { exportValidatorsToCSV } from '../utils/exportUtils';

interface RankedValidator {
  validator: any;
  rank: number;
  score: number;
  benchmark: any;
  badges: string[];
  isKilnValidator: boolean;
}

const ValidatorRankings: React.FC = () => {
  const [validators, setValidators] = useState<any[]>([]);
  const [rankedValidators, setRankedValidators] = useState<RankedValidator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [networkFilter, setNetworkFilter] = useState('all');
  const [rankingMetric, setRankingMetric] = useState('overall');
  const [showKilnOnly, setShowKilnOnly] = useState(false);
  const [networkStats, setNetworkStats] = useState<any>(null);

  useEffect(() => {
    fetchValidators();
  }, []);

  useEffect(() => {
    if (validators.length > 0) {
      calculateRankings();
    }
  }, [validators, rankingMetric]);

  const fetchValidators = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/validators');
      if (!response.ok) {
        throw new Error('Failed to fetch validators');
      }
      
      const data = await response.json();
      setValidators(data);
      
      // Calculate network statistics
      const stats = calculateNetworkStats(data);
      setNetworkStats(stats);
      
    } catch (err) {
      console.error('Error fetching validators:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch validators');
    } finally {
      setLoading(false);
    }
  };

  const calculateRankings = () => {
    const ranked = validators.map((validator, index) => {
      const benchmark = benchmarkValidator(validator, validators);
      const isKilnValidator = validator.name?.toLowerCase().includes('kiln') || 
                             validator.url?.toLowerCase().includes('kiln') ||
                             validator.address?.toLowerCase().includes('kiln');
      
      // Calculate overall score based on multiple factors
      let score = 0;
      switch (rankingMetric) {
        case 'uptime':
          score = benchmark.uptime.percentile;
          break;
        case 'apy':
          score = benchmark.apy.percentile;
          break;
        case 'commission':
          score = 100 - benchmark.commission.percentile; // Lower commission is better
          break;
        case 'overall':
        default:
          score = benchmark.overall.percentile;
          break;
      }
      
      return {
        validator,
        rank: 0, // Will be set after sorting
        score,
        benchmark,
        badges: validator.badges?.map((b: any) => b.label) || [],
        isKilnValidator
      };
    });
    
    // Sort by score and assign ranks
    ranked.sort((a, b) => b.score - a.score);
    ranked.forEach((item, index) => {
      item.rank = index + 1;
    });
    
    setRankedValidators(ranked);
  };

  const filteredValidators = useMemo(() => {
    return rankedValidators.filter(item => {
      const validator = item.validator;
      
      const matchesSearch = !searchTerm || 
        validator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        validator.address?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesNetwork = networkFilter === 'all' || validator.network === networkFilter;
      const matchesKiln = !showKilnOnly || item.isKilnValidator;
      
      return matchesSearch && matchesNetwork && matchesKiln;
    });
  }, [rankedValidators, searchTerm, networkFilter, showKilnOnly]);

  const handleToggleWatchlist = (validator: any) => {
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
    
    // Force re-render
    setRankedValidators([...rankedValidators]);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <EmojiEvents sx={{ color: '#FFD700' }} />;
    if (rank === 2) return <EmojiEvents sx={{ color: '#C0C0C0' }} />;
    if (rank === 3) return <EmojiEvents sx={{ color: '#CD7F32' }} />;
    return <Typography variant="body2" fontWeight={600}>{rank}</Typography>;
  };

  const getRankBackgroundColor = (rank: number) => {
    if (rank <= 3) return 'rgba(255, 215, 0, 0.1)'; // Gold tint for top 3
    if (rank <= 10) return 'rgba(25, 118, 210, 0.05)'; // Light blue for top 10
    return 'transparent';
  };

  const getScoreColor = (score: number): 'success' | 'info' | 'warning' | 'error' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'error';
  };

  const networks = Array.from(new Set(validators.map(v => v.network)));
  const kilnValidators = rankedValidators.filter(v => v.isKilnValidator);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEvents color="warning" />
            Validator Rankings
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Performance-based rankings highlighting top validators
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Download />}
            onClick={() => exportValidatorsToCSV(validators)}
            variant="outlined"
          >
            Export Rankings
          </Button>
          <IconButton onClick={fetchValidators} disabled={loading}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        <Box>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="primary">
                {rankedValidators.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Validators
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="warning.main">
                {kilnValidators.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kiln Validators
              </Typography>
              {kilnValidators.length > 0 && (
                <Typography variant="caption" color="success.main">
                  Best rank: #{Math.min(...kilnValidators.map(v => v.rank))}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="success.main">
                {networkStats?.uptime?.average?.toFixed(2) || 'N/A'}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Network Uptime
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="info.main">
                {networkStats?.apy?.average?.toFixed(2) || 'N/A'}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Network APY
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, alignItems: "center" }}>
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search validators..."
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
          </Box>
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel>Network</InputLabel>
              <Select
                value={networkFilter}
                onChange={(e) => setNetworkFilter(e.target.value)}
                label="Network"
              >
                <MenuItem value="all">All Networks</MenuItem>
                {networks.map(network => (
                  <MenuItem key={network} value={network}>{network}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel>Rank By</InputLabel>
              <Select
                value={rankingMetric}
                onChange={(e) => setRankingMetric(e.target.value)}
                label="Rank By"
              >
                <MenuItem value="overall">Overall Score</MenuItem>
                <MenuItem value="uptime">Uptime</MenuItem>
                <MenuItem value="apy">APY</MenuItem>
                <MenuItem value="commission">Commission</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Button
              fullWidth
              variant={showKilnOnly ? "contained" : "outlined"}
              onClick={() => setShowKilnOnly(!showKilnOnly)}
              startIcon={<Security />}
            >
              Kiln Only
            </Button>
          </Box>
          <Box>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setNetworkFilter('all');
                setShowKilnOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Rankings Table */}
      <Paper>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width={80}>Rank</TableCell>
                <TableCell>Validator</TableCell>
                <TableCell>Network</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Uptime</TableCell>
                <TableCell>APY</TableCell>
                <TableCell>Commission</TableCell>
                <TableCell>Performance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredValidators.map((item) => {
                const { validator, rank, score, benchmark, isKilnValidator } = item;
                const performanceBadge = getPerformanceBadge(benchmark);
                
                return (
                  <TableRow 
                    key={validator.address} 
                    hover
                    sx={{ 
                      backgroundColor: getRankBackgroundColor(rank),
                      '&:hover': {
                        backgroundColor: isKilnValidator ? 'rgba(25, 118, 210, 0.08)' : undefined
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRankIcon(rank)}
                        {isKilnValidator && (
                          <Chip 
                            label="KILN" 
                            size="small" 
                            color="primary" 
                            variant="filled"
                          />
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {validator.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {validator.address?.substring(0, 8)}...{validator.address?.substring(validator.address.length - 6)}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip label={validator.network} size="small" variant="outlined" />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {score.toFixed(1)}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={score}
                          color={getScoreColor(score)}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" color={benchmark.uptime.color}>
                        {benchmark.uptime.value.toFixed(2)}%
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" color={benchmark.apy.color}>
                        {benchmark.apy.value.toFixed(2)}%
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" color={benchmark.commission.color}>
                        {benchmark.commission.value.toFixed(2)}%
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={performanceBadge.label}
                        color={performanceBadge.color as any}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title={isInWatchlist(validator.address, 'validator') ? "Remove from watchlist" : "Add to watchlist"}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleToggleWatchlist(validator)}
                            color={isInWatchlist(validator.address, 'validator') ? "primary" : "default"}
                          >
                            {isInWatchlist(validator.address, 'validator') ? <Star /> : <StarBorder />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View details">
                          <IconButton size="small">
                            <Visibility />
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

        {filteredValidators.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No validators found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Kiln Performance Highlight */}
      {kilnValidators.length > 0 && (
        <Paper sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            🎯 Kiln Validator Performance Highlights
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Best Kiln Rank</Typography>
              <Typography variant="h4" fontWeight={700} color="primary">
                #{Math.min(...kilnValidators.map(v => v.rank))}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Average Kiln Score</Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {(kilnValidators.reduce((sum, v) => sum + v.score, 0) / kilnValidators.length).toFixed(1)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Top 10 Kiln Validators</Typography>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {kilnValidators.filter(v => v.rank <= 10).length}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ValidatorRankings;
