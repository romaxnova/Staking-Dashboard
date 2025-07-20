import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Stack,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MenuBook,
  Launch,
  Code,
  Security,
  Assessment,
  TrendingUp,
  Business,
  School,
  Description,
  PlayCircle,
  Article,
  Api,
  Support,
  GitHub,
  IntegrationInstructions,
} from '@mui/icons-material';

interface ResourceCard {
  title: string;
  description: string;
  type: 'Documentation' | 'Tutorial' | 'API Reference' | 'Video' | 'Guide';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  icon: React.ReactNode;
  featured?: boolean;
}

const LearnPage: React.FC = () => {
  const theme = useTheme();

  const resources: ResourceCard[] = [
    {
      title: 'Kiln Connect API Documentation',
      description: 'Complete API reference for integrating Ethereum staking into your application',
      type: 'API Reference',
      difficulty: 'Intermediate',
      url: 'https://docs.kiln.fi/connect/overview',
      icon: <Api />,
      featured: true,
    },
    {
      title: 'Getting Started with Ethereum Staking',
      description: 'Learn the fundamentals of Ethereum staking and how it works',
      type: 'Guide',
      difficulty: 'Beginner',
      url: 'https://docs.kiln.fi/concepts/ethereum-staking',
      icon: <School />,
      featured: true,
    },
    {
      title: 'Integration Quickstart',
      description: 'Step-by-step guide to integrate Kiln staking in 15 minutes',
      type: 'Tutorial',
      difficulty: 'Beginner',
      url: 'https://docs.kiln.fi/quickstart',
      icon: <IntegrationInstructions />,
      featured: true,
    },
    {
      title: 'White-label Staking Solutions',
      description: 'Build your own staking interface with Kiln\'s infrastructure',
      type: 'Documentation',
      difficulty: 'Advanced',
      url: 'https://docs.kiln.fi/connect/white-label',
      icon: <Business />,
    },
    {
      title: 'Validator Performance Metrics',
      description: 'Understanding APY, effectiveness, and performance indicators',
      type: 'Guide',
      difficulty: 'Intermediate',
      url: 'https://docs.kiln.fi/concepts/validator-performance',
      icon: <Assessment />,
    },
    {
      title: 'Security Best Practices',
      description: 'Secure staking implementation and risk management',
      type: 'Documentation',
      difficulty: 'Advanced',
      url: 'https://docs.kiln.fi/security',
      icon: <Security />,
    },
    {
      title: 'Staking Rewards & Economics',
      description: 'How staking rewards work and are distributed',
      type: 'Guide',
      difficulty: 'Beginner',
      url: 'https://docs.kiln.fi/concepts/rewards',
      icon: <TrendingUp />,
    },
    {
      title: 'SDK & Code Examples',
      description: 'Ready-to-use code samples in multiple programming languages',
      type: 'Tutorial',
      difficulty: 'Intermediate',
      url: 'https://docs.kiln.fi/sdk',
      icon: <Code />,
    },
  ];

  const categories = [
    {
      title: 'Getting Started',
      description: 'New to Ethereum staking? Start here',
      icon: <School />,
      color: 'primary',
      resources: resources.filter(r => r.difficulty === 'Beginner'),
    },
    {
      title: 'Developer Resources',
      description: 'APIs, SDKs, and integration guides',
      icon: <Code />,
      color: 'secondary',
      resources: resources.filter(r => r.type === 'API Reference' || r.type === 'Tutorial'),
    },
    {
      title: 'Advanced Topics',
      description: 'Deep dives into staking concepts',
      icon: <Assessment />,
      color: 'success',
      resources: resources.filter(r => r.difficulty === 'Advanced'),
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Documentation': return 'primary';
      case 'Tutorial': return 'secondary';
      case 'API Reference': return 'info';
      case 'Video': return 'success';
      case 'Guide': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FF6B35 0%, #E55528 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 800 }}>
            K
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Kiln Learning Center
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Master Ethereum staking with comprehensive guides, API documentation, and developer resources
        </Typography>
      </Box>

      {/* Featured Resources */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Featured Resources
        </Typography>
        <Grid container spacing={3}>
          {resources.filter(r => r.featured).map((resource, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: `2px solid transparent`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    border: `2px solid ${theme.palette.primary.main}`,
                    boxShadow: '0 8px 30px rgba(255, 107, 53, 0.15)',
                  },
                }}
                onClick={() => window.open(resource.url, '_blank')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        mr: 2,
                      }}
                    >
                      {resource.icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip
                          size="small"
                          label={resource.type}
                          color={getTypeColor(resource.type)}
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={resource.difficulty}
                          color={getDifficultyColor(resource.difficulty)}
                        />
                      </Stack>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {resource.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Launch />}
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(resource.url, '_blank');
                    }}
                  >
                    View Resource
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Resource Categories */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Browse by Category
        </Typography>
        <Grid container spacing={4}>
          {categories.map((category, index) => (
            <Grid item xs={12} lg={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(theme.palette[category.color].main, 0.05)} 0%, ${alpha(theme.palette[category.color].main, 0.02)} 100%)`,
                  border: `1px solid ${alpha(theme.palette[category.color].main, 0.2)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette[category.color].main, 0.1),
                      color: `${category.color}.main`,
                      mr: 2,
                    }}
                  >
                    {category.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>
                </Box>
                <List dense>
                  {category.resources.slice(0, 3).map((resource, idx) => (
                    <ListItem
                      key={idx}
                      sx={{
                        px: 0,
                        cursor: 'pointer',
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ListItemIcon>
                        {resource.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={resource.title}
                        secondary={resource.type}
                      />
                      <Launch fontSize="small" color="action" />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick Links */}
      <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: 'white' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Need More Help?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              Join our community, explore the GitHub repository, or contact our support team for personalized assistance.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                startIcon={<GitHub />}
                fullWidth
                onClick={() => window.open('https://github.com/kilnfi', '_blank')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                GitHub Repository
              </Button>
              <Button
                variant="contained"
                startIcon={<Support />}
                fullWidth
                onClick={() => window.open('https://docs.kiln.fi/support', '_blank')}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                Contact Support
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LearnPage;
