import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import nyp_logo from "./../assets/nyp_logo.png";
import '../css/UserLanding.css';

function UserLanding() {
    function generateUniqueId(lastId) {
        const firstTwoDigits = Math.floor(10 + Math.random() * 90);
        
        const lastFourDigits = (lastId % 10000) + 1;
      
        const lastFourDigitsPadded = String(lastFourDigits).padStart(4, '0');
      
        return `${firstTwoDigits}${lastFourDigitsPadded}`;
    }
    const [uniqueId, setUniqueId] = useState(generateUniqueId(0));
    const handleGenerateId = () => {
        setUniqueId(generateUniqueId(parseInt(uniqueId)));
    };

      return (
        <Box>
            <img src={nyp_logo} width="60%" style={{ margin: "0px 0px 20px 0px" }} alt="NYP Logo"/>
            <h1>NYP BOARDING PASS</h1>
            <Box class="BoardingPass">
                <Typography>
                    ID = {uniqueId}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGenerateId}>
                    Generate New ID
                </Button>
            </Box>
        </Box>
    );
}

export default UserLanding