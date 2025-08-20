import { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, IconButton, Grid } from '@mui/material';
import { Delete, AddShoppingCart, Favorite, ShoppingBasket } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import api from '../api';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wishlistRes = await api.get('/user/wishlist');
        setWishlist(wishlistRes.data || { products: [] });

        const cartRes = await api.get('/user/cart');
        setCartCount(cartRes.data.items?.length || 0);

        const token = localStorage.getItem('token');
        if (token) {
          const profileRes = await api.get('/user/profile');
          setIsAdmin(profileRes.data.isAdmin || false);
        }
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load wishlist—check the console!');
        console.error('Wishlist Fetch Error:', err);
      }
    };
    fetchData();
  }, []);

  const removeFromWishlist = (productId) => {
    api.delete('/user/wishlist', { data: { productId } })
      .then((res) => {
        setWishlist(res.data);
        setError('');
      })
      .catch((err) => setError(err.response?.data?.msg || 'Remove from wishlist failed!'));
  };

  const addToCart = (productId) => {
    api.post('/user/cart', { productId, quantity: 1 })
      .then(() => {
        setCartCount(cartCount + 1);
        setError('');
      })
      .catch((err) => setError(err.response?.data?.msg || 'Add to cart failed!'));
  };

  return (
    <>
      <Navbar cartCount={cartCount} isAdmin={isAdmin} />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3, 
            fontWeight: 700, 
            color: '#333333',
            fontFamily: '"Montserrat", sans-serif',
          }}
        >
          Your Wishlist
        </Typography>
        
        {error && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: '#FDECEA', 
            borderRadius: '12px',
            border: '1px solid #FDCDC8',
          }}>
            <Typography 
              color="error" 
              sx={{ 
                fontFamily: '"Open Sans", sans-serif',
              }}
            >
              {error}
            </Typography>
          </Box>
        )}
        
        {wishlist.products.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#F9F9F9',
            borderRadius: '12px',
            border: '1px dashed #e0e0e0',
            p: 4,
          }}>
            <Favorite sx={{ 
              fontSize: 60, 
              color: '#FF9800', 
              opacity: 0.7,
              mb: 2 
            }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#757575', 
                mb: 3,
                fontFamily: '"Open Sans", sans-serif',
              }}
            >
              Your wishlist is empty. Start adding your favorite products!
            </Typography>
            <Button
              variant="contained"
              startIcon={<ShoppingBasket />}
              sx={{ 
                bgcolor: '#4CAF50',
                borderRadius: '50px',
                padding: '10px 24px',
                textTransform: 'none',
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 500,
                '&:hover': { 
                  bgcolor: '#3d8b40',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
                transition: 'all 0.2s ease',
              }}
              onClick={() => window.location.href = '/'}
            >
              Browse Products
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {wishlist.products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    },
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ 
                    position: 'relative', 
                    pt: '75%', // 4:3 aspect ratio 
                    bgcolor: '#F9F9F9',
                  }}>
                    <img
                      src={product.image || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      onClick={() => removeFromWishlist(product._id)}
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        color: '#FF9800',
                        '&:hover': { 
                          bgcolor: 'rgba(255, 255, 255, 1)',
                          color: '#f44336',
                        },
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#333333', 
                        mb: 1,
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {product.name || 'Unnamed Product'}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#757575', 
                        mb: 2,
                        fontFamily: '"Open Sans", sans-serif',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '40px',
                      }}
                    >
                      {product.description?.substring(0, 100) || 'No description'}
                      {product.description?.length > 100 ? '...' : ''}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#4CAF50', 
                          fontWeight: 600,
                          fontFamily: '"Montserrat", sans-serif',
                          fontSize: '1.25rem',
                        }}
                      >
                        ${product.discountedPrice?.toFixed(2) || '0.00'}
                      </Typography>
                      
                      {product.actualPrice > product.discountedPrice && (
                        <Typography 
                          component="span" 
                          sx={{ 
                            ml: 1, 
                            color: '#757575', 
                            textDecoration: 'line-through',
                            fontFamily: '"Open Sans", sans-serif',
                          }}
                        >
                          ${product.actualPrice?.toFixed(2) || '0.00'}
                        </Typography>
                      )}
                    </Box>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddShoppingCart />}
                      onClick={() => addToCart(product._id)}
                      sx={{ 
                        bgcolor: '#4CAF50',
                        borderRadius: '50px',
                        padding: '10px 0',
                        textTransform: 'none',
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 500,
                        '&:hover': { 
                          bgcolor: '#3d8b40',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Wishlist;