import { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Badge, 
  IconButton, 
  Box,
  Container,
  useScrollTrigger,
  Slide,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  AdminPanelSettings, 
  Home as HomeIcon,
  Person,
  Receipt,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = ({ cartCount, wishlistCount, isAdmin, onSearch }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [searchQuery, setSearchQuery] = useState('');

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          color: '#333333',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              py: { xs: 1, md: 1.5 },
              flexWrap: { xs: 'wrap', md: 'nowrap' }
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontFamily: "'Montserrat', sans-serif",
                cursor: 'pointer',
                color: '#4CAF50',
                letterSpacing: '-0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { opacity: 0.9 },
                flexShrink: 0,
              }}
              onClick={() => navigate('/')}
            >
              <span style={{ color: '#FF9800' }}>D'</span>Store
            </Typography>

            <TextField
              variant="outlined"
              size="small"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#757575' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                mx: { xs: 0, md: 2 },
                mt: { xs: 1, md: 0 },
                width: { xs: '100%', sm: 'auto' },
                maxWidth: { md: 400 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px',
                  bgcolor: '#F5F5F5',
                  '&:hover fieldset': { borderColor: '#4CAF50' },
                  '&.Mui-focused fieldset': { borderColor: '#4CAF50' },
                },
              }}
            />

            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.5, sm: 1, md: 2 },
                flexWrap: 'wrap',
                mt: { xs: 1, md: 0 }
              }}
            >
              <Button
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
                sx={{
                  color: '#333333',
                  textTransform: 'none',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500,
                  px: { xs: 1, md: 2 },
                  '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.08)', color: '#4CAF50' },
                }}
              >
                Home
              </Button>

              {token ? (
                <>
                  <Button
                    startIcon={<Person />}
                    onClick={() => navigate('/profile')}
                    sx={{
                      color: '#333333',
                      textTransform: 'none',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 500,
                      px: { xs: 1, md: 2 },
                      display: { xs: 'none', sm: 'flex' },
                      '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.08)', color: '#4CAF50' },
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    startIcon={<Receipt />}
                    onClick={() => navigate('/orders')}
                    sx={{
                      color: '#333333',
                      textTransform: 'none',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 500,
                      px: { xs: 1, md: 2 },
                      display: { xs: 'none', sm: 'flex' },
                      '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.08)', color: '#4CAF50' },
                    }}
                  >
                    Orders
                  </Button>
                  <IconButton
                    onClick={() => navigate('/wishlist')}
                    sx={{ 
                      color: '#333333', 
                      '&:hover': { color: '#FF9800', bgcolor: 'rgba(255, 152, 0, 0.08)' } 
                    }}
                  >
                    <Badge 
                      badgeContent={wishlistCount} 
                      color="secondary"
                      sx={{ '& .MuiBadge-badge': { bgcolor: '#FF9800', fontWeight: 600 } }}
                    >
                      <Favorite />
                    </Badge>
                  </IconButton>
                  <IconButton
                    onClick={() => navigate('/cart')}
                    sx={{ 
                      color: '#333333',
                      '&:hover': { color: '#4CAF50', bgcolor: 'rgba(76, 175, 80, 0.08)' }
                    }}
                  >
                    <Badge 
                      badgeContent={cartCount} 
                      color="secondary"
                      sx={{ '& .MuiBadge-badge': { bgcolor: '#FF9800', fontWeight: 600 } }}
                    >
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                  {isAdmin && (
                    <IconButton
                      onClick={() => navigate('/admin/')}
                      sx={{ 
                        color: '#333333', 
                        '&:hover': { color: '#2196F3', bgcolor: 'rgba(33, 150, 243, 0.08)' } 
                      }}
                    >
                      <AdminPanelSettings />
                    </IconButton>
                  )}
                  <Button
                    variant="outlined"
                    onClick={logout}
                    sx={{
                      ml: { xs: 0.5, md: 1 },
                      color: '#333333',
                      textTransform: 'none',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 500,
                      borderColor: 'rgba(0,0,0,0.12)',
                      minWidth: { xs: '40px', md: '80px' },
                      '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.08)', color: '#f44336', borderColor: '#f44336' },
                    }}
                  >
                    <span style={{ display: { xs: 'none', sm: 'inline' } }}>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#4CAF50',
                      borderColor: '#4CAF50',
                      textTransform: 'none',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 500,
                      px: { xs: 1.5, md: 2 },
                      borderRadius: '50px',
                      '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.08)', borderColor: '#4CAF50' },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{
                      bgcolor: '#4CAF50',
                      textTransform: 'none',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 500,
                      px: { xs: 1.5, md: 2 },
                      ml: 1,
                      borderRadius: '50px',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#43A047', boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)' },
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;