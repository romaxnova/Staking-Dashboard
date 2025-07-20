import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Explore as ExploreIcon,
  Analytics as AnalyticsIcon,
  AccountBalanceWallet,
  Notifications,
  Settings,
  Person,
  TrendingUp,
  Security,
  Logout,
  DarkMode,
  LightMode,
  ClearAll,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
import SearchComponent from './SearchComponent';

const EnhancedNavigation: React.FC = () => {
  const location = useLocation();
  const {
    wallet,
    connectWallet,
    disconnectWallet,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    isDarkMode,
    toggleDarkMode,
  } = useAppContext();

  // Local state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);

  // Event handlers
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log('Notification button clicked!');
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    console.log('Notification menu closed');
    setNotificationAnchorEl(null);
  };

  const handleSettingsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log('Settings button clicked!');
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    console.log('Settings menu closed');
    setSettingsAnchorEl(null);
  };

  const handleWalletClick = () => {
    console.log('Wallet button clicked!', wallet);
    if (wallet.isConnected) {
      console.log('Opening wallet dialog');
      setWalletDialogOpen(true);
    } else {
      console.log('Attempting to connect wallet');
      handleConnectWallet();
    }
  };

  const handleConnectWallet = async () => {
    console.log('Starting wallet connection...');
    setConnectingWallet(true);
    try {
      await connectWallet();
      console.log('Wallet connected successfully!');
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setConnectingWallet(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setWalletDialogOpen(false);
  };

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const isActive = (path: string) => location.pathname === path;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <DashboardIcon />,
      description: 'Overview & Analytics',
    },
    {
      label: 'Explorer',
      path: '/explorer',
      icon: <ExploreIcon />,
      description: 'Integrations & Data',
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: <AnalyticsIcon />,
      description: 'Performance Metrics',
    },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(20px)',
        backgroundColor: alpha('#FFFFFF', 0.95),
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
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
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              K
            </Typography>
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}
            >
              KilnPM
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Explorer Suite
            </Typography>
          </Box>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, ml: 2 }}>
          {navItems.map((item) => (
            <Tooltip 
              key={item.path}
              title={item.description}
              placement="bottom"
            >
              <Button
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  mr: 1,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: isActive(item.path) 
                    ? alpha('#FF6B35', 0.1) 
                    : 'transparent',
                  color: isActive(item.path) 
                    ? 'primary.main' 
                    : 'text.primary',
                  fontWeight: isActive(item.path) ? 600 : 500,
                  '&:hover': {
                    backgroundColor: alpha('#FF6B35', 0.08),
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {item.label}
              </Button>
            </Tooltip>
          ))}
        </Box>

        {/* Search Component - Hide on explorer page since it has its own enhanced search */}
        {!location.pathname.includes('/explorer') && (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 3 }}>
            <SearchComponent />
          </Box>
        )}

        {/* Network Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Chip
            icon={<TrendingUp sx={{ fontSize: '1rem' }} />}
            label="Mainnet"
            variant="outlined"
            size="small"
            sx={{
              borderColor: 'success.main',
              color: 'success.main',
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Wallet Connection */}
          <Tooltip title={wallet.isConnected ? "Wallet Connected" : "Connect Wallet"}>
            <IconButton
              onClick={handleWalletClick}
              disabled={connectingWallet}
              sx={{
                borderRadius: 2,
                p: 1.5,
                backgroundColor: wallet.isConnected 
                  ? alpha('#A3BE8C', 0.1) 
                  : alpha('#FF6B35', 0.1),
                color: wallet.isConnected ? 'success.main' : 'primary.main',
                '&:hover': {
                  backgroundColor: wallet.isConnected 
                    ? alpha('#A3BE8C', 0.15) 
                    : alpha('#FF6B35', 0.15),
                  transform: 'scale(1.05)',
                },
              }}
            >
              {connectingWallet ? (
                <CircularProgress size={20} />
              ) : (
                <AccountBalanceWallet />
              )}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationMenuOpen}
              sx={{
                borderRadius: 2,
                p: 1.5,
                '&:hover': {
                  backgroundColor: alpha('#000', 0.05),
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Badge badgeContent={unreadNotifications} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton
              onClick={handleSettingsMenuOpen}
              sx={{
                borderRadius: 2,
                p: 1.5,
                '&:hover': {
                  backgroundColor: alpha('#000', 0.05),
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Settings />
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Profile">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                borderRadius: 2,
                p: 0.5,
                ml: 1,
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)',
                  fontWeight: 600,
                }}
              >
                <Person />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 250,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info Header */}
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {wallet.isConnected ? 'Connected User' : 'Guest User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {wallet.isConnected ? wallet.address?.slice(0, 10) + '...' : 'Not connected'}
            </Typography>
          </Box>
          
          <MenuItem 
            onClick={() => {
              console.log('Profile clicked');
              handleProfileMenuClose();
              // TODO: Open profile dialog
            }}
            sx={{ px: 2, py: 1.5 }}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText 
              primary="Profile"
              secondary="Manage your account"
            />
          </MenuItem>
          
          <MenuItem 
            onClick={() => {
              console.log('Account security clicked');
              handleProfileMenuClose();
              // TODO: Open security settings
            }}
            sx={{ px: 2, py: 1.5 }}
          >
            <ListItemIcon>
              <Security />
            </ListItemIcon>
            <ListItemText 
              primary="Security"
              secondary="2FA and privacy settings"
            />
          </MenuItem>
          
          <MenuItem 
            onClick={() => {
              console.log('Portfolio clicked');
              handleProfileMenuClose();
              // TODO: Navigate to portfolio
            }}
            sx={{ px: 2, py: 1.5 }}
          >
            <ListItemIcon>
              <TrendingUp />
            </ListItemIcon>
            <ListItemText 
              primary="Portfolio"
              secondary="View your staking portfolio"
            />
          </MenuItem>
          
          <Divider />
          
          {wallet.isConnected && (
            <MenuItem 
              onClick={() => {
                console.log('Disconnecting wallet...');
                handleDisconnectWallet();
                handleProfileMenuClose();
              }}
              sx={{ px: 2, py: 1.5, color: 'error.main' }}
            >
              <ListItemIcon>
                <Logout sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Disconnect Wallet"
                secondary="Sign out from current wallet"
              />
            </MenuItem>
          )}
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 350,
              maxWidth: 400,
              maxHeight: 500,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            <Button size="small" onClick={clearNotifications} startIcon={<ClearAll />}>
              Clear All
            </Button>
          </Box>
          <Divider />
          <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="No notifications" secondary="You're all caught up!" />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : alpha('#FF6B35', 0.05),
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha('#FF6B35', 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: notification.read ? 'transparent' : 'primary.main',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Menu>

        {/* Settings Menu */}
        <Menu
          anchorEl={settingsAnchorEl}
          open={Boolean(settingsAnchorEl)}
          onClose={handleSettingsMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem 
            onClick={() => {
              console.log('Dark mode toggle clicked, current state:', isDarkMode);
              toggleDarkMode();
              handleSettingsMenuClose();
            }}
            sx={{ px: 2, py: 1.5 }}
          >
            <ListItemIcon>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </ListItemIcon>
            <ListItemText 
              primary={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              secondary={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
            />
          </MenuItem>
          
          <Divider />
          
          <MenuItem 
            onClick={() => {
              console.log('Preferences clicked');
              handleSettingsMenuClose();
              // TODO: Open preferences dialog
            }}
            sx={{ px: 2, py: 1.5 }}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText 
              primary="Preferences"
              secondary="App settings and configuration"
            />
          </MenuItem>
          
          <MenuItem 
            onClick={() => {
              console.log('Security settings clicked');
              handleSettingsMenuClose();
              // TODO: Open security settings
            }}
            sx={{ px: 2, py: 1.5 }}
          >
            <ListItemIcon>
              <Security />
            </ListItemIcon>
            <ListItemText 
              primary="Security"
              secondary="Privacy and security settings"
            />
          </MenuItem>
        </Menu>

        {/* Wallet Details Dialog */}
        <Dialog open={walletDialogOpen} onClose={() => setWalletDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Wallet Details</DialogTitle>
          <DialogContent>
            {wallet.isConnected && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="success">Wallet Connected Successfully</Alert>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {wallet.address}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Balance
                  </Typography>
                  <Typography variant="h6">
                    {wallet.balance} ETH
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Network
                  </Typography>
                  <Chip label={wallet.network} color="success" size="small" />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWalletDialogOpen(false)}>Close</Button>
            <Button onClick={handleDisconnectWallet} color="error" variant="outlined">
              Disconnect
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default EnhancedNavigation;