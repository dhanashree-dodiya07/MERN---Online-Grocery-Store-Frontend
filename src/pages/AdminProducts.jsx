import { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField, MenuItem, Select } from '@mui/material';
import Navbar from '../components/Navbar';
import api from '../api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', actualPrice: '', discountedPrice: '', stock: '', image: '', category: '' });
  const [editProduct, setEditProduct] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/products').then((res) => setProducts(res.data)).catch((err) => console.error('Products fetch error:', err));
    api.get('/admin/categories').then((res) => setCategories(res.data)).catch((err) => console.error('Categories fetch error:', err));
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) {
      setError('Category name is required!');
      return;
    }
    try {
      const res = await api.post('/admin/categories', { name: newCategory });
      setCategories([...categories, res.data]);
      setNewCategory('');
      setError('');
    } catch (err) {
      console.error('Add Category Error:', err.response?.data || err.message);
      setError(err.response?.data.msg || 'Failed to add category—check backend!');
    }
  };

  const addProduct = async () => {
    try {
      const categoryDoc = categories.find(cat => cat.name === newProduct.category);
      if (!categoryDoc) throw new Error('Category not found');
      const productData = { ...newProduct, category: categoryDoc.name };
      const res = await api.post('/admin/products', productData);
      setProducts([...products, res.data]);
      setNewProduct({ name: '', description: '', actualPrice: '', discountedPrice: '', stock: '', image: '', category: '' });
    } catch (err) {
      console.error('Add Product Error:', err.response?.data || err.message);
    }
  };

  const updateProduct = async (id) => {
    try {
      const categoryDoc = categories.find(cat => cat.name === editProduct.category);
      if (!categoryDoc) throw new Error('Category not found');
      const productData = { ...editProduct, category: categoryDoc.name };
      const res = await api.put(`/admin/products/${id}`, productData);
      setProducts(products.map(p => p._id === id ? res.data : p));
      setEditProduct(null);
    } catch (err) {
      console.error('Update Product Error:', err.response?.data || err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete Product Error:', err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar cartCount={0} isAdmin={true} />
      <Container>
        <Typography variant="h1" sx={{ my: 4 }}>Manage Products</Typography>

        {/* Add Category Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>Add New Category</Typography>
          <TextField
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="secondary" onClick={addCategory}>
            Add Category
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </Box>

        {/* Add Product Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>Add New Product</Typography>
          <TextField label="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
          <TextField label="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
          <TextField label="Actual Price" value={newProduct.actualPrice} onChange={(e) => setNewProduct({ ...newProduct, actualPrice: e.target.value })} />
          <TextField label="Discounted Price" value={newProduct.discountedPrice} onChange={(e) => setNewProduct({ ...newProduct, discountedPrice: e.target.value })} />
          <TextField label="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
          <TextField label="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
          <Select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            displayEmpty
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={addProduct}>Add Product</Button>
        </Box>

        {/* Product List */}
        {products.map((product) => (
          <Box key={product._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 8 }}>
            {editProduct?._id === product._id ? (
              <>
                <TextField value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                <TextField value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
                <TextField value={editProduct.actualPrice} onChange={(e) => setEditProduct({ ...editProduct, actualPrice: e.target.value })} />
                <TextField value={editProduct.discountedPrice} onChange={(e) => setEditProduct({ ...editProduct, discountedPrice: e.target.value })} />
                <TextField value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} />
                <TextField value={editProduct.image} onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })} />
                <Select
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                  ))}
                </Select>
                <Button onClick={() => updateProduct(product._id)}>Save</Button>
                <Button onClick={() => setEditProduct(null)}>Cancel</Button>
              </>
            ) : (
              <>
                <Typography>{product.name} - ${product.discountedPrice}</Typography>
                <Button onClick={() => setEditProduct(product)}>Edit</Button>
                <Button onClick={() => deleteProduct(product._id)}>Delete</Button>
              </>
            )}
          </Box>
        ))}
      </Container>
    </>
  );
};

export default AdminProducts;