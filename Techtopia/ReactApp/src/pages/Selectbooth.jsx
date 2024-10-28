import React , { useEffect } from 'react';
import { Box, Typography, Grid, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Selectbooth() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if accessToken exists
    const accessToken = localStorage.getItem('accessToken');
    
    // If no token, redirect to login
    if (!accessToken) {
      navigate('/adminlogin');
    }
  }, [navigate]);

  const booths = [
    {boothId: '1', boothName: 'AI'},
    {boothId: '2', boothName: 'Cyber Security'},
    {boothId: '3', boothName:'FinTech'},
    {boothId: '4', boothName:'SWENG'},
    {boothId: '5', boothName:'Redemption'},
    {boothId: '6', boothName:'Engraving'},
    {boothId: '7', boothName:'Workshop A'},
    {boothId: '8', boothName:'Workshop B'},
    {boothId: '9', boothName:'Workshop C'},
    {boothId: '10', boothName:'Workshop D'},
  ];

  const handleBoothClick = (boothId, boothName) => {
    console.log(`${boothName} clicked`);
     // Separate Engraving and Redemption booths from other booths via if else statement
     if (boothName === 'Engraving') {
      // Redirect to the engraving page
      navigate('/engraving');
    } else if (boothName === 'Redemption') {
      // Redirect to the redemption page
      navigate('/redemption');
    } else {
    navigate('/qrcodescanner', { state: { boothId, boothName } });
    }
  };

  const handleLogout = () => {
    // Remove the accessToken from localStorage to log the user out
    localStorage.removeItem('accessToken');

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
                  key={booth.boothId}
                  variant="contained"
                  fullWidth
                  sx={{ padding: 2 }}
                  onClick={() => handleBoothClick(booth.boothId, booth.boothName)}
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
