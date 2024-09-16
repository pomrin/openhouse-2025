import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import nyp_logo from "./../assets/nyp_logo.png";
import '../css/UserLanding.css';
import plane_image from './../assets/images/plane_image.png';

function UserLanding() {
    function generateUniqueId(lastId) {
        const firstTwoDigits = Math.floor(10 + Math.random() * 90);
        const lastFourDigits = (lastId % 10000) + 1;
        const lastFourDigitsPadded = String(lastFourDigits).padStart(4, '0');
        return `${firstTwoDigits}${lastFourDigitsPadded}`;
    }

    const [uniqueId, setUniqueId] = useState(generateUniqueId(0));
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    const handleGenerateId = () => {
        setUniqueId(generateUniqueId(parseInt(uniqueId)));
    };

     //placeholder qr function
    // State to hold the QR code image source
    const [qrImage, setQrImage] = useState('');

    // Function to generate the QR code
    const generateQR = () => {
        const url = "https://www.google.com"; // URL to encode
        const qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(url);
        setQrImage(qrSrc);
      };

    useEffect(() => {
        generateQR();
        const updateDateTime = () => {
            const currentDate = new Date();
            
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            setCurrentDate(formattedDate);

            const hours = currentDate.getHours();
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const isAm = hours < 12;
            const formattedHours = hours % 12 || 12; 
            const amPm = isAm ? 'AM' : 'PM';
            const formattedTime = `${formattedHours}:${minutes} ${amPm}`;
            setCurrentTime(formattedTime);
        };

        updateDateTime(); 

        const intervalId = setInterval(updateDateTime, 60000); 
        return () => clearInterval(intervalId); 
    }, []);

    return (
        <Box>
            <img src={nyp_logo} width="60%" style={{ margin: "0px 0px 20px 0px" }} alt="NYP Logo" />
            <h1>NYP BOARDING PASS</h1>
            <Paper className="BoardingPass" elevation={2} sx={{ borderRadius: "20px", borderBottom: "1px dotted black"}}>
                <Box className="BoardingPassContent">
                    <Box className="travelBox">
                        <Box className="fromBox">
                            <Typography variant="h3">
                                SCH
                            </Typography>
                            <Typography class="bold">
                                Previous School    
                            </Typography>
                            <Typography>
                                {currentDate}
                            </Typography>
                            <Typography>
                                {currentTime}
                            </Typography>
                        </Box>
                        <Box className="toBox">
                            <Typography variant="h3">
                                NYP
                            </Typography>
                            <Typography class="bold">
                                Nanyang Polytechnic
                            </Typography>
                            <Typography>
                                21/04/2025 
                            </Typography>
                            <Typography>
                                9:00 AM
                            </Typography>
                        </Box>
                    </Box>
                    <Box className="planeImage">
                        <img src={plane_image} alt="Plane Image" width="70%" />
                    </Box>
                    <Box class="detailsBox">
                        <Box>
                            <Typography class="bold">
                                Passenger
                            </Typography>
                            <Typography>
                                {uniqueId}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography class="bold">
                                Flight
                            </Typography>
                            <Typography>
                                A 0137
                            </Typography>
                        </Box>
                    </Box>
                    <Box class="detailsBox">
                        <Box>
                                <Typography class="bold">
                                    Seat
                                </Typography>
                                <Typography>
                                    27F
                                </Typography>
                        </Box>
                        <Box>
                                <Typography class="bold">
                                    Gate
                                </Typography>
                                <Typography>
                                    2B
                                </Typography>
                        </Box>
                        <Box>
                                <Typography class="bold">
                                    Terminal
                                </Typography>
                                <Typography>
                                    1A
                                </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <Paper elevation={2} sx={{ borderRadius: "20px", paddingBottom: "10px", marginBottom:"10px"}}>
                <Box class="QRBox">
                    <a href="#"><img src={qrImage} alt="QR Code" /></a>
                </Box>
                <Button variant="contained" color="primary" onClick={handleGenerateId} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',  margin: '0 auto'}}>
                    Generate New ID
                </Button>
            </Paper>
        </Box>
    );
}

export default UserLanding;