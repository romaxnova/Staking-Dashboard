import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { createThemeWithMode } from './theme/enhancedTheme';
import { AppProvider, useAppContext } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import EnhancedNavigation from './components/EnhancedNavigation';
import EnhancedDashboard from './components/EnhancedDashboard';
import ExplorerPro from './components/ExplorerPro';
import StakingPerformance from './components/StakingPerformance';

const AppContent: React.FC = () => {
  const { isDarkMode } = useAppContext();
  const theme = createThemeWithMode(isDarkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <EnhancedNavigation />
          <Routes>
            <Route path="/" element={<EnhancedDashboard />} />
            <Route path="/explorer" element={<ExplorerPro />} />
            <Route path="/analytics" element={<StakingPerformance />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
