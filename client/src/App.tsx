import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { createThemeWithMode } from './theme/enhancedTheme';
import { AppProvider, useAppContext } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import EnhancedNavigation from './components/EnhancedNavigation';
import PublicHeader from './components/PublicHeader';
import ExplorerHomepage from './components/ExplorerHomepage';
import IntegratorsPage from './components/IntegratorsPage';
import OperatorsPage from './components/OperatorsPage';
import FreeProfileSystem from './components/FreeProfileSystem';
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
          <Routes>
            {/* Public Explorer Routes with PublicHeader */}
            <Route path="/explorer/*" element={
              <>
                <PublicHeader />
                <Routes>
                  <Route path="/" element={<ExplorerHomepage />} />
                  <Route path="/integrators" element={<IntegratorsPage />} />
                  <Route path="/operators" element={<OperatorsPage />} />
                  <Route path="/profile" element={<FreeProfileSystem />} />
                </Routes>
              </>
            } />
            
            {/* Private Dashboard Routes with EnhancedNavigation */}
            <Route path="/*" element={
              <>
                <EnhancedNavigation />
                <Routes>
                  <Route path="/" element={<EnhancedDashboard />} />
                  <Route path="/dashboard" element={<EnhancedDashboard />} />
                  <Route path="/analytics" element={<StakingPerformance />} />
                  <Route path="/pro" element={<ExplorerPro />} />
                </Routes>
              </>
            } />
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
