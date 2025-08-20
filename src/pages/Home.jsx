import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Divider, 
  Skeleton, 
  Paper,
  Button,
  useMediaQuery,
  useTheme,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Rating,
  IconButton
} from '@mui/material';
import Footer from '../components/Footer';
import { ShoppingBasket, LocalOffer, ThumbUp, Favorite } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom CSS to override react-toastify styles
const toastStyles = `
  .Toastify__toast {
    border-radius: 8px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.1);
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    padding: 12px 20px;
    min-height: 50px;
  }
  .Toastify__toast--success {
    background-color: #E8F5E9;
    color: #4CAF50;
  }
  .Toastify__toast--error {
    background-color: #FFEBEE;
    color: #F44336;
  }
  .Toastify__progress-bar {
    height: 4px;
    border-radius: 2px;
    background-color: #4CAF50; /* Green for success */
  }
  .Toastify__toast--error .Toastify__progress-bar {
    background-color: #F44336; /* Red for error */
  }
  .Toastify__close-button {
    color: #757575;
    opacity: 0.8;
  }
  .Toastify__close-button:hover {
    color: #333333;
    opacity: 1;
  }
`;

// Inject custom styles into the document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = toastStyles;
document.head.appendChild(styleSheet);

const CategorySection = ({ title, products, updateCartCount, updateWishlistCount }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (productId, productName, e) => {
    e.stopPropagation();
    try {
      const res = await api.post('/user/cart', { productId, quantity: 1 });
      updateCartCount(res.data.items?.length || 0);
      toast.success(`${productName} added to cart!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Add to Cart Error:', err.response?.data || err.message);
      toast.error('Failed to add to cart—check console!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleAddToWishlist = async (productId, productName, e) => {
    e.stopPropagation();
    try {
      const res = await api.post('/user/wishlist', { productId });
      const wishlistRes = await api.get('/user/wishlist');
      updateWishlistCount(wishlistRes.data.items?.length || 0);
      toast.success(`${productName} added to wishlist!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Add to Wishlist Error:', err.response?.data || err.message);
      toast.error('Failed to add to wishlist—check console!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 600, 
          color: '#333333',
          fontFamily: "'Montserrat', sans-serif",
          mb: 3,
        }}
      >
        {title}
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          overflowX: 'auto', 
          pb: 2,
          '&::-webkit-scrollbar': { height: '8px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#4CAF50', borderRadius: '4px' },
        }}
      >
        {products
          .filter((product) => product.stock > 0)
          .map((product) => (
            <Card
              key={product._id}
              onClick={() => handleCardClick(product._id)}
              sx={{
                minWidth: isMobile ? 220 : 280,
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                boxShadow: '0 3px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                overflow: 'hidden',
                border: '1px solid #f0f0f0',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height={isMobile ? "160" : "200"}
                  image={product.image || 'https://via.placeholder.com/280x200'}
                  alt={product.name}
                  sx={{ 
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                />
                {product.actualPrice > product.discountedPrice && (
                  <Box sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    bgcolor: '#FF3D00',
                    color: 'white',
                    py: 0.5,
                    px: 1.5,
                    borderRadius: '20px',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    boxShadow: '0 2px 8px rgba(255,61,0,0.3)',
                  }}>
                    {Math.round((1 - product.discountedPrice / product.actualPrice) * 100)}% OFF
                  </Box>
                )}
              </Box>
              <CardContent sx={{ p: 2.5 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    fontFamily: "'Montserrat', sans-serif",
                    color: '#222222',
                    mb: 1.2,
                    fontSize: '1.15rem',
                    lineHeight: 1.3,
                    height: '2.6rem',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Rating 
                    value={product.avgRating || 0} 
                    readOnly 
                    precision={0.5} 
                    sx={{ color: '#FF9800', fontSize: '1rem' }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: 1, 
                      color: '#757575', 
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 500
                    }}
                  >
                    ({product.numReviews || 0})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#4CAF50', 
                      fontWeight: 700,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '1.25rem',
                    }}
                  >
                    ${product.discountedPrice?.toFixed(2)}
                  </Typography>
                  {product.actualPrice > product.discountedPrice && (
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: '#9E9E9E', 
                        textDecoration: 'line-through',
                        fontSize: '0.95rem',
                        fontWeight: 400,
                      }}
                    >
                      ${product.actualPrice?.toFixed(2)}
                    </Typography>
                  )}
                </Box>
              </CardContent>
              <Divider sx={{ opacity: 0.6 }} />
              <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<ShoppingBasket />}
                  onClick={(e) => handleAddToCart(product._id, product.name, e)}
                  sx={{
                    bgcolor: '#4CAF50',
                    color: 'white',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    borderRadius: '30px',
                    px: 2.5,
                    py: 1,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    flexGrow: 1,
                    '&:hover': {
                      bgcolor: '#43A047',
                      boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Add to Cart
                </Button>
                <IconButton
                  onClick={(e) => handleAddToWishlist(product._id, product.name, e)}
                  sx={{
                    color: '#FF9800',
                    '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.08)' },
                  }}
                >
                  <Favorite />
                </IconButton>
              </CardActions>
            </Card>
          ))}
      </Box>
    </>
  );
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({}); 
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await api.get('/user/categories');
        const fetchedCategories = categoriesRes.data || [];
        setCategories(fetchedCategories);

        const productsByCategory = {};
        for (const category of fetchedCategories) {
          try {
            const productsRes = await api.get(`/user/products/category/${category.name}`, {
              params: { limit: 10 },
            });
            productsByCategory[category.name] = productsRes.data.products || [];
          } catch (catErr) {
            console.error(`Error fetching ${category.name}:`, catErr.response?.data || catErr.message);
          }
        }
        setCategoryProducts(productsByCategory);

        const recommendedRes = await api.get('/user/recommendations');
        setRecommendedProducts(recommendedRes.data || []);

        const cartRes = await api.get('/user/cart');
        setCartCount(cartRes.data.items?.length || 0);

        const token = localStorage.getItem('token');
        if (token) {
          const profileRes = await api.get('/user/profile');
          setIsAdmin(profileRes.data.isAdmin || false);

          const wishlistRes = await api.get('/user/wishlist');
          setWishlistCount(wishlistRes.data.items?.length || 0);
        }
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load home page—check console!');
        console.error('Home Fetch Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchedProducts([]);
      return;
    }
    try {
      const res = await api.get('/user/search', { params: { q: query } });
      setSearchedProducts(res.data.products || []);
    } catch (err) {
      console.error('Search Error:', err.response?.data || err.message);
      setError('Failed to search products—check console!');
      setSearchedProducts([]);
    }
  };

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  const updateWishlistCount = (newCount) => {
    setWishlistCount(newCount);
  };

  const discountedProducts = Object.values(categoryProducts)
    .flat()
    .filter((p) => p.discountedPrice < p.actualPrice && p.stock > 0);

  return (
    <>
      <Navbar cartCount={cartCount} wishlistCount={wishlistCount} isAdmin={isAdmin} onSearch={handleSearch} />
      <Container maxWidth="xl" sx={{ mt: 3, mb: 8 }}>
        {loading ? (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={isMobile ? 200 : 400} 
            sx={{ borderRadius: 3, mb: 4 }} 
          />
        ) : (
          <Paper 
            elevation={0}
            sx={{
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              mb: 6,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Typography 
                variant="h1" 
                sx={{
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  fontWeight: 700,
                  color: '#fff',
                  fontFamily: "'Montserrat', sans-serif",
                  mb: 2,
                  textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                }}
              >
                Fresh Picks Daily
              </Typography>
              <Typography 
                variant="h6" 
                sx={{
                  color: '#fff',
                  fontFamily: "'Open Sans', sans-serif",
                  mb: 3,
                  maxWidth: '600px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                Quality groceries delivered to your doorstep
              </Typography>
              <Button 
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#4CAF50',
                  color: 'white',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
                  '&:hover': {
                    bgcolor: '#43A047',
                    boxShadow: '0 6px 14px rgba(76,175,80,0.6)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Shop Now
              </Button>
            </Box>
            <img
              src="/assets/banner.jpg"
              alt="D'Store Banner"
              style={{
                width: '100%',
                height: isMobile ? '280px' : '500px',
                objectFit: 'cover',
              }}
              onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')}
            />
          </Paper>
        )}

        {error && (
          <Paper 
            elevation={0}
            sx={{ 
              mb: 4, 
              bgcolor: '#FFF3E0', 
              p: 2, 
              borderRadius: 2,
              border: '1px solid #FFE0B2' 
            }}
          >
            <Typography color="#E65100" sx={{ fontFamily: "'Open Sans', sans-serif" }}>
              {error}
            </Typography>
          </Paper>
        )}

        {searchedProducts.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: '#333333',
                fontFamily: "'Montserrat', sans-serif",
                mb: 3,
              }}
            >
              Search Results
            </Typography>
            <CategorySection 
              title="Search Results" 
              products={searchedProducts} 
              updateCartCount={updateCartCount} 
              updateWishlistCount={updateWishlistCount} 
            />
            <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.06)', opacity: 0.6 }} />
          </Box>
        )}

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: 3,
            mb: 6,
          }}
        >
          {[
            { icon: <ShoppingBasket sx={{ color: '#4CAF50', fontSize: 40 }} />, title: 'Fresh Products', desc: 'Quality groceries sourced from local farms' },
            { icon: <LocalOffer sx={{ color: '#FF9800', fontSize: 40 }} />, title: 'Best Deals', desc: 'Special discounts and offers every day' },
            { icon: <ThumbUp sx={{ color: '#2196F3', fontSize: 40 }} />, title: 'Fast Delivery', desc: 'Get your groceries delivered in minutes' }
          ].map((feature, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                borderRadius: 3,
                bgcolor: '#F9F9F9',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 6px 15px rgba(0,0,0,0.08)' }
              }}
            >
              {feature.icon}
              <Typography 
                variant="h6" 
                sx={{ mt: 2, mb: 1, fontWeight: 600, fontFamily: "'Montserrat', sans-serif" }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: '#757575', fontFamily: "'Open Sans', sans-serif" }}
              >
                {feature.desc}
              </Typography>
            </Paper>
          ))}
        </Box>

        {loading ? (
          [...Array(3)].map((_, index) => (
            <Box key={index} sx={{ mb: 6 }}>
              <Skeleton width={200} height={40} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} variant="rectangular" width={260} height={320} sx={{ borderRadius: 3 }} />
                ))}
              </Box>
              <Divider sx={{ my: 4 }} />
            </Box>
          ))
        ) : (
          categories.map((category) => (
            <Box key={category._id} sx={{ mb: 6 }}>
              <CategorySection
                title={category.name}
                products={categoryProducts[category.name] || []}
                updateCartCount={updateCartCount}
                updateWishlistCount={updateWishlistCount}
              />
              <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.06)', opacity: 0.6 }} />
            </Box>
          ))
        )}

        {discountedProducts.length > 0 && !loading && (
          <Box sx={{ mb: 6 }}>
            <Paper 
              elevation={0}
              sx={{ 
                bgcolor: '#FFF8E1', 
                p: 2, 
                mb: 3, 
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <LocalOffer sx={{ color: '#FF9800', fontSize: 32 }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#FF9800',
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Special Deals for You
              </Typography>
            </Paper>
            <CategorySection 
              title="Hot Deals" 
              products={discountedProducts} 
              updateCartCount={updateCartCount} 
              updateWishlistCount={updateWishlistCount} 
            />
            <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.06)', opacity: 0.6 }} />
          </Box>
        )}

        {recommendedProducts.length > 0 && !loading && (
          <Box sx={{ mb: 6 }}>
            <Paper 
              elevation={0}
              sx={{ 
                bgcolor: '#E8F5E9', 
                p: 2, 
                mb: 3, 
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <ThumbUp sx={{ color: '#4CAF50', fontSize: 32 }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#4CAF50',
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Recommended for You
              </Typography>
            </Paper>
            <CategorySection 
              title="Recommended for You" 
              products={recommendedProducts.filter((p) => p.stock > 0)} 
              updateCartCount={updateCartCount} 
              updateWishlistCount={updateWishlistCount} 
            />
          </Box>
        )}
        <Footer />
      </Container>
      <ToastContainer />
    </>
  );
};

export default Home;