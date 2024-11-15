import React, { useEffect } from 'react';
import { Box, Typography, Grid, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { boothadminlogout } from '../features/user/userslice';

function Selectbooth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminAccessToken = useSelector((state) => state.user.adminJWT);

  useEffect(() => {
    // Check if accessToken exists
    const accessToken = adminAccessToken;
    // console.log(`accessToken - ${accessToken}`);

    // If no token, redirect to login
    if (!accessToken) {
      navigate('/adminlogin');
    }
  }, [navigate]);

  // Updated booth based on Database - Refer to booth table
  const booths = [
    { boothId: '1', boothName: 'Cyber Security' },
    { boothId: '2', boothName: 'IT' },
    { boothId: '3', boothName: 'FinTech' },
    { boothId: '4', boothName: 'AI' },
    { boothId: '5', boothName: 'Redemption' },
    { boothId: '6', boothName: 'Engraving' },
    { workshopId: '1', boothName: 'Software Engineering' },
    { workshopId: '2', boothName: 'FinTech' },
    { workshopId: '3', boothName: 'Cyber Security' },
    { workshopId: '4', boothName: 'Artificial Intelligence' },
  ];

  const handleBoothClick = (boothId, boothName, workshopId) => {
    console.log(`${boothName} clicked`);
    // Separate Engraving and Redemption booths from other booths via if else statement
    if (boothName === 'Engraving') {
      // Redirect to the engraving page
      navigate('/adminqueue');
    } else if (boothName === 'Redemption') {
      // Redirect to the redemption page
      navigate('/redemption');
    } else if (workshopId) {
      navigate('/qrcodescanner', { state: { workshopId, boothName } });
    }
    else {
      navigate('/qrcodescanner', { state: { boothId, boothName } });
    }
  };

  const handleLogout = () => {
    // Remove the accessToken from localStorage to log the user out
    // localStorage.removeItem('adminAccessToken');
    dispatch(boothadminlogout());

    // Navigate to adminlogin page
    navigate('/adminlogin');
  };


  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Fixed AppBar */}
      {/* <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            NYP Open House Admin
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar> */}

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '64px',
          paddingBottom: '20px',
        }}
      >
        <Box sx={{ textAlign: 'center', maxWidth: '700px', width: '100%' }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Select Booth to Scan
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {booths.map((booth, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Button
                  key={booth.boothId || booth.workshopId}
                  variant="contained"
                  fullWidth
                  sx={{ padding: 2 }}
                  onClick={() => handleBoothClick(booth.boothId || booth.workshopId, booth.boothName, booth.workshopId)}
                >
                  {booth.boothName}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default Selectbooth;
