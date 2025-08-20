import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import CategorySection from '../components/CategorySection';
import api from '../api';

const Category = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    api.get(`/user/products/category/${categoryId}`).then((res) => {
      setProducts(res.data);
      setCategory(res.data[0]?.category || {});
    });
    api.get('/user/cart').then((res) => setCartCount(res.data.items.length));
    const token = localStorage.getItem('token');
    if (token) api.get('/user/profile').then((res) => setIsAdmin(res.data.isAdmin));
  }, [categoryId]);

  return (
    <>
      <Navbar cartCount={cartCount} isAdmin={isAdmin} />
      <Container>
        <Typography variant="h1" sx={{ my: 4 }}>{category.name}</Typography>
        <CategorySection title={category.name} products={products} />
      </Container>
    </>
  );
};

export default Category;