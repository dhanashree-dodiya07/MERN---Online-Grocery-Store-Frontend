import { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import Navbar from '../components/Navbar';
import api from '../api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', minOrderAmount: '', expiryDate: '' });

  useEffect(() => {
    api.get('/admin/coupons').then((res) => setCoupons(res.data));
  }, []);

  const addCoupon = () => {
    api.post('/admin/coupons', newCoupon).then((res) => {
      setCoupons([...coupons, res.data]);
      setNewCoupon({ code: '', discount: '', minOrderAmount: '', expiryDate: '' });
    });
  };

  const deleteCoupon = (id) => {
    api.delete(`/admin/coupons/${id}`).then(() => setCoupons(coupons.filter(c => c._id !== id)));
  };

  return (
    <>
      <Navbar cartCount={0} isAdmin={true} />
      <Container>
        <Typography variant="h1" sx={{ my: 4 }}>Manage Coupons</Typography>
        <Box sx={{ mb: 4 }}>
          <TextField label="Code" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })} />
          <TextField label="Discount (%)" value={newCoupon.discount} onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })} />
          <TextField label="Min Order Amount" value={newCoupon.minOrderAmount} onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })} />
          <TextField label="Expiry Date" type="date" value={newCoupon.expiryDate} onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })} />
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={addCoupon}>Add Coupon</Button>
        </Box>
        {coupons.map((coupon) => (
          <Box key={coupon._id} sx={{ mb: 2 }}>
            <Typography>{coupon.code} - {coupon.discount}% - Min: ${coupon.minOrderAmount}</Typography>
            <Button onClick={() => deleteCoupon(coupon._id)}>Delete</Button>
          </Box>
        ))}
      </Container>
    </>
  );
};

export default AdminCoupons;