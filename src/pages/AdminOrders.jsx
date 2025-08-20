import { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import Navbar from '../components/Navbar';
import api from '../api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => {
    api.get('/admin/orders').then((res) => setOrders(res.data.orders));
  }, []);

  const updateOrder = (id) => {
    api.put(`/admin/orders/${id}`, editOrder).then((res) => {
      setOrders(orders.map(o => o._id === id ? res.data : o));
      setEditOrder(null);
    });
  };

  const deleteOrder = (id) => {
    api.delete(`/admin/orders/${id}`).then(() => setOrders(orders.filter(o => o._id !== id)));
  };

  return (
    <>
      <Navbar cartCount={0} isAdmin={true} />
      <Container>
        <Typography variant="h1" sx={{ my: 4 }}>Manage Orders</Typography>
        {orders.map((order) => (
          <Box key={order._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 8 }}>
            {editOrder?._id === order._id ? (
              <>
                <TextField value={editOrder.status} onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })} />
                <TextField value={editOrder.trackingNumber} onChange={(e) => setEditOrder({ ...editOrder, trackingNumber: e.target.value })} />
                <Button onClick={() => updateOrder(order._id)}>Save</Button>
                <Button onClick={() => setEditOrder(null)}>Cancel</Button>
              </>
            ) : (
              <>
                <Typography>Order #{order._id} - {order.status} - ${order.total}</Typography>
                <Button onClick={() => setEditOrder(order)}>Edit</Button>
                <Button onClick={() => deleteOrder(order._id)}>Delete</Button>
              </>
            )}
          </Box>
        ))}
      </Container>
    </>
  );
};

export default AdminOrders;