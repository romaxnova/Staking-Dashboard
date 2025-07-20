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
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface PublicHeaderProps {
  isAuthenticated?: boolean;
  userProfile?: {
    name: string;
    avatar?: string;
    tier: 'free' | 'premium';
  };
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ 
  isAuthenticated = false, 
  userProfile 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  const navItems = [
    { label: 'Explorer', path: '/', icon: <TrendingUp /> },
    { label: 'Integrators', path: '/integrators', icon: <Business /> },
    { label: 'Operators', path: '/operators', icon: <Analytics /> },
    { label: 'Analytics', path: '/analytics', icon: <Analytics /> },
    { label: 'Learn', path: '/learn', icon: <MenuBook /> },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
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
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
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
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Kiln Explorer
            </Typography>
            <Chip
              label="Live Data"
              size="small"
              color="success"
              sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
            />
          </Box>

          {/* Navigation Items */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  color: isActiveRoute(item.path) ? theme.palette.primary.main : theme.palette.text.secondary,
                  fontWeight: isActiveRoute(item.path) ? 600 : 400,
                  backgroundColor: isActiveRoute(item.path) 
                    ? alpha(theme.palette.primary.main, 0.1) 
                    : 'transparent',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Search Button */}
            <IconButton
              size="medium"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
              onClick={() => navigate('/search')}
            >
              <Search />
            </IconButton>

            {isAuthenticated && userProfile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Notifications */}
                <IconButton size="medium">
                  <Badge badgeContent={3} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>

                {/* Profile Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={userProfile.tier.toUpperCase()}
                    size="small"
                    color={userProfile.tier === 'premium' ? 'primary' : 'default'}
                    variant={userProfile.tier === 'premium' ? 'filled' : 'outlined'}
                  />
                  <IconButton onClick={handleProfileMenuOpen}>
                    <Avatar
                      src={userProfile.avatar}
                      sx={{ width: 32, height: 32 }}
                    >
                      {userProfile.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Box>

                <Menu
                  anchorEl={profileMenuAnchor}
                  open={Boolean(profileMenuAnchor)}
                  onClose={handleProfileMenuClose}
                  sx={{ mt: 1 }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
                    Profile & Watchlist
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/reports'); handleProfileMenuClose(); }}>
                    Reports (1/month)
                  </MenuItem>
                  {userProfile.tier === 'free' && (
                    <MenuItem 
                      onClick={() => { navigate('/upgrade'); handleProfileMenuClose(); }}
                      sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
                    >
                      Upgrade to Premium
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleProfileMenuClose}>
                    Sign Out
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  startIcon={<Login />}
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  startIcon={<PersonAdd />}
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/register')}
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E55528 0%, #D44A20 100%)',
                    },
                  }}
                >
                  Free Profile
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default PublicHeader;
