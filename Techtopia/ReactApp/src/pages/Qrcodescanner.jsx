import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Snackbar, IconButton, AppBar, Toolbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QrScanner from 'qr-scanner';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Qrcodescanner() {
  const [qrCodeResult, setQrCodeResult] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [apiResponseError, setApiResponseError] = useState(false);
  const apiUrl = import.meta.env.VITE_REGISTER_API;

  useEffect(() => {
    // Check if accessToken exists
    const accessToken = localStorage.getItem('accessToken');
    
    // If no token, redirect to login
    if (!accessToken) {
      navigate('/adminlogin');
    }
  }, [navigate]);

  const location = useLocation();
  const { boothId, boothName } = location.state || {}; // Retrieve booth name from location.state

  useEffect(() => {
    const qrScanner = new QrScanner(videoRef.current, result => handleScanSuccess(result));
    qrScanner.start();

    return () => {
      qrScanner.stop();
    };
  }, []);

  const handleScanSuccess = (result) => {
    setQrCodeResult(result);
    setSnackbarOpen(true);

    // Send the "Stamp" API request
    stampApiRequest(result);
  };

  const stampApiRequest = async (ticketId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      // POST request to the "Stamp" API
      const response = await axios.post(apiUrl, {
        ticketId,  
        boothId: boothId 
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Attach JWT token
          'Content-Type': 'application/json'       
        }
      });

      if (response.status === 200) {
        setApiResponseMessage('Stamp added successfully!');
        setApiResponseError(false);
      }
    } catch (error) {
      console.error('Error sending Stamp API request:', error);
      setApiResponseMessage('Failed to add stamp. Please try again.');
      setApiResponseError(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleBack = () => {
    navigate('/selectbooth');
  };

  const handleLogout = () => {
    // Remove the accessToken from localStorage to log the user out
    localStorage.removeItem('accessToken');
    // Navigate back to admin login page
    navigate('/adminlogin');
  };

  return (
    <Box>
      {/* Fixed AppBar - for testing */}
      {/* <AppBar position="fixed" sx={{ width: '100vw', left: 0, right: 0 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            NYP Open House Admin
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar> */}

      <Box display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      height="95vh"
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'top',
        alignItems: 'center',
        paddingTop: '64px', 
        paddingBottom: '20px',
      }}>
        <Box display="flex" width="100%" justifyContent="flex-start">
          <IconButton onClick={handleBack} aria-label="Go Back">
            <ArrowBackIcon />
            <Typography variant="h6" sx={{ my: 1 }}>
              Back
            </Typography>
          </IconButton>
        </Box>

        <Typography variant="h5" sx={{ my: 2 }}>
          QR Code Scanner
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>
          {boothName ? `Current Booth: ${boothName}` : 'No Booth Selected'}
        </Typography>

        {/* Square container for video (camera to scan QR code) */}
        <Box sx={{ width: '300px', 
          height: '300px', 
          position: 'relative',
          border: '3px solid #3f51b5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px', 
          overflow: 'hidden' }}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // Ensure the video covers the square box
              // borderRadius: '8px' // Optional: adds rounded corners
            }}
          ></video>
        </Box>

        {/* Demo purpose for now - modify it to scan visitor QR code to collect stamp later on */}
        {qrCodeResult && (
          <Box mt={2} textAlign="center">
            <Typography variant="h6">Scanned URL:</Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
              {qrCodeResult}
            </Typography>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => window.open(qrCodeResult, '_blank')}
              sx={{ mt: 2 }}
            >
              Open Link
            </Button>*/}
          </Box>
        )}

         {/* Display API response message */}
         {apiResponseMessage && (
          <Box mt={2} textAlign="center">
            <Typography variant={apiResponseError ? 'body1' : 'h6'} color={apiResponseError ? 'error' : 'success'}>
              {apiResponseMessage}
            </Typography>
          </Box>
        )}


        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message="QR Code Scanned Successfully!"
        />
      </Box>
    </Box>
  );
}

export default Qrcodescanner;
