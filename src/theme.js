import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1a237e' },
    secondary: { main: '#ff5722' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: { fontSize: '3rem', fontWeight: 700 },
    h2: { fontSize: '2.5rem', fontWeight: 600 },
    h3: { fontSize: '2rem', fontWeight: 500 },
    body1: { fontSize: '1.1rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 8 },
      },
    },
  },
});

export default theme;