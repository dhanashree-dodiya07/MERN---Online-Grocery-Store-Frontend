import { 
  Container, 
  Typography, 
  Box, 
  Divider, 
  Link,
  useMediaQuery,
  useTheme,
  IconButton,
  Grid,
  Paper,
} from '@mui/material';
import { Email, Phone, LocationOn, Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'linear-gradient(145deg, #f9f9f9 0%, #f0f0f0 100%)', 
        py: 8, 
        borderTop: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.03)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 50%, #CDDC39 100%)',
        }}
      />
      
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  fontFamily: "'Montserrat', sans-serif", 
                  color: '#333333',
                  mb: 2,
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                D'Store
                <Box 
                  sx={{ 
                    position: 'absolute',
                    bottom: -5,
                    left: 0,
                    width: '40%',
                    height: '3px',
                    background: '#4CAF50',
                    borderRadius: '2px',
                    display: { xs: 'none', md: 'block' }
                  }}
                />
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#636363', 
                  fontFamily: "'Open Sans', sans-serif", 
                  lineHeight: 1.8,
                  maxWidth: '300px',
                  mx: { xs: 'auto', md: 0 },
                  fontSize: '0.9rem',
                }}
              >
                Your one-stop shop for fresh groceries delivered fast and affordably.
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mt: 3,
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}
              >
                {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                  <IconButton 
                    key={index} 
                    size="small"
                    sx={{ 
                      color: '#757575',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#4CAF50',
                        transform: 'translateY(-3px)',
                      },
                      bgcolor: 'rgba(0,0,0,0.03)',
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  fontFamily: "'Montserrat', sans-serif", 
                  color: '#333333',
                  mb: 3,
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                Quick Links
              </Typography>
              {['Home', 'Products', 'Deals', 'Contact'].map((link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  sx={{
                    display: 'block',
                    color: '#636363',
                    fontFamily: "'Open Sans', sans-serif",
                    mb: 1.5,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#4CAF50',
                      transform: 'translateX(5px)',
                      paddingLeft: '5px',
                    },
                    fontSize: '0.9rem',
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={5}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  fontFamily: "'Montserrat', sans-serif", 
                  color: '#333333',
                  mb: 3,
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                Contact Us
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2,
                  alignItems: { xs: 'center', md: 'flex-start' },
                }}
              >
                {[
                  { icon: Email, text: 'support@dstore.com' },
                  { icon: Phone, text: '+91 77777 77777' },
                  { icon: LocationOn, text: '123 Fresh St, Grocery City' }
                ].map((item, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 1,
                      px: 2,
                      borderRadius: '8px',
                      bgcolor: 'rgba(0,0,0,0.02)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(76,175,80,0.08)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box 
                      sx={{ 
                        bgcolor: 'rgba(76,175,80,0.1)', 
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <item.icon sx={{ color: '#4CAF50', fontSize: '1.2rem' }} />
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#636363', 
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '0.9rem',
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Divider sx={{ mt: 6, mb: 4, borderColor: 'rgba(0,0,0,0.06)', opacity: 0.6 }} />
        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#757575', 
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '0.85rem',
            }}
          >
            © {new Date().getFullYear()} D'Store. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((link) => (
              <Link
                key={link}
                href="#"
                sx={{
                  color: '#757575',
                  fontFamily: "'Open Sans', sans-serif",
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#4CAF50',
                  },
                  fontSize: '0.85rem',
                }}
              >
                {link}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;