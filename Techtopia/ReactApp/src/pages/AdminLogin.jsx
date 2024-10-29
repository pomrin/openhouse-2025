import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import nyp_logo from "./../assets/nyp_logo.png";
import axios from 'axios';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  // Login process
  const handleLogin = () => {
    axios.post('https://nfiyg2peub.execute-api.ap-southeast-1.amazonaws.com/Prod/api/AdminLogin', {
      username: username, 
      password: password
    })
    .then(response => {
      console.log('Response:', response);  
  
      const token = response.data; 
      
      if (token) {
        setLoginSuccess(true);
        setError(false);
        // Store the token in localStorage
        localStorage.setItem('accessToken', token);  
        navigate('/selectbooth'); 
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
