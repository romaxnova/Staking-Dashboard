import { createTheme, ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Enhanced color palette inspired by modern fintech and blockchain interfaces
const palette = {
  primary: {
    main: '#FF6B35', // Kiln orange
    light: '#FF8A5C',
    dark: '#E55528',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#2E3440',
    light: '#434C5E',
    dark: '#1A1F2B',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#A3BE8C',
    light: '#B8CCA3',
    dark: '#8FA376',
    contrastText: '#1A1F2B',
  },
  warning: {
    main: '#EBCB8B',
    light: '#F0D4A1',
    dark: '#E6BC74',
    contrastText: '#1A1F2B',
  },
  error: {
    main: '#BF616A',
    light: '#CC7A82',
    dark: '#A54C55',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#5E81AC',
    light: '#7A97BD',
    dark: '#4C6B94',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#2E3440',
    secondary: '#64748B',
  },
  divider: alpha('#E2E8F0', 0.6),
};

// Enhanced typography with modern font stack
const typography = {
  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: {
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontWeight: 600,
    fontSize: '2rem',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.4,
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.4,
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
    fontWeight: 600,
    textTransform: 'none' as const,
    letterSpacing: '0.02em',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
    color: palette.text.secondary,
  },
};

// Enhanced component styles
const components = {
  MuiCssBaseline: {
    styleOverrides: `
      * {
        box-sizing: border-box;
      }
      html {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      body {
        scroll-behavior: smooth;
      }
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: ${alpha(palette.text.secondary, 0.3)};
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${alpha(palette.text.secondary, 0.5)};
      }
    `,
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: '#FFFFFF',
        color: palette.text.primary,
        boxShadow: `0 1px 3px ${alpha(palette.secondary.main, 0.1)}`,
        borderBottom: `1px solid ${palette.divider}`,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: 12,
        border: `1px solid ${alpha(palette.divider, 0.5)}`,
        boxShadow: `0 1px 3px ${alpha(palette.secondary.main, 0.05)}, 0 4px 12px ${alpha(palette.secondary.main, 0.04)}`,
        transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
        '&:hover': {
          boxShadow: `0 4px 12px ${alpha(palette.secondary.main, 0.08)}, 0 8px 24px ${alpha(palette.secondary.main, 0.06)}`,
        },
      },
      elevation1: {
        boxShadow: `0 1px 3px ${alpha(palette.secondary.main, 0.05)}`,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        border: `1px solid ${alpha(palette.divider, 0.5)}`,
        boxShadow: `0 1px 3px ${alpha(palette.secondary.main, 0.05)}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${alpha(palette.secondary.main, 0.1)}`,
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 20px',
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      },
      contained: {
        boxShadow: `0 2px 8px ${alpha(palette.primary.main, 0.3)}`,
        '&:hover': {
          boxShadow: `0 4px 16px ${alpha(palette.primary.main, 0.4)}`,
        },
      },
      outlined: {
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
        fontSize: '0.75rem',
      },
      filled: {
        backgroundColor: alpha(palette.primary.main, 0.1),
        color: palette.primary.main,
        '&:hover': {
          backgroundColor: alpha(palette.primary.main, 0.15),
        },
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
        padding: '12px 24px',
        minHeight: 48,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: alpha(palette.primary.main, 0.05),
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${alpha(palette.divider, 0.5)}`,
        padding: '16px',
      },
      head: {
        backgroundColor: alpha(palette.primary.main, 0.05),
        fontWeight: 600,
        color: palette.text.primary,
        fontSize: '0.875rem',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: alpha(palette.background.paper, 0.8),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: palette.background.paper,
          },
          '&.Mui-focused': {
            backgroundColor: palette.background.paper,
          },
        },
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        height: 6,
        backgroundColor: alpha(palette.primary.main, 0.1),
      },
      bar: {
        borderRadius: 4,
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        boxShadow: `0 4px 16px ${alpha(palette.primary.main, 0.3)}`,
        '&:hover': {
          boxShadow: `0 6px 20px ${alpha(palette.primary.main, 0.4)}`,
          transform: 'scale(1.05)',
        },
      },
    },
  },
};

// Create the enhanced theme
export const enhancedTheme = createTheme({
  palette,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
} as ThemeOptions);

export default enhancedTheme;
