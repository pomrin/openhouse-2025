import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import nyp_logo from "./../assets/nyp_logo.png";
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux'
import { boothHelperLogin, adminLogin } from '../features/user/userslice'
import { USER_TYPES_NAV } from '../constants';

const apiUrl = import.meta.env.VITE_API_BASE_URL;


function AdminLogin() {

  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  // Login process
  const handleLogin = () => {
    axios.post(`${apiUrl}/AdminLogin`, {
      username: username,
      password: password
    })
      .then(response => {

        console.log('Response:', response);

        const token = response.data;


        if (token) {
          localStorage.clear();

          setLoginSuccess(true);
          setError(false);

          const tokenDecoded = jwtDecode(token);
          const role = tokenDecoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          console.log(`user role: ${role}`);  // If no token is received - just in case
          if (role === USER_TYPES_NAV.ADMIN) {
            dispatch(adminLogin(token));
            navigate('/selectbooth');
            location.reload();
          } else {
            dispatch(boothHelperLogin(token));
            navigate('/selectbooth');
            location.reload();
          }
        } else {
          console.log('Login failed: No token returned');  // If no token is received - just in case
          setError(true);
          setLoginSuccess(false);
        }
      })
      .catch(error => {
        console.error('API call failed:', error.response ? error.response.data : error.message);
        setError(true);
        setLoginSuccess(false);
      });
  };

  return (
    <Box>
      {/* Login Form */}
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="70vh">

        <Typography variant="h5" sx={{ mt: 2 }}>
          NYP Open House Admin Login
        </Typography>
        <Box component="form">
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleLogin} sx={{ mt: 2 }} fullWidth>
            Submit
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              Invalid username or password.
            </Typography>
          )}
          <Snackbar
            open={loginSuccess}
            autoHideDuration={3000}
            message="Login successful"
            onClose={() => setLoginSuccess(false)}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLogin;
