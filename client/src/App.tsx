import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from './context/AppContext';
import { kilnTheme } from './theme/kilnTheme';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EnhancedNavigation } from './components/EnhancedNavigation';
import { EnhancedDashboard } from './components/EnhancedDashboard';
import { ExplorerHomepage } from './components/ExplorerHomepage';
import { IntegratorsPage } from './components/IntegratorsPage';
import { OperatorsPage } from './components/OperatorsPage';
import { LearnPage } from './components/LearnPage';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={kilnTheme}>
      <CssBaseline />
      <AppProvider>
        <ErrorBoundary>
          <Router>
            <div className="App">
              <EnhancedNavigation />
              <Routes>
                <Route path="/" element={<EnhancedDashboard />} />
                <Route path="/dashboard" element={<EnhancedDashboard />} />
                <Route path="/explorer" element={<ExplorerHomepage />} />
                <Route path="/integrators" element={<IntegratorsPage />} />
                <Route path="/operators" element={<OperatorsPage />} />
                <Route path="/learn" element={<LearnPage />} />
              </Routes>
            </div>
          </Router>
        </ErrorBoundary>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
