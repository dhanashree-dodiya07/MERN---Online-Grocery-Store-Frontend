import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Button, Rating, TextField, Box, 
  IconButton, Divider, Paper, Avatar, Chip, Snackbar, Alert
} from '@mui/material';
import { 
  Favorite, FavoriteBorder, ShoppingBasket, Star, 
  LocalShipping, Shield, ArrowBack 
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import api from '../api';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [error, setError] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    // Fetch product and reviews
    api.get(`/user/products/${id}`)
      .then((res) => {
        setProduct(res.data.product || {});
        setReviews(res.data.reviews || []);
      })
      .catch(() => {
        setError('Product fetch failed!');
        showSnackbar('Unable to load product details', 'error');
      });

    // Fetch cart count
    api.get('/user/cart')
      .then((res) => setCartCount(res.data.items?.length || 0))
      .catch((err) => console.error('Cart fetch error:', err));

    // Fetch wishlist and admin status
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/user/profile')
        .then((res) => setIsAdmin(res.data.isAdmin || false))
        .catch((err) => console.error('Profile fetch error:', err));
      api.get('/user/wishlist')
        .then((res) => {
          const wishlist = res.data.products || [];
          setIsWishlisted(wishlist.some((p) => p?._id === id));
        })
        .catch((err) => console.error('Wishlist fetch error:', err));
    }
  }, [id]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setIsSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const addToCart = () => {
    api.post('/user/cart', { productId: id, quantity: 1 })
      .then(() => {
        setCartCount(cartCount + 1);
        showSnackbar('Added to cart successfully!');
      })
      .catch((err) => {
        setError(err.response?.data?.msg || 'Add to cart failed!');
        showSnackbar('Failed to add to cart', 'error');
      });
  };

  const toggleWishlist = () => {
    const method = isWishlisted ? 'delete' : 'post';
    api[method]('/user/wishlist', { productId: id })
      .then(() => {
        setIsWishlisted(!isWishlisted);
        setError('');
        showSnackbar(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
      })
      .catch((err) => {
        setError(err.response?.data?.msg || 'Wishlist update failed!');
        showSnackbar('Wishlist update failed', 'error');
      });
  };

  const addReview = () => {
    if (!rating || !comment) {
      setError('Please provide both rating and comment');
      showSnackbar('Please provide both rating and comment', 'warning');
      return;
    }
    
    api.post('/user/review', { productId: id, rating, comment })
      .then((res) => {
        setReviews([...reviews, res.data]);
        setRating(0);
        setComment('');
        setError('');
        showSnackbar('Review submitted successfully!');
        
        // Refetch product to update numReviews and avgRating
        api.get(`/user/products/${id}`)
          .then((res) => setProduct(res.data.product || {}))
          .catch(() => {
            setError('Product refetch failed!');
            showSnackbar('Unable to refresh product details', 'error');
          });
      })
      .catch((err) => {
        setError(err.response?.data?.msg || 'Review submit failed!');
        showSnackbar('Failed to submit review', 'error');
      });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDiscount = () => {
    if (!product.actualPrice || !product.discountedPrice || product.actualPrice <= product.discountedPrice) {
      return 0;
    }
    return Math.round(((product.actualPrice - product.discountedPrice) / product.actualPrice) * 100);
  };

  const discountPercentage = calculateDiscount();

  return (
    <>
      <Navbar cartCount={cartCount} isAdmin={isAdmin} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 2,
            color: '#666',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
          }}
        >
          Back to products
        </Button>
        
        {error && (
          <Alert 
            severity="error" 
            variant="filled"
            sx={{ mb: 3, borderRadius: '8px' }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <Paper 
          elevation={2} 
          sx={{ 
            borderRadius: '16px', 
            overflow: 'hidden',
            mb: 4,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            bgcolor: '#fff',
          }}>
            {/* Product Image */}
            <Box 
              sx={{ 
                width: { xs: '100%', md: '45%' },
                position: 'relative',
                minHeight: '400px',
              }}
            >
              <img
                src={product.image || 'https://via.placeholder.com/500'}
                alt={product.name || 'Product'}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {discountPercentage > 0 && (
                <Chip
                  label={`${discountPercentage}% OFF`}
                  color="error"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                  }}
                />
              )}
              <IconButton 
                onClick={toggleWishlist}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': { 
                    bgcolor: 'white',
                    transform: 'scale(1.1)',
                  },
                }}
                size="large"
              >
                {isWishlisted ? 
                  <Favorite sx={{ color: '#f44336' }} /> : 
                  <FavoriteBorder sx={{ color: '#757575' }} />
                }
              </IconButton>
            </Box>

            {/* Product Details */}
            <Box 
              sx={{ 
                width: { xs: '100%', md: '55%' },
                p: { xs: 2, sm: 4 },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#212121',
                  mb: 1,
                  lineHeight: 1.2,
                }}
              >
                {product.name || 'Unnamed Product'}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  mt: 0.5,
                }}
              >
                <Rating 
                  value={product.avgRating || 0} 
                  readOnly 
                  precision={0.5} 
                  sx={{ color: '#FF9800' }} 
                />
                <Typography 
                  sx={{ 
                    ml: 1, 
                    color: '#757575', 
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {product.avgRating?.toFixed(1) || '0.0'}
                  <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
                  {product.numReviews || 0} reviews
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  ${product.discountedPrice?.toFixed(2) || '0.00'}
                  {product.actualPrice > product.discountedPrice && (
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: '#9e9e9e', 
                        textDecoration: 'line-through',
                        ml: 2,
                        fontSize: '1rem',
                      }}
                    >
                      ${product.actualPrice?.toFixed(2) || '0.00'}
                    </Typography>
                  )}
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#424242',
                  lineHeight: 1.7,
                  mb: 3,
                }}
              >
                {product.description || 'No description available'}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2, 
                  mt: 'auto',
                  mb: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={addToCart}
                  startIcon={<ShoppingBasket />}
                  fullWidth
                  size="large"
                  sx={{ 
                    bgcolor: '#4CAF50', 
                    color: 'white',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    textTransform: 'none',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    '&:hover': { 
                      bgcolor: '#3d8b40',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(76,175,80,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  onClick={toggleWishlist}
                  startIcon={isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
                  fullWidth
                  size="large"
                  sx={{ 
                    borderColor: isWishlisted ? '#f44336' : '#9e9e9e',
                    color: isWishlisted ? '#f44336' : '#757575',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    textTransform: 'none',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    '&:hover': { 
                      borderColor: isWishlisted ? '#d32f2f' : '#757575',
                      bgcolor: 'rgba(0,0,0,0.02)',
                    },
                  }}
                >
                  {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </Box>
              
              <Box sx={{ 
                mt: 2, 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: '#757575',
                  flex: 1,
                }}>
                  <LocalShipping sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">Free shipping on orders over $50</Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: '#757575',
                  flex: 1,
                }}>
                  <Shield sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">30-day money-back guarantee</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Reviews Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            borderRadius: '16px', 
            overflow: 'hidden',
            mb: 4,
            p: 3,
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: '#212121',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Star sx={{ mr: 1, color: '#FF9800' }} />
            Customer Reviews
            <Chip 
              label={`${product.numReviews || 0}`} 
              size="small" 
              sx={{ ml: 2, fontWeight: 600 }}
            />
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ mr: 2 }}>
              {product.avgRating?.toFixed(1) || '0.0'} out of 5
            </Typography>
            <Rating 
              value={product.avgRating || 0} 
              readOnly 
              precision={0.5} 
              sx={{ color: '#FF9800' }} 
            />
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {reviews.length === 0 ? (
            <Box sx={{ 
              p: 4, 
              bgcolor: '#f5f5f5', 
              borderRadius: '10px',
              textAlign: 'center',
              border: '1px dashed #e0e0e0',
            }}>
              <Typography sx={{ 
                color: '#757575',
                fontWeight: 500,
              }}>
                No reviews yet. Be the first to share your thoughts!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3 
            }}>
              {reviews.map((review) => (
                <Paper 
                  key={review._id} 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    bgcolor: '#fafafa', 
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#4CAF50',
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      {(review.user?.name?.[0] || 'A').toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#212121',
                        }}
                      >
                        {review.user?.name || 'Anonymous'}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#757575',
                        }}
                      >
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      <Rating 
                        value={review.rating || 0} 
                        readOnly 
                        size="small"
                        sx={{ color: '#FF9800' }} 
                      />
                    </Box>
                  </Box>
                  <Typography 
                    sx={{ 
                      color: '#424242',
                      lineHeight: 1.6, 
                      ml: 7,
                    }}
                  >
                    {review.comment || 'No comment'}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Paper>
 
        {/* Add Review Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            borderRadius: '16px', 
            p: 4, 
            bgcolor: '#fff',
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              color: '#212121',
              fontWeight: 700,
            }}
          >
            Write a Review
          </Typography>
          
          <Typography sx={{ mb: 1, color: '#616161', fontWeight: 500 }}>
            Your Rating
          </Typography>
          <Rating
            value={rating}
            onChange={(e, val) => setRating(val)}
            precision={0.5}
            sx={{ mb: 3, color: '#FF9800' }}
          />
          
          <TextField
            fullWidth
            label="Share your experience with this product"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={4}
            placeholder="What did you like or dislike? How was the quality? Would you recommend it to others?"
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: '#fafafa',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4CAF50',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4CAF50',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4CAF50',
              },
            }}
          />
          
          <Button
            variant="contained"
            onClick={addReview}
            size="large"
            sx={{ 
              bgcolor: '#4CAF50',
              borderRadius: '8px',
              padding: '12px 36px',
              textTransform: 'none',
              fontWeight: 600,
              letterSpacing: 0.5,
              '&:hover': { 
                bgcolor: '#3d8b40',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(76,175,80,0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Submit Review
          </Button>
        </Paper>
      </Container>
 
      <Snackbar 
        open={isSnackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
 };
 
 export default Product;