import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, CircularProgress, Divider, Card, CardContent,
  Chip, Button, alpha
} from '@mui/material';
import { LocalShipping, LocationOn, CreditCard, ShoppingBag, Receipt } from '@mui/icons-material';
import api from '../api';
import Navbar from '../components/Navbar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    api.get('/user/cart')
      .then((res) => setCartCount(res.data.items?.length || 0))
      .catch((err) => console.error('Cart fetch error:', err));
    
    api.get('/user/profile')
      .then((res) => setIsAdmin(res.data.isAdmin || false))
      .catch((err) => console.error('Profile fetch error:', err));
    
    const fetchOrders = async () => {
      try {
        const res = await api.get('/user/orders');
        console.log('Orders Data:', res.data);
        setOrders(res.data.orders || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load orders—check console!');
        console.error('Orders Fetch Error:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered':
        return '#4CAF50';
      case 'Shipped':
        return '#2196F3';
      case 'Pending':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered':
        return <Receipt fontSize="small" />;
      case 'Shipped':
        return <LocalShipping fontSize="small" />;
      case 'Pending':
        return <ShoppingBag fontSize="small" />;
      default:
        return <ShoppingBag fontSize="small" />;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar cartCount={cartCount} isAdmin={isAdmin} />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '60vh'
        }}>
          <CircularProgress sx={{ color: '#4CAF50', mb: 3 }} />
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: '"Open Sans", sans-serif',
              color: '#757575',
              fontWeight: 500
            }}
          >
            Loading your orders...
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar cartCount={cartCount} isAdmin={isAdmin} />
      <Container sx={{ mt: 5, mb: 6 }}>
        {error && (
          <Box sx={{ 
            mb: 4, 
            p: 3, 
            bgcolor: '#FDECEA', 
            borderRadius: '12px',
            border: '1px solid #FDCDC8',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: '#FFF0EF'
            }}>
              <Typography color="error" variant="h5">!</Typography>
            </Box>
            <Typography 
              color="error" 
              sx={{ 
                fontFamily: '"Open Sans", sans-serif',
                fontWeight: 500
              }}
            >
              {error}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 5,
          pb: 2,
          borderBottom: '3px solid #f0f0f0'
        }}>
          <ShoppingBag sx={{ fontSize: 32, color: '#4CAF50', mr: 2 }} />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#333333',
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            Your Orders
          </Typography>
        </Box>
        
        {orders.length === 0 ? (
          <Box sx={{ 
            p: 6, 
            bgcolor: '#F9F9F9', 
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px dashed #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}>
            <Box sx={{ 
              width: 100, 
              height: 100, 
              borderRadius: '50%', 
              bgcolor: alpha('#4CAF50', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingBag sx={{ fontSize: 50, color: '#4CAF50' }} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#555555',
                fontFamily: '"Open Sans", sans-serif',
                fontWeight: 500
              }}
            >
              You haven't placed any orders yet
            </Typography>
            <Button
              variant="contained"
              href="/"
              sx={{ 
                bgcolor: '#4CAF50',
                borderRadius: '50px',
                padding: '12px 32px',
                textTransform: 'none',
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                mt: 2,
                '&:hover': { 
                  bgcolor: '#3d8b40',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Browse Products
            </Button>
          </Box>
        ) : (
          orders.map((order) => (
            <Card 
              key={order._id} 
              sx={{ 
                mb: 4, 
                boxShadow: '0 3px 15px rgba(0,0,0,0.07)', 
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid #f5f5f5',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ 
                p: 2.5, 
                bgcolor: alpha(getStatusColor(order.status), 0.05), 
                borderBottom: `1px solid ${alpha(getStatusColor(order.status), 0.2)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: '#555555',
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: '0.95rem',
                      fontWeight: 600
                    }}
                  >
                    Order #{order._id?.substring(order._id.length - 8).toUpperCase() || 'N/A'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#757575',
                      fontFamily: '"Open Sans", sans-serif',
                    }}
                  >
                    Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    }) : 'Unknown'}
                  </Typography>
                </Box>
                <Chip
                  icon={getStatusIcon(order.status)}
                  label={order.status || 'Pending'}
                  sx={{ 
                    fontWeight: 600,
                    color: 'white',
                    bgcolor: getStatusColor(order.status),
                    borderRadius: '50px',
                    padding: '4px 8px',
                    fontFamily: '"Montserrat", sans-serif',
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                {/* Products */}
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2.5, 
                      color: '#333333',
                      fontFamily: '"Montserrat", sans-serif',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      paddingBottom: 1.5,
                      borderBottom: '2px solid #f0f0f0'
                    }}
                  >
                    <ShoppingBag fontSize="small" sx={{ color: '#4CAF50' }} />
                    Items ({(order.items || []).length})
                  </Typography>
                  
                  {(order.items || []).map((item, index) => (
                    <Box 
                      key={item.product?._id || item._id || Math.random()} 
                      sx={{ 
                        mb: index === (order.items || []).length - 1 ? 0 : 2.5, 
                        p: 2.5,
                        bgcolor: '#F9F9F9',
                        borderRadius: '12px',
                        display: 'flex',
                        gap: 3,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        },
                      }}
                    >
                      <Box sx={{ 
                        width: 90, 
                        height: 90, 
                        minWidth: 90,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={item.product?.image || 'https://via.placeholder.com/100'}
                          alt={item.product?.name || 'Product'}
                          style={{ 
                            width: '100%', 
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#333333',
                            fontFamily: '"Montserrat", sans-serif',
                            mb: 0.5,
                            fontSize: '1rem'
                          }}
                        >
                          {item.product?.name || 'Unknown Product'}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          mt: 1
                        }}>
                          <Chip 
                            label={`Qty: ${item.quantity || 1}`}
                            size="small"
                            sx={{ 
                              bgcolor: alpha('#4CAF50', 0.1),
                              color: '#4CAF50',
                              fontWeight: 500,
                              fontFamily: '"Open Sans", sans-serif',
                            }}
                          />
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 700,
                              color: '#4CAF50',
                              fontFamily: '"Montserrat", sans-serif',
                              fontSize: '1.1rem'
                            }}
                          >
                            ${((item.product?.discountedPrice || item.product?.actualPrice || 0) * (item.quantity || 1)).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Order Details - Restructured for better format */}
                <Box sx={{ 
                  borderRadius: '14px',
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden',
                  mb: 4
                }}>
                  {/* Header */}
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: '#f5f5f5', 
                    borderBottom: '1px solid #e0e0e0',
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 600,
                        color: '#333333',
                      }}
                    >
                      Order Details
                    </Typography>
                  </Box>
                  
                  {/* Details Content */}
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                    {/* Shipping Address */}
                    <Box sx={{ 
                      flex: 1, 
                      p: 3,
                      borderRight: { xs: 'none', md: '1px solid #e0e0e0' },
                      borderBottom: { xs: '1px solid #e0e0e0', md: 'none' }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,
                        gap: 1.5
                      }}>
                        <LocationOn sx={{ color: '#4CAF50' }} />
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 600,
                            color: '#333333',
                          }}
                        >
                          Shipping Address
                        </Typography>
                      </Box>
                      <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#333333',
                            fontFamily: '"Open Sans", sans-serif',
                            lineHeight: 1.8,
                            ml: 4.5 // Align with the icon
                          }}
                      >
                        {order.address ? (
                          <>
                            <strong>{order.address.name || 'Recipient'}</strong><br />
                            {order.address.street || ''}<br />
                            {order.address.city || ''}, {order.address.state || ''} {order.address.zip || ''}<br />
                            {order.address.country || ''}
                          </>
                        ) : 'No address provided'}
                      </Typography>
                    </Box>
                    
                    {/* Payment Information */}
                    <Box sx={{ 
                      flex: 1, 
                      p: 3 
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,
                        gap: 1.5
                      }}>
                        <CreditCard sx={{ color: '#4CAF50' }} />
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 600,
                            color: '#333333',
                          }}
                        >
                          Payment Information
                        </Typography>
                      </Box>
                      
                      <Box sx={{ ml: 4.5 }}>
                        <Box sx={{ mb: 2 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: '"Open Sans", sans-serif',
                              color: '#757575',
                              mb: 0.5
                            }}
                          >
                            Payment Method:
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontFamily: '"Open Sans", sans-serif',
                              fontWeight: 500
                            }}
                          >
                            {order.paymentMethod || 'Not specified'}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: '"Open Sans", sans-serif',
                              color: '#757575',
                              mb: 0.5
                            }}
                          >
                            Total Amount:
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontFamily: '"Montserrat", sans-serif',
                              fontWeight: 700,
                              color: '#4CAF50'
                            }}
                          >
                            ${order.total?.toFixed(2) || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                
                {/* Tracking Information */}
                {order.trackingNumber && (
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: alpha('#2196F3', 0.08),
                    borderRadius: '12px',
                    border: '1px solid rgba(33, 150, 243, 0.2)',
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 1
                    }}>
                      <Box sx={{ 
                        bgcolor: alpha('#2196F3', 0.15), 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <LocalShipping sx={{ color: '#2196F3' }} />
                      </Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontFamily: '"Montserrat", sans-serif',
                          fontWeight: 600,
                          color: '#2196F3'
                        }}
                      >
                        Tracking Information
                      </Typography>
                    </Box>
                    
                    <Box sx={{ ml: 7 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Open Sans", sans-serif',
                          color: '#555555',
                          mb: 0.5
                        }}
                      >
                        Tracking Number:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: '"Montserrat", sans-serif',
                          fontWeight: 600,
                          color: '#2196F3',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {order.trackingNumber}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Container>
    </>
  );
};

export default Orders;