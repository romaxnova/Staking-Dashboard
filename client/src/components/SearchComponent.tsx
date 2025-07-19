import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Fade,
  ClickAwayListener,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear,
  AccountBalance,
  Person,
  TrendingUp,
  History,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'validator' | 'integrator' | 'transaction' | 'address';
  icon: React.ReactNode;
}

const SearchComponent: React.FC = () => {
  const { searchQuery, setSearchQuery } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search results - in real app, this would be an API call
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: '0x1234567890abcdef1234567890abcdef12345678',
      subtitle: 'Ethereum Address',
      type: 'address',
      icon: <AccountBalance />,
    },
    {
      id: '2',
      title: 'Ledger Live',
      subtitle: '426,400 ETH staked',
      type: 'integrator',
      icon: <TrendingUp />,
    },
    {
      id: '3',
      title: 'Validator #12345',
      subtitle: 'Active validator - 3.42% APY',
      type: 'validator',
      icon: <AccountBalance />,
    },
    {
      id: '4',
      title: '0xabc123...def789',
      subtitle: 'Recent transaction',
      type: 'transaction',
      icon: <History />,
    },
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      // Filter results based on search query
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log('Search query changed:', value);
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    console.log('Search cleared');
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Selected search result:', result);
    setSearchQuery(result.title);
    setIsOpen(false);
    // Here you would navigate to the result or perform an action
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }} ref={searchRef}>
        <TextField
          fullWidth
          placeholder="Search validators, addresses, integrators..."
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: alpha('#ffffff', 0.1),
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.15),
              },
              '&.Mui-focused': {
                backgroundColor: alpha('#ffffff', 0.2),
              },
            },
          }}
        />

        {/* Search Results Dropdown */}
        <Fade in={isOpen && results.length > 0}>
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              maxHeight: 300,
              overflow: 'auto',
              zIndex: 1300,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <List sx={{ p: 0 }}>
              {results.map((result) => (
                <ListItem
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha('#FF6B35', 0.05),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {result.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {result.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {result.subtitle}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Fade>

        {/* No Results */}
        <Fade in={isOpen && results.length === 0 && searchQuery.length > 2}>
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              p: 2,
              zIndex: 1300,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No results found for "{searchQuery}"
            </Typography>
          </Paper>
        </Fade>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchComponent;
