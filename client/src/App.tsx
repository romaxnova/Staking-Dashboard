import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import enhancedTheme from './theme/enhancedTheme';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import EnhancedNavigation from './components/EnhancedNavigation';
import EnhancedDashboard from './components/EnhancedDashboard';
import ExplorerPro from './components/ExplorerPro';
import PerformanceCharts from './components/PerformanceCharts';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ThemeProvider theme={enhancedTheme}>
          <CssBaseline />
          <Router>
            <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
              <EnhancedNavigation />
              <Routes>
                <Route path="/" element={<EnhancedDashboard />} />
                <Route path="/explorer" element={<ExplorerPro />} />
                <Route path="/analytics" element={<PerformanceCharts />} />
              </Routes>
            </Box>
          </Router>
        </ThemeProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
