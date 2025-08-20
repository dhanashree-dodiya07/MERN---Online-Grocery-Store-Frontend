import { Typography, Grid } from '@mui/material';
import ProductCard from './ProductCard';

const CategorySection = ({ title, products }) => (
  <div style={{ margin: '40px 0' }}>
    <Typography variant="h2" gutterBottom>{title}</Typography>
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={3} key={product._id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  </div>
);

export default CategorySection;