import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Snackbar, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QrScanner from 'qr-scanner';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { boothadminlogout } from '../features/user/userslice';

function Qrcodescanner() {
  const dispatch = useDispatch();
  const [qrCodeResult, setQrCodeResult] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null); 
  const navigate = useNavigate();

  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [apiResponseError, setApiResponseError] = useState(false);
  const [scanningInProgress, setScanningInProgress] = useState(false); //block multiple qr-code scans

  
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const apiUrlStamp = apiUrl + "/AdminIssueStamp";
  const apiUrlWorkshop = apiUrl + "/AdminIssueWorkshop";

  // const accessToken = useSelector((state) => state.user.userRole);

  useEffect(() => {
    // Check if accessToken exists
    const accessToken = localStorage.getItem('adminAccessToken');

    // If no token, redirect to login
    if (!accessToken) {
      dispatch(boothadminlogout());
      navigate('/adminlogin');
    } else {
      console.log(`Access Token have value!`);
    }
  }, [navigate]);

  const location = useLocation();
  const { boothId, boothName, workshopId } = location.state || {}; // Retrieve booth name from location.state

  useEffect(() => {
    // Initialize qrScanner with useRef
    qrScannerRef.current = new QrScanner(videoRef.current, (result) => handleScanSuccess(result));
    qrScannerRef.current.start();

    return () => {
      qrScannerRef.current.stop();
    };
  }, []);

  const handleScanSuccess = async (result) => {
    if (scanningInProgress) return;  // Prevent scanning while the dialog box is open
    setScanningInProgress(true);  // prevent multiple scans  
    setQrCodeResult(result);
    setSnackbarOpen(true);

     // Wait for the API request to finish and then open the dialog
     await stampApiRequest(result);

    // After stamping, open the dialog box
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setScanningInProgress(false); 
    
    // Reset scanner to allow scanning at the another booth
    setQrCodeResult('');
    setApiResponseMessage('');
    setApiResponseError(false); // Clear any error state
    
    // Reset the scanner
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.start();
    }
  };

  const stampApiRequest = async (ticketId) => {
    try {
      const accessToken = localStorage.getItem('adminAccessToken');
      // console.log(`adminAccessToken - ${accessToken}`);

       // Choose API based on boothId
      let apiUrlBoothorWorkshop = '';
      let requestPayload = { }; // Default payload for booth

    if (boothId >= 1 && boothId <= 4) {
      // boothId 1 to 4
      apiUrlBoothorWorkshop = apiUrlStamp;
      requestPayload = { ticketId, boothId };
    } else if (workshopId >= 1 && workshopId <= 4) {
      // workshopId 7 to 10
      apiUrlBoothorWorkshop = apiUrlWorkshop;
      requestPayload = { ticketId, workshopId }; 
    } else {
      console.error("Invalid boothId or workshop ID");
      setApiResponseMessage('Invalid booth ID or workshop ID!');
      setApiResponseError(true);
      setDialogOpen(true)
      return; // Exit early if boothId is invalid
    }
      // PUT request to the "Stamp" API
      const response = await axios.put(apiUrlBoothorWorkshop, requestPayload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Attach JWT token
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        console.log('Stamp added successfully!');
        setApiResponseMessage('Stamp added successfully!');
        setScanningInProgress(false);
        setDialogOpen(true)

      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Handle the conflict error 409 gracefully
        // e.g. If the visitor's qr-code has already been scanned once, the 2nd scan at the same booth will show this message
        console.error('Stamp already exists for Visitor ticket and booth.');
        setApiResponseMessage('Visitor ticket has already been stamped for this booth.');
      } else {
        // Handle other errors
        console.error('Failed to Stamp API request:', error);
        setApiResponseMessage('Failed to add stamp. Please try again.');
      }
      setApiResponseError(true);
      //setDialogOpen(true)
    }
    finally {
      // Open dialog-box after setting the message regardless of successful or error (fail) message
      setDialogOpen(true);
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
    // localStorage.removeItem('accessToken');
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
        <Box sx={{
          width: '300px',
          height: '300px',
          position: 'relative',
          border: '3px solid #3f51b5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
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

        {/* Display API response message - moved to dialog box */}
        {/* {apiResponseMessage && (
          <Box mt={2} textAlign="center">
            <Typography variant={apiResponseError ? 'body1' : 'h6'} color={apiResponseError ? 'error' : 'success'}>
              {apiResponseMessage}
            </Typography>
          </Box>
        )} */}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        {/* <DialogTitle>Message</DialogTitle> */}
          <DialogContent>
            <Typography variant="h6">
                {/* Backup */}
                {/* {boothName} Booth Stamp Added for Ticket ID {qrCodeResult} */}
                {/* Message from API */}
                <Typography variant="h6">{apiResponseMessage}</Typography>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary" variant="contained"  style={{ width: '100%' }}>OK</Button>
          </DialogActions>
        </Dialog>


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
