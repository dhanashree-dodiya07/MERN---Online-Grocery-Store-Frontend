import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, TextField, Select, MenuItem, Card, CardMedia, Divider, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../components/Navbar';
import api from '../api';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/user/cart')
      .then((res) => setCart(res.data))
      .catch((err) => setError('Cart fetch failed!'));
    api.get('/user/profile')
      .then((res) => setAddresses(res.data.addresses || []))
      .catch((err) => setError('Addresses fetch failed!'));
  }, []);

  const updateQuantity = (productId, quantity) => {
    const newQuantity = Math.max(0, parseInt(quantity) || 0);
    const product = cart.items.find(item => item.product._id === productId);

    if (product.product.stock <= 0) {
      setError(`${product.product.name} is out of stock`);
      return;
    } else if (newQuantity > product.product.stock) {
      setError(`Only ${product.product.stock} ${product.product.name} available in stock`);
      return;
    }

    api.post('/user/cart', { productId, quantity: newQuantity })
      .then((res) => {
        setCart(res.data);
        setError('');
      })
      .catch((err) => setError(err.response?.data.msg || 'Update cart failed!'));
  };

  const removeFromCart = (productId) => {
    api.post('/user/cart', { productId, quantity: 0 })
      .then((res) => {
        setCart(res.data);
        setError('');
      })
      .catch((err) => setError(err.response?.data.msg || 'Failed to remove item from cart'));
  };

  const incrementQuantity = (productId) => {
    const product = cart.items.find(item => item.product._id === productId);
    const newQuantity = product.quantity + 1;
    updateQuantity(productId, newQuantity);
  };

  const decrementQuantity = (productId) => {
    const product = cart.items.find(item => item.product._id === productId);
    const newQuantity = product.quantity - 1;
    updateQuantity(productId, newQuantity);
  };

  const applyCoupon = () => {
    if (!couponCode) return setError('Enter a coupon code first!');
    api.post('/user/coupon', { couponCode })
      .then((res) => {
        setDiscount(res.data.discount);
        setError('');
      })
      .catch((err) => setError(err.response?.data.msg || 'Invalid coupon!'));
  };

  const placeOrder = () => {
    if (!selectedAddress) return setError('Please select a delivery address');
    if (cart.items.length === 0) return setError('Your cart is empty');
    const orderData = { addressId: selectedAddress, paymentMethod, couponCode: couponCode || undefined };
    api.post('/user/order', orderData)
      .then((res) => {
        setCart({ items: [] });
        setCouponCode('');
        setDiscount(0);
        navigate('/orders');
      })
      .catch((err) => setError(err.response?.data.msg || 'Order failed!'));
  };

  const subtotal = cart.items.reduce((sum, item) => sum + item.product.discountedPrice * item.quantity, 0);
  const total = discount ? subtotal - (subtotal * discount) / 100 : subtotal;

  return (
    <>
      <Navbar cartCount={cart.items.length} isAdmin={false} />
      <Container 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          mt: 4, 
          mb: 4,
          fontFamily: '"Open Sans", sans-serif',
          backgroundColor: '#F9F9F9',
          borderRadius: '12px',
          p: { xs: 2, md: 3 }
        }}
      >
        {/* Left: Cart Items */}
        <Box sx={{ flex: 3, pr: { xs: 0, md: 3 }, mb: { xs: 3, md: 0 } }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3, 
              fontWeight: 700, 
              color: '#333333',
              fontFamily: '"Montserrat", sans-serif'
            }}
          >
            Shopping Cart
          </Typography>
          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mb: 2, 
                bgcolor: '#FFEBEE', 
                p: 1.5, 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {error}
            </Typography>
          )}
          {cart.items.length === 0 ? (
            <Typography sx={{ color: '#757575', fontStyle: 'italic', py: 4, textAlign: 'center' }}>
              Your cart is empty. Discover fresh groceries waiting for you!
            </Typography>
          ) : (
            cart.items.map((item) => (
              <Card
                key={item.product._id}
                sx={{
                  display: 'flex',
                  mb: 2.5,
                  p: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  borderRadius: '12px',
                  bgcolor: '#fff',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  image={item.product.image || 'https://via.placeholder.com/120'}
                  alt={item.product.name}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    objectFit: 'contain', 
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5'
                  }}
                />
                <Box sx={{ flex: 1, pl: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333333',
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: '1rem'
                    }}
                  >
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: '#757575' }}>
                    Stock: {item.product.stock > 0 ? item.product.stock : 'Out of stock'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: '#4CAF50', fontWeight: 500 }}>
                    ${item.product.discountedPrice.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={() => decrementQuantity(item.product._id)}
                      disabled={item.quantity <= 1 || item.product.stock <= 0}
                      sx={{
                        color: '#FF5722',
                        backgroundColor: '#FFF3E0',
                        border: '1px solid #FFE0B2',
                        borderRadius: '8px',
                        width: '36px',
                        height: '36px',
                        '&:hover': { 
                          backgroundColor: '#FFE0B2', 
                          color: '#D32F2F' 
                        },
                        '&.Mui-disabled': { 
                          color: '#B0BEC5',
                          backgroundColor: '#F5F5F5',
                          border: '1px solid #E0E0E0'
                        }
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography 
                      sx={{ 
                        mx: 2, 
                        fontWeight: 600, 
                        width: '40px', 
                        textAlign: 'center',
                        color: '#333333',
                        fontSize: '1rem'
                      }}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => incrementQuantity(item.product._id)}
                      disabled={item.quantity >= item.product.stock}
                      sx={{
                        color: '#4CAF50',
                        backgroundColor: '#E8F5E9',
                        border: '1px solid #C8E6C9',
                        borderRadius: '8px',
                        width: '36px',
                        height: '36px',
                        '&:hover': { 
                          backgroundColor: '#C8E6C9', 
                          color: '#388E3C' 
                        },
                        '&.Mui-disabled': { 
                          color: '#B0BEC5',
                          backgroundColor: '#F5F5F5',
                          border: '1px solid #E0E0E0'
                        }
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ fontWeight: 'bold', color: '#333333', mx: 2 }}>
                      ${(item.product.discountedPrice * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton
                      onClick={() => removeFromCart(item.product._id)}
                      sx={{
                        color: '#FF5722',
                        '&:hover': { color: '#D32F2F' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            ))
          )}
        </Box>

        {/* Right: Checkout Summary */}
        {cart.items.length > 0 && (
          <Box
            sx={{
              width: { xs: '100%', md: 320 },
              p: 3,
              bgcolor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              border: '1px solid #e0e0e0',
              position: 'sticky',
              top: '20px',
              alignSelf: 'flex-start'
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 2, 
                fontWeight: 700, 
                color: '#333333',
                fontFamily: '"Montserrat", sans-serif' 
              }}
            >
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ display: 'flex', justifyContent: 'space-between', color: '#757575', mb: 1 }}>
                <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
              </Typography>
              {discount > 0 && (
                <Typography sx={{ display: 'flex', justifyContent: 'space-between', color: '#4CAF50', mb: 1 }}>
                  <span>Discount:</span> <span>-${((subtotal * discount) / 100).toFixed(2)}</span>
                </Typography>
              )}
              <Typography 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontWeight: 'bold', 
                  mt: 2, 
                  color: '#333333',
                  fontSize: '1.1rem'
                }}
              >
                <span>Total:</span> <span>${total.toFixed(2)}</span>
              </Typography>
            </Box>
            <TextField
              label="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              fullWidth
              sx={{ 
                mb: 2, 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                  '&:hover fieldset': { borderColor: '#4CAF50' },
                  '&.Mui-focused fieldset': { borderColor: '#4CAF50' }
                }
              }}
            />
            <Button
              variant="outlined"
              onClick={applyCoupon}
              fullWidth
              sx={{ 
                mb: 3, 
                borderColor: '#FF9800', 
                color: '#FF9800', 
                borderRadius: '24px',
                py: 1,
                '&:hover': { 
                  bgcolor: 'rgba(255, 152, 0, 0.08)',
                  borderColor: '#FF9800'
                } 
              }}
            >
              Apply Coupon
            </Button>
            <Select
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ 
                mb: 2, 
                borderRadius: '24px',
                '& .MuiOutlinedInput-notchedOutline': { borderRadius: '24px' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4CAF50' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4CAF50' }
              }}
            >
              <MenuItem value="">Select Delivery Address</MenuItem>
              {addresses.map((addr) => (
                <MenuItem key={addr._id} value={addr._id}>
                  <Typography noWrap sx={{ maxWidth: 250, fontFamily: '"Open Sans", sans-serif' }}>
                    {`${addr.street}, ${addr.city}`}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              fullWidth
              sx={{ 
                mb: 3, 
                borderRadius: '24px',
                '& .MuiOutlinedInput-notchedOutline': { borderRadius: '24px' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4CAF50' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4CAF50' }
              }}
            >
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="PayPal">PayPal</MenuItem>
             <MenuItem value="Pay on Delivery">Pay on Delivery</MenuItem>
             <MenuItem value="Cash">Cash</MenuItem>
           </Select>
           <Button
             variant="contained"
             onClick={placeOrder}
             fullWidth
             sx={{
               bgcolor: '#4CAF50',
               py: 1.5,
               fontSize: '1rem',
               fontWeight: 600,
               borderRadius: '24px',
               boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
               transition: 'all 0.2s ease',
               '&:hover': { 
                 bgcolor: '#43A047',
                 boxShadow: '0 6px 14px rgba(76, 175, 80, 0.3)',
                 transform: 'translateY(-2px)'
               }
             }}
           >
             Place Order
           </Button>
         </Box>
       )}
     </Container>
   </>
 );
};

export default Cart;