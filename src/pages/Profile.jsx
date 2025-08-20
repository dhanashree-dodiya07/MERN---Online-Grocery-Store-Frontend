import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Card, Divider, IconButton, Grid } from '@mui/material';
import { Edit, Delete, Lock, LocationOn, Person } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import api from '../api';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', addresses: [] });
  const [password, setPassword] = useState({ oldPassword: '', newPassword: '' });
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: '' });
  const [editAddress, setEditAddress] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/user/profile')
      .then((res) => {
        console.log('Profile Response:', res.data); // Log the full response
        setProfile({ ...res.data, addresses: res.data.addresses || [] });
        setIsAdmin(res.data.isAdmin);
      })
      .catch((err) => setError('Profile fetch failed!'));
    api.get('/user/cart')
      .then((res) => setCartCount(res.data.items.length))
      .catch((err) => console.error('Cart fetch error:', err));
  }, []);

  const updatePassword = () => {
    if (!password.oldPassword || !password.newPassword) return setError('Fill out both password fields, bro!');
    api.put('/user/password', password)
      .then(() => {
        setPassword({ oldPassword: '', newPassword: '' });
        setError('');
        alert('Password updated—galactic security on lock!');
      })
      .catch((err) => setError(err.response?.data.msg || 'Password update failed!'));
  };

  const addAddress = () => {
    if (!address.street || !address.city || !address.state || !address.zip || !address.country) {
      return setError('Fill out all address fields, dude!');
    }
    console.log('Adding Address:', address); // Log what's being sent
    api.post('/user/address', address)
      .then((res) => {
        console.log('Add Address Response:', res.data); // Log the response
        setProfile({ ...profile, addresses: [...profile.addresses, res.data] });
        setAddress({ street: '', city: '', state: '', zip: '', country: '' });
        setError('');
      })
      .catch((err) => setError(err.response?.data.msg || 'Address add failed!'));
  };

  const editAddressHandler = (addr) => {
    console.log('Editing Address:', addr); // Log the address being edited
    setEditAddress(addr);
    setAddress({
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zip: addr.zip || '',
      country: addr.country || '',
    });
  };

  const updateAddress = () => {
    if (!editAddress) return;
    console.log('Updating Address:', address); // Log what's being sent
    api.put(`/user/address/${editAddress._id}`, address)
      .then((res) => {
        console.log('Update Address Response:', res.data); // Log the response
        setProfile({
          ...profile,
          addresses: profile.addresses.map((a) => (a._id === editAddress._id ? res.data : a)),
        });
        setAddress({ street: '', city: '', state: '', zip: '', country: '' });
        setEditAddress(null);
        setError('');
      })
      .catch((err) => setError(err.response?.data.msg || 'Address update failed!'));
  };

  const deleteAddress = (id) => {
    api.delete(`/user/address/${id}`)
      .then(() => {
        setProfile({ ...profile, addresses: profile.addresses.filter((a) => a._id !== id) });
        setError('');
      })
      .catch((err) => setError(err.response?.data.msg || 'Address delete failed!'));
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
          Your Profile
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

        {/* Profile Info */}
        <Card sx={{ 
          p: 3, 
          mb: 4, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
          borderRadius: '12px',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ color: '#4CAF50', mr: 1 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: '#333333',
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              Personal Information
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 0.5, 
                  color: '#757575',
                  fontFamily: '"Open Sans", sans-serif',
                  fontWeight: 500,
                }}
              >
                Name
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#333333',
                  fontFamily: '"Open Sans", sans-serif',
                  fontWeight: 600,
                }}
              >
                {profile.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 0.5, 
                  color: '#757575',
                  fontFamily: '"Open Sans", sans-serif',
                  fontWeight: 500,
                }}
              >
                Email
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#333333',
                  fontFamily: '"Open Sans", sans-serif',
                  fontWeight: 600,
                }}
              >
                {profile.email}
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* Password Update */}
        <Card sx={{ 
          p: 3, 
          mb: 4, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
          borderRadius: '12px',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Lock sx={{ color: '#4CAF50', mr: 1 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: '#333333',
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              Security
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 2, 
              color: '#333333',
              fontFamily: '"Open Sans", sans-serif',
            }}
          >
            Update your password to keep your account secure
          </Typography>
          
          <TextField
            label="Old Password"
            type="password"
            value={password.oldPassword}
            onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
            fullWidth
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                fontFamily: '"Open Sans", sans-serif',
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
          <TextField
            label="New Password"
            type="password"
            value={password.newPassword}
            onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
            fullWidth
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                fontFamily: '"Open Sans", sans-serif',
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
            onClick={updatePassword}
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
          >
            Update Password
          </Button>
        </Card>

        {/* Addresses */}
        <Card sx={{ 
          p: 3, 
          mb: 4, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
          borderRadius: '12px',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn sx={{ color: '#4CAF50', mr: 1 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: '#333333',
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              Delivery Addresses
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          {profile.addresses.length === 0 ? (
            <Box sx={{ 
              p: 3, 
              bgcolor: '#F9F9F9', 
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px dashed #e0e0e0',
              mb: 2,
            }}>
              <Typography sx={{ 
                color: '#757575',
                fontFamily: '"Open Sans", sans-serif', 
              }}>
                No addresses yet—add one below!
              </Typography>
            </Box>
          ) : (
            profile.addresses.map((addr) => (
              <Box 
                key={addr._id} 
                sx={{ 
                  mb: 2, 
                  p: 2,
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  bgcolor: '#F9F9F9',
                  borderRadius: '12px',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  },
                }}
              >
                <Typography sx={{ 
                  color: '#333333',
                  fontFamily: '"Open Sans", sans-serif',
                }}>
                  {`${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}`}
                </Typography>
                <Box>
                  <IconButton 
                    onClick={() => editAddressHandler(addr)} 
                    sx={{ 
                      color: '#FF9800',
                      '&:hover': {
                        bgcolor: 'rgba(255, 152, 0, 0.1)',
                      },
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => deleteAddress(addr._id)} 
                    sx={{ 
                      color: '#757575',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.05)',
                        color: '#f44336',
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Card>

        {/* Add/Edit Address */}
        <Card sx={{ 
          p: 3, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
          borderRadius: '12px',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2, 
              fontWeight: 600, 
              color: '#333333',
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            {editAddress ? 'Edit Address' : 'Add New Address'}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Street Address"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                fullWidth
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontFamily: '"Open Sans", sans-serif',
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                fullWidth
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontFamily: '"Open Sans", sans-serif',
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                fullWidth
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontFamily: '"Open Sans", sans-serif',
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ZIP/Postal Code"
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                fullWidth
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontFamily: '"Open Sans", sans-serif',
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Country"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                fullWidth
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontFamily: '"Open Sans", sans-serif',
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
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={editAddress ? updateAddress : addAddress}
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
            >
              {editAddress ? 'Update Address' : 'Add Address'}
            </Button>
            {editAddress && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditAddress(null);
                  setAddress({ street: '', city: '', state: '', zip: '', country: '' });
                }}
                sx={{ 
                  borderColor: '#757575', 
                  color: '#757575',
                  borderRadius: '50px',
                  padding: '10px 24px',
                  textTransform: 'none',
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 500,
                  '&:hover': { 
                    borderColor: '#616161',
                    color: '#616161',
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default Profile;