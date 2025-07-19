import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box } from '@mui/material';

import { enhancedTheme } from './theme/enhancedTheme';
import { AppProvider } from './context/AppContext';
import EnhancedNavigation from './components/EnhancedNavigation';
import EnhancedDashboard from './components/EnhancedDashboard';

const TestApp: React.FC = () => {
  return (
    <ThemeProvider theme={enhancedTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AppProvider>
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <EnhancedNavigation />
            <Container maxWidth="xl" sx={{ py: 3 }}>
              <Typography variant="h4" gutterBottom>
                Testing Functionality
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Open browser console to see interaction logs. Test all buttons and interactions.
              </Typography>
              <EnhancedDashboard />
            </Container>
          </Box>
        </AppProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

// Create a test instance
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
}

// Add console message
console.log('🧪 FUNCTIONALITY TEST MODE ACTIVE');
console.log('Please test the following:');
console.log('1. Wallet connect button (top right)');
console.log('2. Notifications bell icon');
console.log('3. Settings gear icon');
console.log('4. Profile avatar menu');
console.log('5. Search functionality (start typing)');
console.log('6. Dashboard metric card hover actions');
console.log('7. Refresh Data button');
console.log('8. Watchlist toggle on metric cards');
console.log('All interactions will log to console ↑');

export default TestApp;
