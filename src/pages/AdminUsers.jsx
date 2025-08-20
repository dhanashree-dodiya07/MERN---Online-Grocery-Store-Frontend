import { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import Navbar from '../components/Navbar';
import api from '../api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    api.get('/admin/users').then((res) => setUsers(res.data.users));
  }, []);

  const updateUser = (id) => {
    api.put(`/admin/users/${id}`, editUser).then((res) => {
      setUsers(users.map(u => u._id === id ? res.data : u));
      setEditUser(null);
    });
  };

  const deleteUser = (id) => {
    api.delete(`/admin/users/${id}`).then(() => setUsers(users.filter(u => u._id !== id)));
  };

  return (
    <>
      <Navbar cartCount={0} isAdmin={true} />
      <Container>
        <Typography variant="h1" sx={{ my: 4 }}>Manage Users</Typography>
        {users.map((user) => (
          <Box key={user._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 8 }}>
            {editUser?._id === user._id ? (
              <>
                <TextField value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
                <TextField value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
                <Button onClick={() => updateUser(user._id)}>Save</Button>
                <Button onClick={() => setEditUser(null)}>Cancel</Button>
              </>
            ) : (
              <>
                <Typography>{user.name} - {user.email} - {user.isAdmin ? 'Admin' : 'User'}</Typography>
                <Button onClick={() => setEditUser(user)}>Edit</Button>
                <Button onClick={() => deleteUser(user._id)}>Delete</Button>
              </>
            )}
          </Box>
        ))}
      </Container>
    </>
  );
};

export default AdminUsers;