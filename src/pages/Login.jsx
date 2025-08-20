import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import api, { setAuthToken } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const login = () => {
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
      return;
    }
    
    api.post('/user/login', credentials)
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        navigate('/');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          backgroundColor: '#fff'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 700, 
            color: '#333333',
            fontFamily: '"Montserrat", sans-serif',
            textAlign: 'center'
          }}
        >
          Welcome Back To D'Store
        </Typography>
        
        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mb: 3, 
              p: 1.5, 
              bgcolor: '#FFEBEE', 
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            {error}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField 
            label="Email" 
            fullWidth
            value={credentials.email} 
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            onKeyPress={handleKeyPress}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                '&:hover fieldset': {
                  borderColor: '#4CAF50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4CAF50',
                },
              }
            }}
          />
          
          <TextField 
            label="Password" 
            type="password" 
            fullWidth
            value={credentials.password} 
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            onKeyPress={handleKeyPress}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                '&:hover fieldset': {
                  borderColor: '#4CAF50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4CAF50',
                },
              }
            }}
          />
          
          <Button 
            variant="contained" 
            fullWidth
            onClick={login}
            sx={{
              bgcolor: '#4CAF50',
              py: 1.5,
              mt: 1,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '24px',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': { 
                bgcolor: '#43A047',
                boxShadow: '0 6px 14px rgba(76, 175, 80, 0.3)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Login
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography 
              component={Link} 
              to="/register" 
              sx={{ 
                color: '#4CAF50', 
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Don't have an account? Sign up
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;