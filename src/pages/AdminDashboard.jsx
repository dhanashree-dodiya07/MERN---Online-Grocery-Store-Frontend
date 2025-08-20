import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, TextField, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Tabs, Tab, Paper, CircularProgress, Chip, Card, CardContent
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import api from '../api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({
    user: { name: '', email: '', isAdmin: false },
    product: { name: '', description: '', actualPrice: '', discountedPrice: '', stock: '', image: '', category: '' },
    category: { name: '' },
    order: { status: '', trackingNumber: '' },
    coupon: { code: '', discount: '', minOrderAmount: '', expiryDate: '' },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await api.get('/admin/users');
        setUsers(usersRes.data.users || []);

        const productsRes = await api.get('/admin/products');
        setProducts(productsRes.data || []);

        const categoriesRes = await api.get('/admin/categories');
        setCategories(categoriesRes.data || []);

        const ordersRes = await api.get('/admin/orders');
        setOrders(ordersRes.data.orders || []);

        const couponsRes = await api.get('/admin/coupons');
        setCoupons(couponsRes.data || []);

        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load admin data—check console!');
        console.error('Admin Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // CRUD Handlers
  const handleAdd = async (type, endpoint) => {
    try {
      const data = newItem[type];
      if (!Object.values(data).some(Boolean)) throw new Error('Fill out all fields, bro!');
      const res = await api.post(`/admin/${endpoint}`, data);
      setStateByType(type, (prev) => [...prev, res.data]);
      resetNewItem(type);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to add ${type}—check backend!`);
    }
  };

  const handleUpdate = async (type, endpoint, id) => {
    try {
      const res = await api.put(`/admin/${endpoint}/${id}`, editItem);
      setStateByType(type, (prev) => prev.map((item) => (item._id === id ? res.data : item)));
      if (type === 'order' && editItem.status === 'Delivered') {
        const productsRes = await api.get('/admin/products');
        setProducts(productsRes.data || []);
      }
      setEditItem(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to update ${type}—check backend!`);
    }
  };

  const handleDelete = async (type, endpoint, id) => {
    try {
      await api.delete(`/admin/${endpoint}/${id}`);
      setStateByType(type, (prev) => prev.filter((item) => item._id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to delete ${type}—check backend!`);
    }
  };

  const setStateByType = (type, setter) => {
    const setters = {
      user: setUsers,
      product: setProducts,
      category: setCategories,
      order: setOrders,
      coupon: setCoupons,
    };
    setters[type](setter);
  };

  const resetNewItem = (type) => {
    const defaults = {
      user: { name: '', email: '', isAdmin: false },
      product: { name: '', description: '', actualPrice: '', discountedPrice: '', stock: '', image: '', category: '' },
      category: { name: '' },
      order: { status: '', trackingNumber: '' },
      coupon: { code: '', discount: '', minOrderAmount: '', expiryDate: '' },
    };
    setNewItem((prev) => ({ ...prev, [type]: defaults[type] }));
  };

  // Render Form Fields
  const renderForm = (type, data, setData) => {
    const fields = {
      user: [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Admin', key: 'isAdmin', type: 'select', options: [true, false] },
      ],
      product: [
        { label: 'Name', key: 'name' },
        { label: 'Description', key: 'description' },
        { label: 'Actual Price', key: 'actualPrice', type: 'number' },
        { label: 'Discounted Price', key: 'discountedPrice', type: 'number' },
        { label: 'Stock', key: 'stock', type: 'number' },
        { label: 'Image URL', key: 'image' },
        { label: 'Category', key: 'category', type: 'select', options: categories.map((c) => ({ value: c._id, label: c.name })) },
      ],
      category: [{ label: 'Name', key: 'name' }],
      order: [
        { label: 'Status', key: 'status', type: 'select', options: ['Pending', 'Shipped', 'Delivered', 'Cancelled'] },
        { label: 'Tracking Number', key: 'trackingNumber' },
      ],
      coupon: [
        { label: 'Code', key: 'code' },
        { label: 'Discount (%)', key: 'discount', type: 'number' },
        { label: 'Min Order Amount', key: 'minOrderAmount', type: 'number' },
        { label: 'Expiry Date', key: 'expiryDate', type: 'date' },
      ],
    };

    return fields[type].map((field) => (
      <Box key={field.key} sx={{ mb: 2 }}>
        {field.type === 'select' ? (
          <Select
            value={data[field.key] || ''}
            onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
            fullWidth
            displayEmpty
            sx={{ bgcolor: '#fff', borderRadius: 1 }}
          >
            <MenuItem value="">{`Select ${field.label}`}</MenuItem>
            {field.options.map((opt) => (
              <MenuItem key={opt.value || opt} value={opt.value || opt}>
                {opt.label || opt.toString()}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <TextField
            label={field.label}
            type={field.type || 'text'}
            value={data[field.key] || ''}
            onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
            fullWidth
            sx={{ bgcolor: '#fff', borderRadius: 1 }}
          />
        )}
      </Box>
    ));
  };

  // Render Table with updated delete endpoint handling
  const renderTable = (type, items, columns) => (
    <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#232f3e' }}>
              {columns.map((col) => (
                <TableCell key={col} sx={{ color: '#fff', fontWeight: 'bold' }}>
                  {col.toUpperCase()}
                </TableCell>
              ))}
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                {columns.map((col) => (
                  <TableCell key={col}>
                    {col === 'status' ? (
                      <Chip
                        label={item[col] || 'Pending'}
                        color={
                          item[col] === 'Delivered'
                            ? 'success'
                            : item[col] === 'Shipped'
                            ? 'primary'
                            : item[col] === 'Pending'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    ) : col === 'isAdmin' ? (
                      item[col] ? 'Yes' : 'No'
                    ) : col === 'category' && type === 'product' ? (
                      typeof item[col] === 'object' && item[col] !== null
                        ? item[col].name
                        : (categories.find((c) => c._id === item[col])?.name || item[col])
                    ) : col === 'user' && type === 'order' ? (
                      item[col]?.name || item[col]
                    ) : col === 'items' && type === 'order' ? (
                      item[col].map((i) => i.product?.name || i.product).join(', ')
                    ) : col === 'expiryDate' ? (
                      item[col] ? new Date(item[col]).toLocaleDateString() : 'N/A'
                    ) : (
                      item[col] || 'N/A'
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => setEditItem(item)} sx={{ color: '#ff9900' }}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handleDelete(
                        type,
                        type === 'user'
                          ? 'users'
                          : type === 'category'
                          ? 'categories'
                          : `${type}s`,
                        item._id
                      )
                    }
                    sx={{ color: '#d32f2f' }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar cartCount={0} isAdmin={true} />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', color: '#232f3e' }}>
          D’Store Admin Hub
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2, bgcolor: '#ffebee', p: 2, borderRadius: 2 }}>
            {error}
          </Typography>
        )}

        <Tabs
          value={tab}
          onChange={(e, val) => setTab(val)}
          sx={{ mb: 4, bgcolor: '#ff9900', borderRadius: 2, '& .MuiTab-root': { color: '#fff', fontWeight: 'bold' } }}
        >
          <Tab label="Users" />
          <Tab label="Products" />
          <Tab label="Categories" />
          <Tab label="Orders" />
          <Tab label="Coupons" />
        </Tabs>

        {/* Users */}
        {tab === 0 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, color: '#232f3e' }}>Manage Users</Typography>
            <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff', borderRadius: 2 }}>
              {renderForm('user', newItem.user, (data) => setNewItem({ ...newItem, user: data }))}
              <Button
                variant="contained"
                onClick={() => handleAdd('user', 'users')}
                sx={{ bgcolor: '#ff9900', '&:hover': { bgcolor: '#f57c00' } }}
              >
                Add User
              </Button>
            </Paper>
            {editItem && editItem.email && (
              <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff', borderRadius: 2 }}>
                {renderForm('user', editItem, setEditItem)}
                <Button
                  onClick={() => handleUpdate('user', 'users', editItem._id)}
                  sx={{ bgcolor: '#ff9900', '&:hover': { bgcolor: '#f57c00' }, mr: 2 }}
                >
                  Save
                </Button>
                <Button onClick={() => setEditItem(null)} sx={{ color: '#757575' }}>
                  Cancel
                </Button>
              </Paper>
            )}
            {renderTable('user', users, ['name', 'email', 'isAdmin'])}
          </Box>
        )}

        {/* Products */}
        {tab === 1 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, color: '#232f3e' }}>Manage Products</Typography>
            <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff', borderRadius: 2 }}>
              {renderForm('product', newItem.product, (data) => setNewItem({ ...newItem, product: data }))}
              <Button
                variant="contained"
                onClick={() => handleAdd('product', 'products')}
                sx={{ bgcolor: '#ff9900', '&:hover': { bgcolor: '#f57c00' } }}
              >
                Add Product
              </Button>
            </Paper>
            {editItem && editItem.name && !editItem.email && (
              <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff', borderRadius: 2 }}>
                {renderForm('product', editItem, setEditItem)}
                <Button
                  onClick={() => handleUpdate('product', 'products', editItem._id)}
                  sx={{ bgcolor: '#ff9900', '&:hover': { bgcolor: '#f57c00' }, mr: 2 }}
                >
                  Save
                </Button>
                <Button onClick={() => setEditItem(null)} sx={{ color: '#757575' }}>
                  Cancel
                </Button>
              </Paper>
            )}
            {renderTable('product', products, ['name', 'actualPrice', 'discountedPrice', 'stock', 'category'])}
          </Box>
        )}

        {/* Categories */}
        {tab === 2 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, color: '#232f3e' }}>Manage Categories</Typography>
            <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff', borderRadius: 2 }}>
              {renderForm('category', newItem.category, (data) => setNewItem({ ...newItem, category: data }))}
              <Button
                variant="contained"
                onClick={() => handleAdd('category', 'categories')}
                sx={{ bgcolor: '#ff9900', '&:hover': { bgcolor: '#f57c00' } }}
              >
                Add Category
              </Button>
            </Paper>
            {editItem && editItem.name && !editItem.email && (
              <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff', borderRadius: 2 }}>
                {renderForm('category', editItem, setEditItem)}
                <Button
                  onClick={() => handleUpdate('category', 'categories', editItem._id)}
                  sx={{ bgcolor: '#ff9900', '&:hover': { bgcolor: '#f57c00' }, mr: 2 }}
                >
                  Save
                </Button>
                <Button onClick={() => setEditItem(null)} sx={{ color: '#757575' }}>
                  Cancel
                </Button>
              </Paper>
            )}
            {renderTable('category', categories, ['name'])}
          </Box>
        )}

        {/* Orders */}
        {tab === 3 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, color: '#232f3e' }}>Manage Orders</Typography>
            {editItem && editItem.status && (
              <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff', borderRadius: 2 }}>
                {renderForm('order', editItem, setEditItem)}
                <Button
                  onClick={() => handleUpdate('order', 'orders', editItem._id)}
                  sx={{ bgcolor: '#ff9900', '&:hover': { bgcolor: '#f57c00' }, mr: 2 }}
                >
                  Save
                </Button>
                <Button onClick={() => setEditItem(null)} sx={{ color: '#757575' }}>
                  Cancel
                </Button>
              </Paper>
            )}
            {renderTable('order', orders, ['_id', 'user', 'items', 'total', 'status', 'trackingNumber'])}
          </Box>
        )}

        {/* Coupons */}
        {tab === 4 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, color: '#232f3e' }}>Manage Coupons</Typography>
            <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff', borderRadius: 2 }}>
              {renderForm('coupon', newItem.coupon, (data) => setNewItem({ ...newItem, coupon: data }))}
              <Button
                variant="contained"
                onClick={() => handleAdd('coupon', 'coupons')}
                sx={{ bgcolor: '#ff9900', '&:hover': { bgcolor: '#f57c00' } }}
              >
                Add Coupon
              </Button>
            </Paper>
            {editItem && editItem.code && (
              <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff', borderRadius: 2 }}>
                {renderForm('coupon', editItem, setEditItem)}
                <Button
                  onClick={() => handleUpdate('coupon', 'coupons', editItem._id)}
                  sx={{ bgcolor: '#ff9900', '&:hover': { bgcolor: '#f57c00' }, mr: 2 }}
                >
                  Save
                </Button>
                <Button onClick={() => setEditItem(null)} sx={{ color: '#757575' }}>
                  Cancel
                </Button>
              </Paper>
            )}
            {renderTable('coupon', coupons, ['code', 'discount', 'minOrderAmount', 'expiryDate'])}
          </Box>
        )}
      </Container>
    </>
  );
};

export default AdminDashboard;
