import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, CircularProgress, Alert } from '@mui/material';

interface Stake {
  id: string;
  token_symbol: string;
  balance: string;
  totalValue: number;
  estimatedAnnualRewards: number;
  status: string;
  network_gross_apy: number;
  validator_address?: string;
}

interface StakeSummary {
  totalValue: number;
  totalRewards: number;
  activeStakes: number;
  avgAPY: number;
}

interface Account {
  id: string;
  name: string;
  totalAUS: string;
  rewards: string;
  protocols: number;
  createdAt: string;
}

interface Asset {
  symbol: string;
  amount: string;
  value: string;
  apy: string;
}

const AccountOverview: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      // For now, we'll use enhanced mock data based on network stats
      const response = await fetch('http://localhost:3001/api/network-stats');
      const networkData = await response.json();
      
      // Generate realistic account data based on network stats
      const mockAccounts: Account[] = [
        {
          id: '1',
          name: 'Main Staking Account',
          totalAUS: '2,834.56 AUS',
          rewards: `${(Math.random() * 50 + 20).toFixed(2)} ETH`,
          protocols: 3,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Multi-Chain Portfolio',
          totalAUS: '1,567.89 AUS', 
          rewards: `${(Math.random() * 30 + 15).toFixed(2)} SOL`,
          protocols: 4,
          createdAt: '2024-02-20'
        }
      ];

      const mockAssets: Asset[] = [
        { 
          symbol: 'ETH', 
          amount: '32.5', 
          value: `$${(32.5 * (networkData.eth?.data?.eth_price_usd || 2993)).toFixed(2)}`, 
          apy: `${networkData.eth?.data?.network_gross_apy?.toFixed(2) || '3.2'}%` 
        },
        { 
          symbol: 'SOL', 
          amount: '1,250', 
          value: `$${(1250 * (networkData.sol?.data?.sol_price_usd || 162)).toFixed(2)}`, 
          apy: `${networkData.sol?.data?.network_gross_apy?.toFixed(2) || '6.8'}%` 
        },
        { symbol: 'ATOM', amount: '2,100', value: '$31,248.00', apy: '15.2%' },
        { symbol: 'TIA', amount: '890', value: '$15,673.00', apy: '12.5%' }
      ];

      setAccounts(mockAccounts);
      setAssets(mockAssets);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching account data:', err);
      setError('Failed to load account data');
      setLoading(false);
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
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Accounts Summary */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {account.name}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total AUS:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {account.totalAUS}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Rewards:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {account.rewards}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Protocols:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {account.protocols}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Created: {account.createdAt}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Asset Breakdown */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Asset Breakdown
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
        {assets.map((asset) => (
          <Card key={asset.symbol}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {asset.symbol}
                </Typography>
                <Chip 
                  label={asset.apy}
                  size="small"
                  sx={{ 
                    bgcolor: '#E8F5E8', 
                    color: '#2E7D32', 
                    fontWeight: 600 
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {asset.amount} {asset.symbol}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {asset.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default AccountOverview;
