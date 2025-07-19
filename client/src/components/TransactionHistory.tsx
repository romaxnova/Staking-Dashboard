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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  OpenInNew,
  Schedule,
  TrendingUp,
  TrendingDown,
  MonetizationOn,
  Info,
  Refresh,
  Close
} from '@mui/icons-material';
import { format } from 'date-fns';
import { exportTransactionsToCSV, exportToPDF } from '../utils/exportUtils';

interface Transaction {
  hash: string;
  type: 'deposit' | 'withdrawal' | 'reward' | 'restake';
  amount: number;
  amountETH: string;
  amountUSD: string;
  integrator: string;
  validator?: string;
  depositor: string;
  timestamp: string;
  blockNumber: number;
  status: 'confirmed' | 'pending' | 'failed';
  fee: number;
  gasUsed: number;
  riskScore?: number;
}

interface TransactionHistoryProps {
  integrationAddress?: string;
  validatorAddress?: string;
  maxHeight?: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  integrationAddress,
  validatorAddress,
  maxHeight = 600
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, [integrationAddress, validatorAddress]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construct API query based on filters
      const params = new URLSearchParams();
      if (integrationAddress) params.append('integration', integrationAddress);
      if (validatorAddress) params.append('validator', validatorAddress);
      params.append('limit', '500');
      
      const response = await fetch(`http://localhost:3001/api/transactions?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
      
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      
      // Generate mock data for demonstration
      const mockTransactions = generateMockTransactions();
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTransactions = (): Transaction[] => {
    const types: Transaction['type'][] = ['deposit', 'withdrawal', 'reward', 'restake'];
    const integrators = ['Lido', 'Coinbase', 'Kraken', 'Binance', 'Rocket Pool'];
    const statuses: Transaction['status'][] = ['confirmed', 'pending', 'failed'];
    
    return Array.from({ length: 50 }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const amount = Math.random() * 100 + 1;
      const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      return {
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        type,
        amount,
        amountETH: `${amount.toFixed(4)} ETH`,
        amountUSD: `$${(amount * 3000).toLocaleString()}`,
        integrator: integrators[Math.floor(Math.random() * integrators.length)],
        validator: Math.random() > 0.3 ? `0x${Math.random().toString(16).substr(2, 40)}` : undefined,
        depositor: `0x${Math.random().toString(16).substr(2, 40)}`,
        timestamp: timestamp.toISOString(),
        blockNumber: Math.floor(18000000 + Math.random() * 1000000),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        fee: Math.random() * 0.01,
        gasUsed: Math.floor(21000 + Math.random() * 200000),
        riskScore: Math.floor(Math.random() * 100)
      };
    });
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        const matchesSearch = !searchTerm || 
          tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.integrator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.depositor.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = typeFilter === 'all' || tx.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
        
        const matchesDateRange = (!dateRange.start || new Date(tx.timestamp) >= new Date(dateRange.start)) &&
                                (!dateRange.end || new Date(tx.timestamp) <= new Date(dateRange.end));
        
        return matchesSearch && matchesType && matchesStatus && matchesDateRange;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'amount':
            return b.amount - a.amount;
          case 'timestamp':
          default:
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
      });
  }, [transactions, searchTerm, typeFilter, statusFilter, sortBy, dateRange]);

  const handleExportCSV = () => {
    exportTransactionsToCSV(filteredTransactions);
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF('transaction-history-table', 'transaction_history', 'Transaction History Report');
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return <TrendingUp color="success" />;
      case 'withdrawal': return <TrendingDown color="error" />;
      case 'reward': return <MonetizationOn color="warning" />;
      case 'restake': return <TrendingUp color="info" />;
    }
  };

  const getTypeColor = (type: Transaction['type']): 'success' | 'error' | 'warning' | 'info' => {
    switch (type) {
      case 'deposit': return 'success';
      case 'withdrawal': return 'error';
      case 'reward': return 'warning';
      case 'restake': return 'info';
    }
  };

  const getStatusColor = (status: Transaction['status']): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const openEtherscan = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, '_blank');
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const deposits = filteredTransactions.filter(tx => tx.type === 'deposit');
    const withdrawals = filteredTransactions.filter(tx => tx.type === 'withdrawal');
    const rewards = filteredTransactions.filter(tx => tx.type === 'reward');
    
    return {
      totalTransactions: filteredTransactions.length,
      totalDeposited: deposits.reduce((sum, tx) => sum + tx.amount, 0),
      totalWithdrawn: withdrawals.reduce((sum, tx) => sum + tx.amount, 0),
      totalRewards: rewards.reduce((sum, tx) => sum + tx.amount, 0),
      averageGasUsed: filteredTransactions.reduce((sum, tx) => sum + tx.gasUsed, 0) / filteredTransactions.length,
      uniqueIntegrators: new Set(filteredTransactions.map(tx => tx.integrator)).size
    };
  }, [filteredTransactions]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          📋 Transaction History
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Download />}
            onClick={handleExportCSV}
            variant="outlined"
            size="small"
          >
            Export CSV
          </Button>
          <Button
            startIcon={<Download />}
            onClick={handleExportPDF}
            variant="outlined"
            size="small"
          >
            Export PDF
          </Button>
          <IconButton onClick={fetchTransactions} disabled={loading}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(6, 1fr)' }, 
        gap: 2, 
        mb: 3 
      }}>
        <Box>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="primary">
                {summaryStats.totalTransactions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Transactions
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {summaryStats.totalDeposited.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ETH Deposited
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="error.main">
                {summaryStats.totalWithdrawn.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ETH Withdrawn
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {summaryStats.totalRewards.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ETH Rewards
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="info.main">
                {summaryStats.averageGasUsed.toFixed(0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg Gas Used
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr 1fr auto' }, 
          gap: 2, 
          alignItems: 'center' 
        }}>
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search transactions..."
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
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="deposit">Deposits</MenuItem>
                <MenuItem value="withdrawal">Withdrawals</MenuItem>
                <MenuItem value="reward">Rewards</MenuItem>
                <MenuItem value="restake">Restakes</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setStatusFilter('all');
                setDateRange({ start: '', end: '' });
              }}
            >
              Clear
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

      {/* Transaction Table */}
      <Paper id="transaction-history-table">
        <TableContainer sx={{ maxHeight }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Transaction</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Integrator</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.hash} hover>
                  <TableCell>
                    <Tooltip title={tx.hash}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 6)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getTypeIcon(tx.type)}
                      label={tx.type.toUpperCase()}
                      color={getTypeColor(tx.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {tx.amountETH}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tx.amountUSD}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {tx.integrator}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tx.status}
                      color={getStatusColor(tx.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {formatTimeAgo(tx.timestamp)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => setSelectedTransaction(tx)}>
                          <Info />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View on Etherscan">
                        <IconButton size="small" onClick={() => openEtherscan(tx.hash)}>
                          <OpenInNew />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredTransactions.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No transactions found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or search terms
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Transaction Detail Modal */}
      <Dialog
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedTransaction && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Transaction Details</Typography>
                <IconButton onClick={() => setSelectedTransaction(null)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2 
              }}>
                <Box sx={{}}>
                  <Typography variant="subtitle2" color="text.secondary">Hash</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {selectedTransaction.hash}
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                  <Chip
                    icon={getTypeIcon(selectedTransaction.type)}
                    label={selectedTransaction.type.toUpperCase()}
                    color={getTypeColor(selectedTransaction.type)}
                    size="small"
                  />
                </Box>
                <Box sx={{}}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedTransaction.status}
                    color={getStatusColor(selectedTransaction.status)}
                    size="small"
                  />
                </Box>
                <Box sx={{}}>
                  <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                  <Typography variant="body2">{selectedTransaction.amountETH}</Typography>
                  <Typography variant="caption" color="text.secondary">{selectedTransaction.amountUSD}</Typography>
                </Box>
                <Box sx={{}}>
                  <Typography variant="subtitle2" color="text.secondary">Integrator</Typography>
                  <Typography variant="body2">{selectedTransaction.integrator}</Typography>
                </Box>
                <Box sx={{}}>
                  <Typography variant="subtitle2" color="text.secondary">Block Number</Typography>
                  <Typography variant="body2">{selectedTransaction.blockNumber.toLocaleString()}</Typography>
                </Box>
                <Box sx={{}}>
                  <Typography variant="subtitle2" color="text.secondary">Gas Used</Typography>
                  <Typography variant="body2">{selectedTransaction.gasUsed.toLocaleString()}</Typography>
                </Box>
                <Box sx={{}}>
                  <Typography variant="subtitle2" color="text.secondary">Timestamp</Typography>
                  <Typography variant="body2">
                    {format(new Date(selectedTransaction.timestamp), 'PPpp')}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => openEtherscan(selectedTransaction.hash)} startIcon={<OpenInNew />}>
                View on Etherscan
              </Button>
              <Button onClick={() => setSelectedTransaction(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TransactionHistory;
