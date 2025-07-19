import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ExplorerPro from './components/ExplorerPro';
import PerformanceCharts from './components/PerformanceCharts';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B35',
    },
    secondary: {
      main: '#2E3440',
    },
  },
});

const Navigation: React.FC = () => {
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🔥 KilnPM Dashboard
        </Typography>
        <Button color="inherit" component={Link} to="/">
          📊 Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/explorer">
          🔍 Explorer
        </Button>
        <Button color="inherit" component={Link} to="/analytics">
          📈 Analytics
        </Button>
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explorer" element={<ExplorerPro />} />
          <Route path="/analytics" element={<PerformanceCharts />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
