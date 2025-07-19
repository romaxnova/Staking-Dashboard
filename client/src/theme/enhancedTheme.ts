import { createTheme, ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Enhanced color palette inspired by modern fintech and blockchain interfaces
const lightPalette = {
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

// Dark theme palette
const darkPalette = {
  primary: {
    main: '#FF6B35',
    light: '#FF8A5C',
    dark: '#E55528',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#434C5E',
    light: '#5E81AC',
    dark: '#2E3440',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#A3BE8C',
    light: '#B8CCA3',
    dark: '#8FA376',
    contrastText: '#2E3440',
  },
  warning: {
    main: '#EBCB8B',
    light: '#F0D4A1',
    dark: '#E6BC74',
    contrastText: '#2E3440',
  },
  error: {
    main: '#BF616A',
    light: '#CC7A82',
    dark: '#A54C55',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#88C0D0',
    light: '#8FBCBB',
    dark: '#5E81AC',
    contrastText: '#2E3440',
  },
  background: {
    default: '#2E3440',
    paper: '#3B4252',
  },
  text: {
    primary: '#ECEFF4',
    secondary: '#D8DEE9',
  },
  divider: alpha('#4C566A', 0.6),
};

// Create theme function
const createEnhancedTheme = (isDarkMode: boolean = false) => {
  const palette = isDarkMode ? darkPalette : lightPalette;
  
  return createTheme({
    palette,
    typography: {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2, letterSpacing: '-0.02em' },
      h2: { fontWeight: 600, fontSize: '2rem', lineHeight: 1.3, letterSpacing: '-0.01em' },
      h3: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.4, letterSpacing: '-0.01em' },
      h4: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4 },
      h5: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
      h6: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 },
      body1: { fontSize: '1rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.5 },
      button: { fontWeight: 600, textTransform: 'none' as const, letterSpacing: '0.02em' },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
            boxShadow: `0 1px 3px ${alpha(palette.secondary.main, 0.1)}`,
            borderBottom: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${alpha(palette.divider, 0.5)}`,
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
            '&:hover': { transform: 'translateY(-1px)' },
          },
          contained: {
            boxShadow: `0 2px 8px ${alpha(palette.primary.main, 0.3)}`,
            '&:hover': { boxShadow: `0 4px 16px ${alpha(palette.primary.main, 0.4)}` },
          },
        },
      },
    },
    shape: { borderRadius: 8 },
    spacing: 8,
  } as ThemeOptions);
};

export const enhancedTheme = createEnhancedTheme(false);
export const createThemeWithMode = createEnhancedTheme;
export default enhancedTheme;
