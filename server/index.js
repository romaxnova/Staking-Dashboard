require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const port = process.env.PORT || 3001;

// Cache for 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

app.use(cors());
app.use(express.json());

// Kiln API configuration
const KILN_API_BASE = 'https://api.kiln.fi/v1';
const KILN_API_KEY = process.env.KILN_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

console.log('🔑 API Key loaded:', KILN_API_KEY ? `${KILN_API_KEY.substring(0, 10)}...` : 'NOT FOUND');

const kilnHeaders = {
  'Authorization': `Bearer ${KILN_API_KEY}`,
  'Content-Type': 'application/json'
};

// Helper function to calculate validator badges
function calculateValidatorBadges(validator) {
  const badges = [];
  
  // Mock some data for demonstration - in real implementation, this would come from API
  const uptime = Math.random() * 100; // Random uptime for demo
  const daysSinceSlashing = Math.floor(Math.random() * 365); // Random days since last slashing
  const activeDays = Math.floor(Math.random() * 365); // Random active days
  
  if (uptime > 99 && daysSinceSlashing > 90) {
    badges.push({ type: 'top-performer', label: 'Top Performer', color: 'gold' });
  }
  
  if (daysSinceSlashing > 180) {
    badges.push({ type: 'no-slashing', label: 'No Slashing', color: 'green' });
  }
  
  if (activeDays < 30) {
    badges.push({ type: 'new-entrant', label: 'New Entrant', color: 'blue' });
  }
  
  return badges;
}

// API Routes

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Kiln Dashboard API with Business Intelligence Analytics',
    version: '2.0.0',
    features: [
      '🔍 Multi-account analytics and comparison',
      '📊 Performance benchmarking across clients', 
      '⚖️ Risk-adjusted return calculations',
      '📈 Time-series analysis and trends',
      '🎯 Portfolio optimization insights',
      '⚠️ Real-time compliance screening',
      '🏆 Performance ranking and grading'
    ],
    endpoints: [
      'GET /api/health - Health check',
      'GET /api/test-connection - Test Kiln API connectivity', 
      'GET /api/validators - Validator data with reputation badges',
      'GET /api/network-stats - Network statistics for ETH and SOL',
      'GET /api/validators/:id - Individual validator details',
      'GET /api/compliance/check-address/:address - Address compliance check',
      'POST /api/compliance/bulk-check - Bulk address screening',
      '',
      '🚀 BUSINESS INTELLIGENCE ENDPOINTS:',
      'GET /api/accounts/enhanced - Account selection with portfolio insights',
      'GET /api/stakes?accounts=id1,id2&analytics=advanced - Multi-account stakes analytics',
      'GET /api/rewards?accounts=id1,id2&timeframe=30d&analytics=advanced - Rewards intelligence',
      'GET /api/accounts - Basic organization accounts',
      'GET /api/organization/:orgId/portfolio - Organization portfolio overview'
    ],
    queryParameters: {
      'accounts': 'Comma-separated account IDs for multi-account analysis',
      'timeframe': '7d, 30d, 90d, 1y for time-based analytics',
      'analytics': 'basic, advanced for depth of analysis'
    }
  });
});

// Get all validators with reputation data
app.get('/api/validators', async (req, res) => {
  try {
    const cachedData = cache.get('validators');
    if (cachedData) {
      return res.json(cachedData);
    }

    console.log('Fetching validators from Kiln API...');
    const response = await axios.get(`${KILN_API_BASE}/validators`, {
      headers: kilnHeaders,
      params: {
        limit: 50
      }
    });

    // Handle both data.data and data.validators structure
    const validators = response.data.data?.validators || response.data.data || response.data.validators || response.data;
    
    // Enhance validators with reputation badges and compliance status
    const enhancedValidators = await Promise.all(
      (Array.isArray(validators) ? validators : []).map(async (validator) => {
        const daysSinceSlashing = Math.floor(Math.random() * 365);
        
        // Get validator address for compliance checking
        const validatorAddress = validator.address || validator.public_key || validator.validator_address;
        let complianceStatus = 'UNKNOWN';
        
        if (validatorAddress && validatorAddress.startsWith('0x')) {
          try {
            const sanctionsCheck = await checkOFACSanctions(validatorAddress);
            complianceStatus = sanctionsCheck.isSanctioned ? 'FLAGGED' : 'CLEAR';
          } catch (error) {
            console.error(`Compliance check failed for ${validatorAddress}:`, error.message);
            complianceStatus = 'ERROR';
          }
        }
        
        return {
          ...validator,
          badges: calculateValidatorBadges(validator),
          uptime: (Math.random() * 5 + 95).toFixed(2), // Mock uptime 95-100%
          commission: validator.public_commission_rate_percent || (Math.random() * 10 + 5).toFixed(2), // Use real commission or mock
          apy: (Math.random() * 3 + 4).toFixed(2), // Mock APY 4-7%
          lastSlashing: daysSinceSlashing > 180 ? null : new Date(Date.now() - daysSinceSlashing * 24 * 60 * 60 * 1000).toISOString(),
          complianceStatus,
          validatorAddress
        };
      })
    );

    cache.set('validators', enhancedValidators);
    res.json(enhancedValidators);
  } catch (error) {
    console.error('Error fetching validators:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch validators',
      details: error.response?.data || error.message 
    });
  }
});

// Get network stats
app.get('/api/network-stats', async (req, res) => {
  try {
    const cachedData = cache.get('network-stats');
    if (cachedData) {
      return res.json(cachedData);
    }

    console.log('Fetching network stats from Kiln API...');
    
    // Fetch ETH and SOL network stats
    const [ethResponse, solResponse] = await Promise.allSettled([
      axios.get(`${KILN_API_BASE}/eth/network-stats`, { headers: kilnHeaders }),
      axios.get(`${KILN_API_BASE}/sol/network-stats`, { headers: kilnHeaders })
    ]);

    const networkStats = {
      eth: ethResponse.status === 'fulfilled' ? ethResponse.value.data : null,
      sol: solResponse.status === 'fulfilled' ? solResponse.value.data : null,
      summary: {
        totalValidators: 1247, // Mock data
        totalStaked: '32,156,789 ETH', // Mock data
        avgApy: '5.2%', // Mock data
        networkUptime: '99.8%' // Mock data
      }
    };

    cache.set('network-stats', networkStats);
    res.json(networkStats);
  } catch (error) {
    console.error('Error fetching network stats:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch network stats',
      details: error.response?.data || error.message 
    });
  }
});

// Get validator details
app.get('/api/validators/:validatorId', async (req, res) => {
  try {
    const { validatorId } = req.params;
    const cacheKey = `validator-${validatorId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    console.log(`Fetching validator ${validatorId} details...`);
    const response = await axios.get(`${KILN_API_BASE}/validators/${validatorId}`, {
      headers: kilnHeaders
    });

    const validatorDetails = {
      ...response.data,
      badges: calculateValidatorBadges(response.data),
      performanceHistory: generateMockPerformanceHistory(),
      complianceStatus: 'clear' // Mock compliance status
    };

    cache.set(cacheKey, validatorDetails);
    res.json(validatorDetails);
  } catch (error) {
    console.error('Error fetching validator details:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch validator details',
      details: error.response?.data || error.message 
    });
  }
});

// Get ETH rewards with analytics
app.get('/api/rewards', async (req, res) => {
  try {
    const { accounts: selectedAccounts, timeframe = '30d', analytics = 'basic' } = req.query;
    const cacheKey = `rewards-${selectedAccounts || 'all'}-${timeframe}-${analytics}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    console.log('Fetching account-based rewards analytics...');
    
    // Get accounts to analyze
    const accountsResponse = await axios.get(`${KILN_API_BASE}/accounts`, { headers: kilnHeaders });
    const allAccounts = accountsResponse.data.data || [];
    
    const targetAccounts = selectedAccounts ? 
      allAccounts.filter(acc => selectedAccounts.split(',').includes(acc.id)) : 
      allAccounts.slice(0, 3);
    
    // Calculate date range based on timeframe
    const endDate = new Date();
    const startDate = new Date();
    switch(timeframe) {
      case '7d': startDate.setDate(endDate.getDate() - 7); break;
      case '30d': startDate.setDate(endDate.getDate() - 30); break;
      case '90d': startDate.setDate(endDate.getDate() - 90); break;
      case '1y': startDate.setFullYear(endDate.getFullYear() - 1); break;
      default: startDate.setDate(endDate.getDate() - 30);
    }
    
    // Fetch rewards for each account
    const accountRewards = await Promise.allSettled(
      targetAccounts.map(async (account) => {
        try {
          const rewardsResponse = await axios.get(`${KILN_API_BASE}/eth/rewards`, {
            headers: kilnHeaders,
            params: {
              accounts: [account.id],
              page_size: 100,
              current_page: 1,
              date_from: startDate.toISOString().split('T')[0],
              date_to: endDate.toISOString().split('T')[0]
            }
          });
          
          const rewards = rewardsResponse.data.data || [];
          return {
            account,
            rewards: rewards.map(reward => ({
              ...reward,
              accountId: account.id,
              accountName: account.name,
              rewardValueUsd: reward.consensus_rewards ? 
                (parseFloat(reward.consensus_rewards) + parseFloat(reward.execution_rewards || 0)) / 1e18 * 3500 : 0,
              annualizedReturn: reward.gross_apy || 0,
              frequency: 'Daily',
              date: reward.date || reward.updated_at,
              validatorAddress: reward.validator_address,
              consensusRewards: reward.consensus_rewards ? (parseFloat(reward.consensus_rewards) / 1e18).toFixed(6) : '0',
              executionRewards: reward.execution_rewards ? (parseFloat(reward.execution_rewards) / 1e18).toFixed(6) : '0',
              totalRewardEth: ((parseFloat(reward.consensus_rewards || 0) + parseFloat(reward.execution_rewards || 0)) / 1e18).toFixed(6),
              rewardType: determineRewardType(reward),
              performanceRating: calculateRewardPerformanceRating(reward)
            }))
          };
        } catch (error) {
          console.error(`Error fetching rewards for account ${account.id}:`, error.message);
          return { account, rewards: [], error: error.message };
        }
      })
    );

    const processedAccounts = accountRewards
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    
    const allRewards = processedAccounts.flatMap(acc => acc.rewards);
    
    // Calculate comprehensive rewards analytics
    const rewardsAnalytics = {
      // Basic metrics
      totalRewards: allRewards.reduce((sum, r) => sum + (r.rewardValueUsd || 0), 0),
      totalRewardsEth: allRewards.reduce((sum, r) => sum + parseFloat(r.totalRewardEth || 0), 0),
      totalCount: allRewards.length,
      avgDailyRewards: calculateAvgDailyRewards(allRewards, timeframe),
      
      // Account performance comparison
      accountPerformance: processedAccounts.map(acc => ({
        accountId: acc.account.id,
        accountName: acc.account.name,
        totalRewards: acc.rewards.reduce((sum, r) => sum + parseFloat(r.totalRewardEth || 0), 0),
        avgDailyReward: acc.rewards.reduce((sum, r) => sum + parseFloat(r.totalRewardEth || 0), 0) / getDaysInTimeframe(timeframe),
        rewardCount: acc.rewards.length,
        avgAPY: acc.rewards.reduce((sum, r) => sum + (r.annualizedReturn || 0), 0) / acc.rewards.length || 0,
        performanceGrade: calculateAccountRewardGrade(acc.rewards),
        consistencyScore: calculateRewardConsistency(acc.rewards),
        rewardDistribution: calculateRewardDistribution(acc.rewards)
      })),
      
      // Time-based analytics
      timeSeriesData: generateRewardTimeSeries(allRewards, timeframe),
      seasonalTrends: analyzeSeasonalTrends(allRewards),
      
      // Performance benchmarking
      benchmarks: {
        topPerformingAccount: getTopRewardAccount(processedAccounts),
        industryComparison: generateIndustryBenchmarks(allRewards),
        efficiencyMetrics: calculateRewardEfficiency(processedAccounts),
        growthTrends: calculateGrowthTrends(allRewards, timeframe)
      },
      
      // Risk-adjusted returns
      riskAdjustedMetrics: {
        sharpeRatio: calculateSharpeRatio(allRewards),
        volatility: calculateRewardVolatility(allRewards),
        maxDrawdown: calculateMaxDrawdown(allRewards),
        stabilityScore: calculateStabilityScore(allRewards)
      }
    };

    const result = { 
      accounts: processedAccounts, 
      rewards: allRewards, 
      analytics: rewardsAnalytics,
      metadata: {
        generatedAt: new Date().toISOString(),
        timeframe,
        accountsAnalyzed: targetAccounts.length,
        totalRewardsAnalyzed: allRewards.length,
        dateRange: {
          from: startDate.toISOString().split('T')[0],
          to: endDate.toISOString().split('T')[0]
        }
      }
    };
    
    cache.set(cacheKey, result, 600);
    res.json(result);
  } catch (error) {
    console.error('Error fetching ETH rewards analytics:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch ETH rewards analytics',
      details: error.response?.data || error.message 
    });
  }
});

function calculateRewardFrequency(reward) {
  // Mock frequency calculation - in real implementation would analyze timestamps
  const frequencies = ['Daily', 'Weekly', 'Epoch-based', 'Monthly'];
  return frequencies[Math.floor(Math.random() * frequencies.length)];
}

// Mock performance history generator
function generateMockPerformanceHistory() {
  const history = [];
  const days = 30;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    history.push({
      date: date.toISOString().split('T')[0],
      uptime: Math.random() * 5 + 95, // 95-100%
      rewards: Math.random() * 0.1 + 0.1, // 0.1-0.2 ETH
      attestations: Math.floor(Math.random() * 100 + 200) // 200-300 attestations
    });
  }
  
  return history;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test Kiln API connection
app.get('/api/test-connection', async (req, res) => {
  try {
    console.log('Testing Kiln API connection...');
    const response = await axios.get(`${KILN_API_BASE}/validators`, {
      headers: kilnHeaders,
      params: { limit: 1 }
    });
    
    res.json({ 
      success: true, 
      message: 'Kiln API connection successful',
      sampleData: response.data
    });
  } catch (error) {
    console.error('Kiln API connection test failed:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false,
      error: 'Kiln API connection failed',
      details: error.response?.data || error.message 
    });
  }
});

// Compliance checking with Etherscan and OFAC
app.get('/api/compliance/check-address/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const cacheKey = `compliance-${address}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    console.log(`Checking compliance for address: ${address}`);
    
    // Check Etherscan for basic address info
    const etherscanResponse = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'balance',
        address: address,
        tag: 'latest',
        apikey: ETHERSCAN_API_KEY
      }
    });

    // Basic OFAC sanctions check (simplified - in production use proper OFAC API)
    const sanctionsCheck = await checkOFACSanctions(address);
    
    // Risk scoring based on transaction patterns
    const riskScore = await calculateAddressRiskScore(address);

    const complianceResult = {
      address,
      status: sanctionsCheck.isSanctioned ? 'FLAGGED' : 'CLEAR',
      sanctionsCheck,
      riskScore,
      etherscanData: {
        hasBalance: etherscanResponse.data.result !== '0',
        balance: etherscanResponse.data.result
      },
      lastChecked: new Date().toISOString()
    };

    cache.set(cacheKey, complianceResult, 3600); // Cache for 1 hour
    res.json(complianceResult);
  } catch (error) {
    console.error('Error checking compliance:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to check compliance',
      details: error.response?.data || error.message 
    });
  }
});

// Helper function to check OFAC sanctions (simplified)
async function checkOFACSanctions(address) {
  try {
    // In production, integrate with proper OFAC API or sanctions database
    // For now, we'll simulate with a basic check
    const knownSanctionedAddresses = [
      '0x7f367cc41522ce07553e823bf3be79a889debe1b', // Example sanctioned address
      '0x530a64c0ce595026a4a556b703644228179e2da7'  // Another example
    ];
    
    const isSanctioned = knownSanctionedAddresses.includes(address.toLowerCase());
    
    return {
      isSanctioned,
      source: 'OFAC_SIMULATED',
      details: isSanctioned ? 'Address found in sanctions list' : 'Address not found in sanctions list',
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('OFAC check error:', error);
    return {
      isSanctioned: false,
      source: 'ERROR',
      details: 'Unable to check sanctions status',
      checkedAt: new Date().toISOString()
    };
  }
}

// Helper function to calculate address risk score
async function calculateAddressRiskScore(address) {
  try {
    // Get transaction count
    const txCountResponse = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'proxy',
        action: 'eth_getTransactionCount',
        address: address,
        tag: 'latest',
        apikey: ETHERSCAN_API_KEY
      }
    });

    const txCount = parseInt(txCountResponse.data.result, 16);
    
    // Simple risk scoring algorithm
    let riskScore = 0;
    let riskFactors = [];
    
    // Low transaction count might indicate new/suspicious address
    if (txCount < 10) {
      riskScore += 20;
      riskFactors.push('Low transaction count');
    }
    
    // Very high transaction count might indicate mixing/exchange
    if (txCount > 10000) {
      riskScore += 10;
      riskFactors.push('Very high transaction count');
    }

    // Determine risk level
    let riskLevel = 'LOW';
    if (riskScore >= 30) riskLevel = 'HIGH';
    else if (riskScore >= 15) riskLevel = 'MEDIUM';

    return {
      score: riskScore,
      level: riskLevel,
      factors: riskFactors,
      transactionCount: txCount,
      calculatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Risk scoring error:', error);
    return {
      score: 0,
      level: 'UNKNOWN',
      factors: ['Unable to calculate risk'],
      transactionCount: 0,
      calculatedAt: new Date().toISOString()
    };
  }
}

// Bulk compliance check for multiple addresses
app.post('/api/compliance/bulk-check', async (req, res) => {
  try {
    const { addresses } = req.body;
    
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ error: 'Addresses array is required' });
    }

    const results = await Promise.allSettled(
      addresses.map(async (address) => {
        const cacheKey = `compliance-${address}`;
        const cached = cache.get(cacheKey);
        if (cached) return { address, ...cached };
        
        const sanctionsCheck = await checkOFACSanctions(address);
        const result = {
          address,
          status: sanctionsCheck.isSanctioned ? 'FLAGGED' : 'CLEAR',
          sanctionsCheck,
          lastChecked: new Date().toISOString()
        };
        
        cache.set(cacheKey, result, 3600);
        return result;
      })
    );

    const complianceResults = results.map(result => 
      result.status === 'fulfilled' ? result.value : { 
        address: 'unknown', 
        status: 'ERROR', 
        error: result.reason 
      }
    );

    res.json({ results: complianceResults });
  } catch (error) {
    console.error('Bulk compliance check error:', error);
    res.status(500).json({ 
      error: 'Failed to perform bulk compliance check',
      details: error.message 
    });
  }
});

// Get ETH stakes data with account analytics
app.get('/api/stakes', async (req, res) => {
  try {
    const { accounts: selectedAccounts, analytics = 'basic' } = req.query;
    const cacheKey = `stakes-${selectedAccounts || 'all'}-${analytics}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    console.log('Fetching account-based stakes analytics...');
    
    // First get all accounts to work with
    const accountsResponse = await axios.get(`${KILN_API_BASE}/accounts`, { headers: kilnHeaders });
    const allAccounts = accountsResponse.data.data || [];
    
    // Filter accounts if specific ones requested
    const targetAccounts = selectedAccounts ? 
      allAccounts.filter(acc => selectedAccounts.split(',').includes(acc.id)) : 
      allAccounts.slice(0, 3); // Default to first 3 accounts
    
    // Fetch stakes for each account
    const accountStakes = await Promise.allSettled(
      targetAccounts.map(async (account) => {
        try {
          const stakesResponse = await axios.get(`${KILN_API_BASE}/eth/stakes`, {
            headers: kilnHeaders,
            params: {
              accounts: [account.id],
              page_size: 100,
              current_page: 1
            }
          });
          
          const stakes = stakesResponse.data.data || [];
          return {
            account,
            stakes: stakes.map(stake => ({
              ...stake,
              accountId: account.id,
              accountName: account.name,
              totalValueEth: stake.balance ? (parseFloat(stake.balance) / 1e18).toFixed(4) : '0',
              totalValueUsd: stake.balance ? (parseFloat(stake.balance) / 1e18 * 3500).toFixed(2) : '0',
              estimatedAnnualRewards: stake.gross_apy ? `${stake.gross_apy.toFixed(2)}%` : '5.0%',
              status: stake.state || 'unknown',
              consensusRewards: stake.consensus_rewards ? (parseFloat(stake.consensus_rewards) / 1e18).toFixed(6) : '0',
              executionRewards: stake.execution_rewards ? (parseFloat(stake.execution_rewards) / 1e18).toFixed(6) : '0',
              totalRewards: stake.rewards ? (parseFloat(stake.rewards) / 1e18).toFixed(6) : '0',
              validatorIndex: stake.validator_index,
              activatedAt: stake.activated_at,
              delegatedAt: stake.delegated_at,
              riskScore: calculateStakeRiskScore(stake),
              performanceGrade: calculatePerformanceGrade(stake)
            }))
          };
        } catch (error) {
          console.error(`Error fetching stakes for account ${account.id}:`, error.message);
          return { account, stakes: [], error: error.message };
        }
      })
    );

    // Process results and calculate analytics
    const processedAccounts = accountStakes
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    
    const allStakes = processedAccounts.flatMap(acc => acc.stakes);
    
    // Calculate comprehensive analytics
    const analytics_data = {
      // Basic metrics
      totalStakes: allStakes.length,
      totalStakedEth: allStakes.reduce((sum, s) => sum + parseFloat(s.totalValueEth || 0), 0),
      totalStakedUsd: allStakes.reduce((sum, s) => sum + parseFloat(s.totalValueUsd || 0), 0),
      totalRewardsEth: allStakes.reduce((sum, s) => sum + parseFloat(s.totalRewards || 0), 0),
      avgApy: allStakes.reduce((sum, s) => {
        const apy = parseFloat(s.estimatedAnnualRewards?.replace('%', '') || 0);
        return sum + apy;
      }, 0) / allStakes.length || 0,
      activeStakes: allStakes.filter(s => s.status === 'active_ongoing').length,
      
      // Account-level analytics
      accountBreakdown: processedAccounts.map(acc => ({
        accountId: acc.account.id,
        accountName: acc.account.name,
        stakesCount: acc.stakes.length,
        totalValue: acc.stakes.reduce((sum, s) => sum + parseFloat(s.totalValueEth || 0), 0),
        totalRewards: acc.stakes.reduce((sum, s) => sum + parseFloat(s.totalRewards || 0), 0),
        avgPerformanceGrade: acc.stakes.reduce((sum, s) => sum + s.performanceGrade, 0) / acc.stakes.length || 0,
        riskDistribution: calculateRiskDistribution(acc.stakes),
        statusDistribution: calculateStatusDistribution(acc.stakes)
      })),
      
      // Performance benchmarking
      performanceBenchmarks: {
        topPerformingAccount: getTopPerformingAccount(processedAccounts),
        avgRewardsByAccount: processedAccounts.map(acc => ({
          account: acc.account.name,
          avgRewards: acc.stakes.reduce((sum, s) => sum + parseFloat(s.totalRewards || 0), 0) / acc.stakes.length || 0
        })),
        riskVsRewardMatrix: calculateRiskVsRewardMatrix(processedAccounts)
      },
      
      // Time-based analytics
      stakingTimeline: calculateStakingTimeline(allStakes),
      
      // Risk assessment
      portfolioRisk: {
        overallRiskScore: calculateOverallRiskScore(allStakes),
        riskFactors: identifyRiskFactors(allStakes),
        diversificationScore: calculateDiversificationScore(processedAccounts)
      }
    };

    const result = { 
      accounts: processedAccounts, 
      stakes: allStakes, 
      analytics: analytics_data,
      metadata: {
        generatedAt: new Date().toISOString(),
        accountsAnalyzed: targetAccounts.length,
        totalStakesAnalyzed: allStakes.length
      }
    };
    
    cache.set(cacheKey, result, 600); // Cache for 10 minutes
    res.json(result);
  } catch (error) {
    console.error('Error fetching ETH stakes analytics:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch ETH stakes analytics',
      details: error.response?.data || error.message 
    });
  }
});

// Get organization accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const cachedData = cache.get('accounts');
    if (cachedData) {
      return res.json(cachedData);
    }

    console.log('Fetching accounts from Kiln API...');
    const response = await axios.get(`${KILN_API_BASE}/accounts`, {
      headers: kilnHeaders
    });

    const accounts = response.data.data || response.data || [];
    cache.set('accounts', accounts);
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch accounts',
      details: error.response?.data || error.message 
    });
  }
});

// Get organization portfolio (requires organization ID)
app.get('/api/organization/:orgId/portfolio', async (req, res) => {
  try {
    const { orgId } = req.params;
    const cacheKey = `portfolio-${orgId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    console.log(`Fetching portfolio for organization ${orgId}...`);
    const response = await axios.get(`${KILN_API_BASE}/organizations/${orgId}/portfolio`, {
      headers: kilnHeaders,
      params: {
        refresh: 0 // Use cached data unless user specifically requests refresh
      }
    });

    const portfolio = response.data.data || response.data;
    cache.set(cacheKey, portfolio);
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching organization portfolio:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch organization portfolio',
      details: error.response?.data || error.message 
    });
  }
});

// Get enhanced accounts list with portfolio summary for selection
app.get('/api/accounts/enhanced', async (req, res) => {
  try {
    const cachedData = cache.get('accounts-enhanced');
    if (cachedData) {
      return res.json(cachedData);
    }

    console.log('Fetching enhanced accounts data...');
    const accountsResponse = await axios.get(`${KILN_API_BASE}/accounts`, { headers: kilnHeaders });
    const accounts = accountsResponse.data.data || [];

    // Enhance each account with portfolio summary
    const enhancedAccounts = await Promise.allSettled(
      accounts.map(async (account) => {
        try {
          // Get stakes for this account
          const stakesResponse = await axios.get(`${KILN_API_BASE}/eth/stakes`, {
            headers: kilnHeaders,
            params: { accounts: [account.id], page_size: 100 }
          });
          
          const stakes = stakesResponse.data.data || [];
          
          // Get recent rewards for this account
          const rewardsResponse = await axios.get(`${KILN_API_BASE}/eth/rewards`, {
            headers: kilnHeaders,
            params: { 
              accounts: [account.id], 
              page_size: 50,
              date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
          });
          
          const rewards = rewardsResponse.data.data || [];
          
          // Calculate portfolio metrics
          const totalStaked = stakes.reduce((sum, stake) => {
            return sum + (stake.balance ? parseFloat(stake.balance) / 1e18 : 0);
          }, 0);
          
          const totalRewards = rewards.reduce((sum, reward) => {
            const consensus = parseFloat(reward.consensus_rewards || 0) / 1e18;
            const execution = parseFloat(reward.execution_rewards || 0) / 1e18;
            return sum + consensus + execution;
          }, 0);
          
          const activeStakes = stakes.filter(stake => stake.state === 'active_ongoing').length;
          const avgApy = stakes.reduce((sum, stake) => sum + (stake.gross_apy || 0), 0) / stakes.length || 0;
          
          // Risk assessment
          const riskFactors = stakes.map(stake => calculateStakeRiskScore(stake));
          const avgRiskScore = riskFactors.reduce((sum, risk) => sum + risk.score, 0) / riskFactors.length || 0;
          
          return {
            ...account,
            portfolio: {
              totalStakes: stakes.length,
              activeStakes,
              totalStakedEth: totalStaked,
              totalStakedUsd: totalStaked * 3500, // Mock ETH price
              totalRewardsEth: totalRewards,
              totalRewardsUsd: totalRewards * 3500,
              avgApy: avgApy,
              avgRiskScore: avgRiskScore,
              riskLevel: avgRiskScore < 20 ? 'LOW' : avgRiskScore < 50 ? 'MEDIUM' : 'HIGH',
              last30dRewards: rewards.length,
              performanceGrade: calculateAccountOverallGrade(stakes, rewards),
              diversificationScore: calculateAccountDiversification(stakes)
            },
            isSelected: false // For frontend selection state
          };
        } catch (error) {
          console.error(`Error fetching portfolio for account ${account.id}:`, error.message);
          return {
            ...account,
            portfolio: null,
            error: error.message,
            isSelected: false
          };
        }
      })
    );

    const processedAccounts = enhancedAccounts
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)
      .sort((a, b) => (b.portfolio?.totalStakedEth || 0) - (a.portfolio?.totalStakedEth || 0));

    // Calculate aggregate analytics for account selection insights
    const aggregateAnalytics = {
      totalAccounts: processedAccounts.length,
      totalAUM: processedAccounts.reduce((sum, acc) => sum + (acc.portfolio?.totalStakedEth || 0), 0),
      avgPortfolioSize: processedAccounts.reduce((sum, acc) => sum + (acc.portfolio?.totalStakedEth || 0), 0) / processedAccounts.length || 0,
      topPerformers: processedAccounts
        .filter(acc => acc.portfolio?.performanceGrade > 80)
        .slice(0, 5),
      riskDistribution: {
        low: processedAccounts.filter(acc => acc.portfolio?.riskLevel === 'LOW').length,
        medium: processedAccounts.filter(acc => acc.portfolio?.riskLevel === 'MEDIUM').length,
        high: processedAccounts.filter(acc => acc.portfolio?.riskLevel === 'HIGH').length
      },
      recommendedForAnalysis: processedAccounts
        .filter(acc => acc.portfolio && acc.portfolio.totalStakes > 5)
        .slice(0, 10)
        .map(acc => acc.id)
    };

    const result = {
      accounts: processedAccounts,
      analytics: aggregateAnalytics,
      metadata: {
        generatedAt: new Date().toISOString(),
        dataFreshness: 'real-time'
      }
    };

    cache.set('accounts-enhanced', result, 300); // Cache for 5 minutes
    res.json(result);
  } catch (error) {
    console.error('Error fetching enhanced accounts:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch enhanced accounts data',
      details: error.response?.data || error.message 
    });
  }
});

function calculateAccountOverallGrade(stakes, rewards) {
  if (stakes.length === 0) return 0;
  
  // Stake performance (60% weight)
  const avgStakeGrade = stakes.reduce((sum, stake) => {
    return sum + calculatePerformanceGrade(stake);
  }, 0) / stakes.length;
  
  // Rewards consistency (25% weight)
  const rewardsConsistency = calculateRewardConsistency(rewards.map(r => ({
    totalRewardEth: ((parseFloat(r.consensus_rewards || 0) + parseFloat(r.execution_rewards || 0)) / 1e18).toString()
  })));
  
  // Risk management (15% weight)
  const riskScores = stakes.map(stake => calculateStakeRiskScore(stake));
  const avgRisk = riskScores.reduce((sum, risk) => sum + risk.score, 0) / riskScores.length || 0;
  const riskGrade = Math.max(0, 100 - avgRisk); // Lower risk = higher grade
  
  const overallGrade = (avgStakeGrade * 0.6) + (rewardsConsistency * 0.25) + (riskGrade * 0.15);
  return Math.round(overallGrade);
}

function calculateAccountDiversification(stakes) {
  if (stakes.length <= 1) return 0;
  
  // Check distribution across different validators
  const validatorAddresses = [...new Set(stakes.map(stake => stake.validator_address))];
  const validatorDiversification = (validatorAddresses.length / stakes.length) * 100;
  
  // Check distribution across different activation times
  const activationMonths = [...new Set(stakes.map(stake => {
    if (stake.activated_at) {
      return stake.activated_at.substring(0, 7); // YYYY-MM
    }
    return 'unknown';
  }).filter(month => month !== 'unknown'))];
  
  const temporalDiversification = Math.min(100, (activationMonths.length / 12) * 100); // Max 12 months
  
  // Check balance distribution (Gini coefficient approximation)
  const balances = stakes.map(stake => parseFloat(stake.balance || 0)).sort((a, b) => a - b);
  const totalBalance = balances.reduce((sum, balance) => sum + balance, 0);
  
  let giniSum = 0;
  balances.forEach((balance, index) => {
    giniSum += (2 * (index + 1) - stakes.length - 1) * balance;
  });
  
  const giniCoefficient = totalBalance > 0 ? giniSum / (stakes.length * totalBalance) : 0;
  const balanceDiversification = (1 - Math.abs(giniCoefficient)) * 100;
  
  // Combined diversification score
  const diversificationScore = (validatorDiversification * 0.4) + 
                              (temporalDiversification * 0.3) + 
                              (balanceDiversification * 0.3);
  
  return Math.round(diversificationScore);
}

// Business Intelligence Analytics Helper Functions

function calculateStakeRiskScore(stake) {
  let riskScore = 0;
  const riskFactors = [];
  
  // Time-based risk
  if (stake.activated_at) {
    const activatedDate = new Date(stake.activated_at);
    const daysSinceActivation = (Date.now() - activatedDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActivation < 30) {
      riskScore += 20;
      riskFactors.push('Recently activated validator');
    }
  }
  
  // Performance-based risk
  if (stake.state === 'active_slashed') {
    riskScore += 50;
    riskFactors.push('Validator has been slashed');
  }
  
  if (stake.state === 'active_exiting') {
    riskScore += 30;
    riskFactors.push('Validator is exiting');
  }
  
  // Balance-based risk
  const balanceEth = stake.balance ? parseFloat(stake.balance) / 1e18 : 0;
  if (balanceEth > 100) {
    riskScore += 10;
    riskFactors.push('High value stake');
  }
  
  return {
    score: Math.min(riskScore, 100),
    level: riskScore < 20 ? 'LOW' : riskScore < 50 ? 'MEDIUM' : 'HIGH',
    factors: riskFactors
  };
}

function calculatePerformanceGrade(stake) {
  let score = 100;
  
  // Deduct points for issues
  if (stake.state === 'active_slashed') score -= 40;
  if (stake.state === 'active_exiting') score -= 20;
  if (stake.state !== 'active_ongoing') score -= 10;
  
  // Adjust based on rewards performance
  const rewardsEth = stake.rewards ? parseFloat(stake.rewards) / 1e18 : 0;
  const balanceEth = stake.balance ? parseFloat(stake.balance) / 1e18 : 32;
  const rewardRatio = rewardsEth / balanceEth;
  
  if (rewardRatio > 0.1) score += 10; // Bonus for good rewards
  else if (rewardRatio < 0.02) score -= 15; // Penalty for low rewards
  
  return Math.max(0, Math.min(100, score));
}

function calculateRiskDistribution(stakes) {
  const distribution = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  stakes.forEach(stake => {
    if (stake.riskScore) {
      distribution[stake.riskScore.level]++;
    }
  });
  return distribution;
}

function calculateStatusDistribution(stakes) {
  const distribution = {};
  stakes.forEach(stake => {
    const status = stake.status || 'unknown';
    distribution[status] = (distribution[status] || 0) + 1;
  });
  return distribution;
}

function getTopPerformingAccount(processedAccounts) {
  if (processedAccounts.length === 0) return null;
  
  return processedAccounts.reduce((top, current) => {
    const currentAvgRewards = current.stakes.reduce((sum, s) => sum + parseFloat(s.totalRewards || 0), 0) / current.stakes.length;
    const topAvgRewards = top.stakes.reduce((sum, s) => sum + parseFloat(s.totalRewards || 0), 0) / top.stakes.length;
    
    return currentAvgRewards > topAvgRewards ? current : top;
  });
}

function calculateRiskVsRewardMatrix(processedAccounts) {
  return processedAccounts.map(acc => {
    const avgRewards = acc.stakes.reduce((sum, s) => sum + parseFloat(s.totalRewards || 0), 0) / acc.stakes.length || 0;
    const avgRisk = acc.stakes.reduce((sum, s) => sum + (s.riskScore?.score || 0), 0) / acc.stakes.length || 0;
    
    return {
      accountName: acc.account.name,
      accountId: acc.account.id,
      avgRewards,
      avgRisk,
      riskAdjustedReturn: avgRisk > 0 ? (avgRewards / avgRisk * 100) : avgRewards,
      efficiency: calculateStakingEfficiency(acc.stakes)
    };
  });
}

function calculateStakingTimeline(stakes) {
  const timeline = {};
  
  stakes.forEach(stake => {
    if (stake.activated_at) {
      const month = stake.activated_at.substring(0, 7); // YYYY-MM
      timeline[month] = (timeline[month] || 0) + 1;
    }
  });
  
  return Object.entries(timeline)
    .map(([month, count]) => ({ month, stakesActivated: count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function calculateOverallRiskScore(stakes) {
  if (stakes.length === 0) return 0;
  
  const totalRisk = stakes.reduce((sum, stake) => sum + (stake.riskScore?.score || 0), 0);
  return Math.round(totalRisk / stakes.length);
}

function identifyRiskFactors(stakes) {
  const allFactors = stakes.flatMap(stake => stake.riskScore?.factors || []);
  const factorCounts = {};
  
  allFactors.forEach(factor => {
    factorCounts[factor] = (factorCounts[factor] || 0) + 1;
  });
  
  return Object.entries(factorCounts)
    .map(([factor, count]) => ({ factor, occurrences: count, percentage: (count / stakes.length * 100).toFixed(1) }))
    .sort((a, b) => b.count - a.count);
}

function calculateDiversificationScore(processedAccounts) {
  if (processedAccounts.length <= 1) return 0;
  
  // Calculate how evenly distributed stakes are across accounts
  const stakeCounts = processedAccounts.map(acc => acc.stakes.length);
  const totalStakes = stakeCounts.reduce((sum, count) => sum + count, 0);
  const avgStakes = totalStakes / processedAccounts.length;
  
  // Calculate variance - lower variance = better diversification
  const variance = stakeCounts.reduce((sum, count) => sum + Math.pow(count - avgStakes, 2), 0) / processedAccounts.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Convert to a 0-100 score where 100 is perfectly diversified
  const diversificationScore = Math.max(0, 100 - (standardDeviation / avgStakes * 100));
  
  return Math.round(diversificationScore);
}

function calculateStakingEfficiency(stakes) {
  if (stakes.length === 0) return 0;
  
  const totalRewards = stakes.reduce((sum, s) => sum + parseFloat(s.totalRewards || 0), 0);
  const totalStaked = stakes.reduce((sum, s) => sum + parseFloat(s.totalValueEth || 0), 0);
  const avgRisk = stakes.reduce((sum, s) => sum + (s.riskScore?.score || 0), 0) / stakes.length;
  
  // Efficiency = (rewards per ETH staked) / (risk factor)
  const rawEfficiency = totalStaked > 0 ? totalRewards / totalStaked : 0;
  const riskAdjustedEfficiency = avgRisk > 0 ? rawEfficiency / (avgRisk / 100) : rawEfficiency;
  
  return Math.round(riskAdjustedEfficiency * 10000) / 100; // Convert to percentage
}

// Rewards Analytics Helper Functions

function determineRewardType(reward) {
  const consensusRewards = parseFloat(reward.consensus_rewards || 0);
  const executionRewards = parseFloat(reward.execution_rewards || 0);
  
  if (consensusRewards > 0 && executionRewards > 0) return 'MIXED';
  if (consensusRewards > 0) return 'CONSENSUS';
  if (executionRewards > 0) return 'EXECUTION';
  return 'NONE';
}

function calculateRewardPerformanceRating(reward) {
  const totalReward = (parseFloat(reward.consensus_rewards || 0) + parseFloat(reward.execution_rewards || 0)) / 1e18;
  const apy = reward.gross_apy || 0;
  
  let rating = 50; // Base rating
  
  // Adjust based on reward amount
  if (totalReward > 0.1) rating += 20;
  else if (totalReward > 0.05) rating += 10;
  else if (totalReward < 0.01) rating -= 15;
  
  // Adjust based on APY
  if (apy > 6) rating += 15;
  else if (apy > 4) rating += 5;
  else if (apy < 3) rating -= 10;
  
  return Math.max(0, Math.min(100, rating));
}

function calculateAvgDailyRewards(rewards, timeframe) {
  const totalRewards = rewards.reduce((sum, r) => sum + parseFloat(r.totalRewardEth || 0), 0);
  const days = getDaysInTimeframe(timeframe);
  return days > 0 ? totalRewards / days : 0;
}

function getDaysInTimeframe(timeframe) {
  switch(timeframe) {
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case '1y': return 365;
    default: return 30;
  }
}

function calculateAccountRewardGrade(rewards) {
  if (rewards.length === 0) return 0;
  
  const avgPerformance = rewards.reduce((sum, r) => sum + r.performanceRating, 0) / rewards.length;
  const consistency = calculateRewardConsistency(rewards);
  
  // Combine performance and consistency for overall grade
  return Math.round((avgPerformance * 0.7) + (consistency * 0.3));
}

function calculateRewardConsistency(rewards) {
  if (rewards.length < 2) return 100;
  
  const rewardAmounts = rewards.map(r => parseFloat(r.totalRewardEth || 0));
  const mean = rewardAmounts.reduce((sum, amount) => sum + amount, 0) / rewardAmounts.length;
  const variance = rewardAmounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / rewardAmounts.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Lower coefficient of variation = higher consistency
  const coefficientOfVariation = mean > 0 ? standardDeviation / mean : 1;
  const consistencyScore = Math.max(0, 100 - (coefficientOfVariation * 100));
  
  return Math.round(consistencyScore);
}

function calculateRewardDistribution(rewards) {
  const distribution = { CONSENSUS: 0, EXECUTION: 0, MIXED: 0, NONE: 0 };
  rewards.forEach(reward => {
    distribution[reward.rewardType]++;
  });
  return distribution;
}

function generateRewardTimeSeries(rewards, timeframe) {
  const timeSeries = {};
  const interval = timeframe === '7d' || timeframe === '30d' ? 'daily' : 'weekly';
  
  rewards.forEach(reward => {
    if (reward.date) {
      const key = interval === 'daily' 
        ? reward.date.split('T')[0] 
        : getWeekKey(new Date(reward.date));
      
      if (!timeSeries[key]) {
        timeSeries[key] = {
          date: key,
          totalRewards: 0,
          count: 0,
          consensusRewards: 0,
          executionRewards: 0
        };
      }
      
      timeSeries[key].totalRewards += parseFloat(reward.totalRewardEth || 0);
      timeSeries[key].count++;
      timeSeries[key].consensusRewards += parseFloat(reward.consensusRewards || 0);
      timeSeries[key].executionRewards += parseFloat(reward.executionRewards || 0);
    }
  });
  
  return Object.values(timeSeries).sort((a, b) => a.date.localeCompare(b.date));
}

function getWeekKey(date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  return startOfWeek.toISOString().split('T')[0];
}

function analyzeSeasonalTrends(rewards) {
  const monthlyData = {};
  
  rewards.forEach(reward => {
    if (reward.date) {
      const month = new Date(reward.date).getMonth();
      if (!monthlyData[month]) {
        monthlyData[month] = { totalRewards: 0, count: 0 };
      }
      monthlyData[month].totalRewards += parseFloat(reward.totalRewardEth || 0);
      monthlyData[month].count++;
    }
  });
  
  return Object.entries(monthlyData).map(([month, data]) => ({
    month: parseInt(month),
    monthName: new Date(2024, month, 1).toLocaleString('default', { month: 'long' }),
    avgRewards: data.count > 0 ? data.totalRewards / data.count : 0,
    totalRewards: data.totalRewards
  }));
}

function getTopRewardAccount(processedAccounts) {
  if (processedAccounts.length === 0) return null;
  
  return processedAccounts.reduce((top, current) => {
    const currentTotal = current.rewards.reduce((sum, r) => sum + parseFloat(r.totalRewardEth || 0), 0);
    const topTotal = top.rewards.reduce((sum, r) => sum + parseFloat(r.totalRewardEth || 0), 0);
    
    return currentTotal > topTotal ? current : top;
  });
}

function generateIndustryBenchmarks(rewards) {
  const totalRewards = rewards.reduce((sum, r) => sum + parseFloat(r.totalRewardEth || 0), 0);
  const avgReward = rewards.length > 0 ? totalRewards / rewards.length : 0;
  
  return {
    industry_avg_daily_reward: 0.015, // Mock industry average
    your_avg_daily_reward: avgReward,
    performance_vs_industry: avgReward > 0.015 ? 'ABOVE' : avgReward > 0.010 ? 'AVERAGE' : 'BELOW',
    percentile_ranking: calculatePercentileRanking(avgReward)
  };
}

function calculatePercentileRanking(avgReward) {
  // Mock percentile calculation based on industry data
  if (avgReward > 0.020) return 90;
  if (avgReward > 0.018) return 75;
  if (avgReward > 0.015) return 50;
  if (avgReward > 0.012) return 25;
  return 10;
}

function calculateRewardEfficiency(processedAccounts) {
  return processedAccounts.map(acc => {
    const totalRewards = acc.rewards.reduce((sum, r) => sum + parseFloat(r.totalRewardEth || 0), 0);
    const rewardCount = acc.rewards.length;
    const avgReward = rewardCount > 0 ? totalRewards / rewardCount : 0;
    
    return {
      accountName: acc.account.name,
      rewardEfficiency: avgReward,
      consistencyScore: calculateRewardConsistency(acc.rewards),
      overallEfficiency: avgReward * calculateRewardConsistency(acc.rewards) / 100
    };
  });
}

function calculateGrowthTrends(rewards, timeframe) {
  const sortedRewards = rewards.sort((a, b) => 
    new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
  );
  
  if (sortedRewards.length < 2) return { trend: 'INSUFFICIENT_DATA', growthRate: 0 };
  
  const firstHalf = sortedRewards.slice(0, Math.floor(sortedRewards.length / 2));
  const secondHalf = sortedRewards.slice(Math.floor(sortedRewards.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, r) => sum + parseFloat(r.totalRewardEth || 0), 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, r) => sum + parseFloat(r.totalRewardEth || 0), 0) / secondHalf.length;
  
  const growthRate = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100) : 0;
  
  return {
    trend: growthRate > 5 ? 'INCREASING' : growthRate < -5 ? 'DECREASING' : 'STABLE',
    growthRate: Math.round(growthRate * 100) / 100,
    firstPeriodAvg: firstHalfAvg,
    secondPeriodAvg: secondHalfAvg
  };
}

function calculateSharpeRatio(rewards) {
  if (rewards.length < 2) return 0;
  
  const returns = rewards.map(r => parseFloat(r.totalRewardEth || 0));
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);
  
  // Assuming risk-free rate of 0.02% daily (rough equivalent of 7% annually)
  const riskFreeRate = 0.0002;
  
  return volatility > 0 ? (avgReturn - riskFreeRate) / volatility : 0;
}

function calculateRewardVolatility(rewards) {
  if (rewards.length < 2) return 0;
  
  const returns = rewards.map(r => parseFloat(r.totalRewardEth || 0));
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  
  return Math.sqrt(variance);
}

function calculateMaxDrawdown(rewards) {
  if (rewards.length < 2) return 0;
  
  const sortedRewards = rewards.sort((a, b) => 
    new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
  );
  
  let peak = 0;
  let maxDrawdown = 0;
  let runningTotal = 0;
  
  sortedRewards.forEach(reward => {
    runningTotal += parseFloat(reward.totalRewardEth || 0);
    if (runningTotal > peak) {
      peak = runningTotal;
    }
    const drawdown = peak > 0 ? (peak - runningTotal) / peak : 0;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  return maxDrawdown * 100; // Return as percentage
}

function calculateStabilityScore(rewards) {
  const consistency = calculateRewardConsistency(rewards);
  const volatility = calculateRewardVolatility(rewards);
  const avgReward = rewards.reduce((sum, r) => sum + parseFloat(r.totalRewardEth || 0), 0) / rewards.length;
  
  // Higher consistency and lower volatility relative to average = higher stability
  const volatilityScore = avgReward > 0 ? Math.max(0, 100 - (volatility / avgReward * 100)) : 0;
  const stabilityScore = (consistency * 0.6) + (volatilityScore * 0.4);
  
  return Math.round(stabilityScore);
}

// Start the server
app.listen(port, () => {
  console.log(`🚀 Kiln Dashboard API server running on port ${port}`);
  console.log(`📊 API Documentation: http://localhost:${port}/`);
  console.log(`🔧 Health Check: http://localhost:${port}/api/health`);
  console.log(`🧪 Test Connection: http://localhost:${port}/api/test-connection`);
  console.log('📈 Business Intelligence Features Enabled');
});

// Get real Ethereum transactions for Explorer
app.get('/api/explorer/transactions', async (req, res) => {
  try {
    const { limit = 10, network = 'mainnet' } = req.query;
    
    const cacheKey = `explorer_transactions_${network}_${limit}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    console.log('Fetching latest transactions from Etherscan...');
    
    if (!ETHERSCAN_API_KEY) {
      console.log('Etherscan API key not found, generating mock data');
      // Generate mock transactions as fallback
      const mockTransactions = generateMockTransactionsForExplorer(parseInt(limit));
      res.json({ transactions: mockTransactions, source: 'mock' });
      return;
    }

    // Get latest block number
    const blockResponse = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'proxy',
        action: 'eth_blockNumber',
        apikey: ETHERSCAN_API_KEY
      }
    });

    const latestBlockHex = blockResponse.data.result;
    const latestBlock = parseInt(latestBlockHex, 16);
    
    // Get block details for the latest block
    const blockDetails = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'proxy',
        action: 'eth_getBlockByNumber',
        tag: latestBlockHex,
        boolean: true,
        apikey: ETHERSCAN_API_KEY
      }
    });

    let transactions = [];
    if (blockDetails.data.result && blockDetails.data.result.transactions) {
      // Get first few transactions from the latest block
      const blockTxs = blockDetails.data.result.transactions.slice(0, parseInt(limit));
      
      // Transform to our format
      transactions = blockTxs.map(tx => ({
        hash: tx.hash,
        type: parseFloat(tx.value) > 31 ? 'dedicated' : 'pooled', // Heuristic: >31 ETH likely dedicated
        amount: `${(parseInt(tx.value, 16) / 1e18).toFixed(4)} ETH`,
        amountUsd: `$${((parseInt(tx.value, 16) / 1e18) * 3500).toLocaleString()}`, // Mock ETH price
        timestamp: new Date(parseInt(blockDetails.data.result.timestamp, 16) * 1000).toISOString(),
        from: tx.from,
        to: tx.to,
        integrator: getIntegratorFromAddress(tx.to), // Heuristic based on to address
        status: 'confirmed',
        blockNumber: parseInt(blockDetails.data.result.number, 16),
        gasUsed: parseInt(tx.gas, 16)
      }));
    } else {
      // Fallback to mock data if API fails
      transactions = generateMockTransactionsForExplorer(parseInt(limit));
    }

    const result = { transactions, source: 'etherscan', block: latestBlock };
    cache.set(cacheKey, result, 60); // Cache for 1 minute due to real-time nature
    
    console.log(`✅ Fetched ${transactions.length} transactions from block ${latestBlock}`);
    res.json(result);
    
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    
    // Fallback to mock data
    const mockTransactions = generateMockTransactionsForExplorer(parseInt(req.query.limit || 10));
    res.json({ 
      transactions: mockTransactions, 
      source: 'mock_fallback',
      error: 'Etherscan API unavailable'
    });
  }
});

// Helper function to determine integrator from address
function getIntegratorFromAddress(address) {
  if (!address) return 'Unknown';
  
  // Known addresses for major staking providers (these would be maintained in a real system)
  const knownAddresses = {
    '0x00000000219ab540356cbb839cbe05303d7705fa': 'Ethereum 2.0 Deposit Contract',
    '0x4e5b2e1dc63f6b91cb6cd759936495434c7e972f': 'Rocket Pool',
    '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': 'Lido',
    '0xa4c8d221d8bb851f83aadd0223a8900a6921a349': 'Coinbase',
    '0x3cd751e6b0078be393132286c442345e5dc49699': 'Binance',
    '0x8103151e2377e78c04a3d2564e20542680ed3096': 'Kraken'
  };
  
  const lowerAddress = address.toLowerCase();
  for (const [addr, integrator] of Object.entries(knownAddresses)) {
    if (lowerAddress === addr.toLowerCase()) {
      return integrator;
    }
  }
  
  // If not a known address, categorize by patterns or return generic names
  const integrators = ['Validator', 'Staker', 'Pool', 'Institution', 'Individual'];
  return integrators[parseInt(address.slice(-1), 16) % integrators.length];
}

// Generate mock transactions for fallback
function generateMockTransactionsForExplorer(limit) {
  const integrators = ['Lido', 'Coinbase', 'Binance', 'Kraken', 'Rocket Pool', 'Stakewise', 'Ethereum 2.0'];
  const types = ['dedicated', 'pooled'];
  
  return Array.from({ length: limit }, (_, index) => ({
    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    type: types[Math.floor(Math.random() * types.length)],
    amount: `${(Math.random() * 100 + 32).toFixed(4)} ETH`,
    amountUsd: `$${((Math.random() * 100 + 32) * 3500).toLocaleString()}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    from: `0x${Math.random().toString(16).substr(2, 40)}`,
    to: `0x${Math.random().toString(16).substr(2, 40)}`,
    integrator: integrators[Math.floor(Math.random() * integrators.length)],
    status: 'confirmed',
    blockNumber: 18800000 + Math.floor(Math.random() * 1000),
    gasUsed: Math.floor(Math.random() * 100000) + 21000
  }));
}
