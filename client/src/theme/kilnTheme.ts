import { createTheme } from '@mui/material/styles';

// Kiln Explorer inspired theme
export const kilnTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B35', // Kiln orange
      light: '#FF8A65',
      dark: '#E64A19',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1E1E1E', // Dark background
      light: '#2A2A2A',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0A0A0A', // Very dark background
      paper: '#1A1A1A', // Card background
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#F44336',
      light: '#EF5350',
      dark: '#D32F2F',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
          border: '1px solid rgba(255, 107, 53, 0.1)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            border: '1px solid rgba(255, 107, 53, 0.3)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(255, 107, 53, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1A1A',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          background: 'linear-gradient(135deg, #FF6B35 0%, #E64A19 100%)',
          boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E64A19 0%, #D84315 100%)',
            boxShadow: '0 6px 24px rgba(255, 107, 53, 0.4)',
          },
        },
        outlined: {
          borderColor: '#FF6B35',
          color: '#FF6B35',
          '&:hover': {
            borderColor: '#E64A19',
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          color: '#FF6B35',
          border: '1px solid rgba(255, 107, 53, 0.3)',
        },
        colorPrimary: {
          backgroundColor: 'rgba(255, 107, 53, 0.2)',
          color: '#FF6B35',
        },
        colorSuccess: {
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          color: '#4CAF50',
        },
        colorWarning: {
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          color: '#FF9800',
        },
        colorError: {
          backgroundColor: 'rgba(244, 67, 54, 0.2)',
          color: '#F44336',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        head: {
          backgroundColor: 'rgba(255, 107, 53, 0.05)',
          fontWeight: 600,
          color: '#FF6B35',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 107, 53, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF6B35',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A0A0A',
          borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});
