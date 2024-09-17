import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import nyp_logo from "./../assets/nyp_logo.png";
import '../css/UserLanding.css';
import plane_image from './../assets/images/plane_image.png';
import profile_picture from './../assets/images/cartoonifyPlaceholder.png';

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
    const [currentBooth, setCurrentBooth] = useState('Fintech');
    const [queueNumber, setQueueNumber] = useState('0001');  // Queue number state

    const handleGenerateId = () => {
        setUniqueId(generateUniqueId(parseInt(uniqueId)));
    };

    // List of booths
    const booths = ['Fintech', 'Cybersec', 'AI', 'Infotech'];
    
    // Function to cycle through the booth names
    const handleCycleBooth = () => {
        setCurrentBooth((prevBooth) => {
            const currentIndex = booths.indexOf(prevBooth);
            const nextIndex = (currentIndex + 1) % booths.length;
            return booths[nextIndex];
        });
    };

    // Function to increment the queue number and format it as a 4-digit string
    const handleIncrementQueue = () => {
        setQueueNumber((prevQueueNumber) => {
            const nextQueueNumber = (parseInt(prevQueueNumber) + 1).toString().padStart(4, '0');
            return nextQueueNumber;
        });
    };

    // Placeholder QR function
    const [qrImage, setQrImage] = useState('');

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
            <Box class="profilePicture">
                <img src={profile_picture} class="profileImage"/>
            </Box>
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
                                Passenger ID
                            </Typography>
                            <Typography>
                                {uniqueId}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography class="bold">
                                Next Booth
                            </Typography>
                            <Typography>
                                {currentBooth} {/* Updated to show current booth */}
                            </Typography>
                        </Box>
                    </Box>
                    <Box class="detailsBox">
                        <Box>
                                <Typography class="bold">
                                    Queue
                                </Typography>
                                <Typography>
                                    {queueNumber} {/* Queue number state */}
                                </Typography>
                        </Box>
                        <Box>
                                <Typography class="bold">
                                    Placeholder
                                </Typography>
                                <Typography>
                                    2B
                                </Typography>
                        </Box>
                        <Box>
                                <Typography class="bold">
                                    Placeholder
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
                <Button variant="contained" color="primary" onClick={handleGenerateId} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',  margin: '0 auto', width:'60%'}}>
                    Generate New ID
                </Button>
                {/* Button to cycle through booth names */}
                <Button variant="contained" color="primary" onClick={handleCycleBooth} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', margin: '0 auto', width:'60%' }}>
                    Change Booth
                </Button>
                {/* New button to increment queue number */}
                <Button variant="contained" color="primary" onClick={handleIncrementQueue} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', margin: '0 auto', width:'60%' }}>
                    Add Queue Number
                </Button>
            </Paper>
            <Box>
                <h1>MONTAGE APP</h1>

            </Box>
        </Box>
    );
}

export default UserLanding;