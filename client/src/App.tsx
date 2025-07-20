import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import LearnPage from './components/LearnPage';
import EnhancedDashboard from './components/EnhancedDashboard';
import ExplorerPro from './components/ExplorerPro';
import StakingPerformance from './components/StakingPerformance';

const AppContent: React.FC = () => {
  const { isDarkMode } = useAppContext();
  const theme = createThemeWithMode(isDarkMode);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [walletConnected, setWalletConnected] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState('');

  // Mock authentication and wallet connection
  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setWalletConnected(false);
    setWalletAddress('');
  };

  const handleWalletConnect = () => {
    setWalletConnected(true);
    setWalletAddress('0x742d35Cc9dC89EaB52b1e7633B0897141c2b4675'); // Mock wallet address with staking data
  };

  const handleWalletDisconnect = () => {
    setWalletConnected(false);
    setWalletAddress('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Routes>
            {/* Default route redirects to explorer */}
            <Route path="/" element={<Navigate to="/explorer" replace />} />
            
            {/* Public Explorer Routes - Default landing area */}
            <Route path="/explorer/*" element={
              <>
                <PublicHeader 
                  isAuthenticated={isAuthenticated}
                  walletConnected={walletConnected}
                  walletAddress={walletAddress}
                  onSignIn={handleSignIn}
                  onSignOut={handleSignOut}
                  onWalletConnect={handleWalletConnect}
                  onWalletDisconnect={handleWalletDisconnect}
                />
                <Routes>
                  <Route path="/" element={<ExplorerHomepage />} />
                  <Route path="/integrators" element={<IntegratorsPage />} />
                  <Route path="/operators" element={<OperatorsPage />} />
                  <Route path="/profile" element={<FreeProfileSystem />} />
                  <Route path="/learn" element={<LearnPage />} />
                </Routes>
              </>
            } />
            
            {/* Private Dashboard Routes - Requires authentication */}
            <Route path="/dashboard/*" element={
              isAuthenticated ? (
                <>
                  <EnhancedNavigation />
                  <Routes>
                    <Route path="/" element={<EnhancedDashboard walletAddress={walletAddress} />} />
                    <Route path="/analytics" element={<StakingPerformance />} />
                    <Route path="/pro" element={<ExplorerPro />} />
                  </Routes>
                </>
              ) : (
                <Navigate to="/explorer" replace />
              )
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
