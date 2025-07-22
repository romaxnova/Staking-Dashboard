import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Avatar,
  Chip,
  useTheme,
  alpha,
  Stack,
  Divider,
} from '@mui/material';
import {
  Search,
  AccountCircle,
  Notifications,
  TrendingUp,
  Business,
  Analytics,
  MenuBook,
  Login,
  PersonAdd,
  AccountBalanceWallet,
  Dashboard,
  Logout,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface PublicHeaderProps {
  isAuthenticated: boolean;
  walletConnected: boolean;
  walletAddress: string;
  onSignIn: () => void;
  onSignOut: () => void;
  onWalletConnect: () => void;
  onWalletDisconnect: () => void;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({
  isAuthenticated,
  walletConnected,
  walletAddress,
  onSignIn,
  onSignOut,
  onWalletConnect,
  onWalletDisconnect,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  const navItems = [
    { label: 'Explorer', path: '/explorer', icon: <TrendingUp /> },
    { label: 'Integrators', path: '/explorer/integrators', icon: <Business /> },
    { label: 'Operators', path: '/explorer/operators', icon: <Analytics /> },
    { label: 'Learn', path: '/explorer/learn', icon: <MenuBook /> },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/explorer') return location.pathname === '/explorer' || location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleDashboardAccess = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      onSignIn();
      // After sign in, navigate to dashboard
      setTimeout(() => navigate('/dashboard'), 100);
    }
    handleProfileMenuClose();
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/explorer')}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>
                K
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
                Kiln Explorer Demo
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Staking Analytics (demo limited to ETH and desktop version)
              </Typography>
            </Box>
          </Box>

          {/* Navigation Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  color: isActiveRoute(item.path) ? 'primary.main' : 'text.secondary',
                  fontWeight: isActiveRoute(item.path) ? 600 : 400,
                  backgroundColor: isActiveRoute(item.path) 
                    ? alpha(theme.palette.primary.main, 0.1) 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Auth/Profile Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Wallet Connection */}
            {!walletConnected ? (
              <Button
                variant="outlined"
                startIcon={<AccountBalanceWallet />}
                onClick={onWalletConnect}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Connect Wallet
              </Button>
            ) : (
              <Chip
                icon={<AccountBalanceWallet />}
                label={formatWalletAddress(walletAddress)}
                onDelete={onWalletDisconnect}
                color="success"
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
            )}

            {/* Authentication */}
            {!isAuthenticated ? (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<Login />}
                  onClick={onSignIn}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Sign In
                </Button>
              </Stack>
            ) : (
              <>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    p: 0,
                    ml: 1,
                    '&:hover': { backgroundColor: 'transparent' },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: '0.875rem',
                      }}
                    >
                      A
                    </Avatar>
                    <KeyboardArrowDown fontSize="small" />
                  </Stack>
                </IconButton>

                <Menu
                  anchorEl={profileMenuAnchor}
                  open={Boolean(profileMenuAnchor)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Alex Johnson
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Free Profile
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => navigate('/explorer/profile')}>
                    <AccountCircle sx={{ mr: 1 }} fontSize="small" />
                    Profile & Settings
                  </MenuItem>
                  <MenuItem onClick={handleDashboardAccess}>
                    <Dashboard sx={{ mr: 1 }} fontSize="small" />
                    Dashboard
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={onSignOut}>
                    <Logout sx={{ mr: 1 }} fontSize="small" />
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default PublicHeader;
