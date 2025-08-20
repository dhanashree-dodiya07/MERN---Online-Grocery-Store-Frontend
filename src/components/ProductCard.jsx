import { Card, CardMedia, CardContent, Typography, Button, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 300, m: 2, boxShadow: 3 }}>
      <CardMedia component="img" height="200" image={product.image} alt={product.name} />
      <CardContent>
        <Typography variant="h3">{product.name}</Typography>
        <Typography variant="body1" color="text.secondary">
          ${product.discountedPrice} <del>${product.actualPrice}</del> ({product.discountPercentage}% off)
        </Typography>
        <Rating value={product.avgRating} readOnly precision={0.5} />
        <Button variant="contained" color="primary" fullWidth onClick={() => navigate(`/product/${product._id}`)}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;