import React, { Component, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { Refresh, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: error.stack || 'No stack trace available',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Filter out wallet extension errors
    if (error.message?.includes('Cannot redefine property: ethereum') ||
        error.stack?.includes('evmAsk.js')) {
      console.warn('Wallet extension error suppressed:', error.message);
      this.setState({ hasError: false, error: null, errorInfo: null });
      return;
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Don't show error boundary for wallet extension conflicts
      if (this.state.error.message?.includes('Cannot redefine property: ethereum')) {
        return this.props.children;
      }

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            backgroundColor: 'background.default',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <BugReport
              sx={{
                fontSize: 64,
                color: 'error.main',
                mb: 2,
              }}
            />
            
            <Typography variant="h4" gutterBottom color="error">
              Oops! Something went wrong
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We encountered an unexpected error. This has been logged and we're working on a fix.
            </Typography>

            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2" component="div">
                <strong>Error:</strong> {this.state.error.message}
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReload}
                size="large"
              >
                Reload Page
              </Button>
              
              <Button
                variant="outlined"
                onClick={this.handleReset}
                size="large"
              >
                Try Again
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>
                  Development Details:
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: 'grey.100',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    maxHeight: 200,
                    overflow: 'auto',
                  }}
                >
                  <pre>{this.state.errorInfo}</pre>
                </Paper>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
