import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Tabs, Tab } from '@mui/material';
import AccountOverview from './AccountOverview';
import NetworkStatsCards from './NetworkStatsCards';
import ValidatorTable from './ValidatorTable';
import TransactionHistory from './TransactionHistory';
import ValidatorRankings from './ValidatorRankings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
}

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Kiln Dashboard
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Account Overview Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Account Overview
          </Typography>
          <AccountOverview />
        </Paper>

        {/* Network Stats Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Network Statistics
          </Typography>
          <NetworkStatsCards />
        </Paper>

        {/* Tabbed Content Section */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
              <Tab label="🏆 Validators & Watchlist" {...a11yProps(0)} />
              <Tab label="📊 Rankings & Leaderboard" {...a11yProps(1)} />
              <Tab label="📋 Transaction History" {...a11yProps(2)} />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Validators & Watchlist
            </Typography>
            <ValidatorTable />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Validator Rankings & Leaderboard
            </Typography>
            <ValidatorRankings />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Transaction History
            </Typography>
            <TransactionHistory />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
