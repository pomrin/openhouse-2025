import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import nyp_logo from "./../assets/nyp_logo.png";
import '../css/UserLanding.css';
import plane_image from './../assets/images/plane_image.png';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import aiStamp from './../assets/images/ai_stamp.svg';
import csStamp from './../assets/images/cs_stamp.svg';
import ftStamp from './../assets/images/ft_stamp.svg';
import itStamp from './../assets/images/it_stamp.svg';




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
    const [isAiStampVisible, setAiStampVisible] = useState(false); // State to manage visibility
    const [isCsStampVisible, setCsStampVisible] = useState(false); // State to manage visibility
    const [isFtStampVisible, setFtStampVisible] = useState(false); // State to manage visibility
    const [isItStampVisible, setItStampVisible] = useState(false); // State to manage visibility


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

    const ModalContent = ({ close }) => (
        <div style={modalContentStyle}>
            <div style={contentStyle}>
                <button onClick={() => close()} style={buttonStyle}>Close Modal</button>
                <h2 style={titleStyle}>All Collected Stamps</h2>
                <p>Here you can see all your collected stamps.</p>
                <img
                    src={aiStamp}
                    alt="aiStamp"
                    width='70%'
                    style={{ ...displayStamp, display: isAiStampVisible ? 'block' : 'none' }} // Conditional rendering
                />
                <img src={csStamp} alt="csStamp" width='70%' style={{ ...displayStamp, display: isCsStampVisible ? 'block' : 'none' }} id='csStamp' />
                <img src={ftStamp} alt="ftStamp" width='70%' style={{ ...displayStamp, display: isFtStampVisible ? 'block' : 'none' }} id='ftStamp' />
                <img src={itStamp} alt="itStamp" width='70%' style={{ ...displayStamp, display: isItStampVisible ? 'block' : 'none' }} id='itStamp' />
            </div>
        </div>
    );
      
    // Function to toggle AI stamp visibility
    const toggleAiStamp = () => {
        setAiStampVisible(prev => !prev); // Toggle visibility
    };
    // Function to toggle Cs stamp visibility
    const toggleCsStamp = () => {
        setCsStampVisible(prev => !prev); // Toggle visibility
    };
    // Function to toggle Ft stamp visibility
    const toggleFtStamp = () => {
        setFtStampVisible(prev => !prev); // Toggle visibility
    };
    // Function to toggle It stamp visibility
    const toggleItStamp = () => {
        setItStampVisible(prev => !prev); // Toggle visibility
    };


      // Styles
    const displayStamp = {
        display: 'none'
    };

    const overlayStyle = {
        background: 'rgba(0, 0, 0, 0.7)' // Transparent black background
    };
    const contentStyle = {
        maxHeight: 'calc(100vh - 40px)', // Ensure modal content area is scrollable if it overflows
        overflowY: 'auto', // Enable vertical scrolling within the content area
      };
    
    const popupContentStyle = {
        width: '100vw', // Full width
        height: '100vh', // Full height
        padding: '0', // Remove default padding
        border: 'none', // Remove default border
        display: 'flex',
        alignItems: 'center', // Center content vertically
        justifyContent: 'center', // Center content horizontally
        background: 'rgba(0, 0, 0, 0.7)' // Transparent black background

    };
    
    const modalContentStyle = {
        width: '80%', // Adjust the width as needed
        height: '80%', // Adjust the height as needed
        overflowY: 'auto', // Allow vertical scrolling
        backgroundColor: '#fff', // Background color of the modal content
        borderRadius: '8px', // Optional: rounded corners
        padding: '20px', // Optional: padding inside the modal
        position: 'relative', // For absolute positioning of internal elements if needed
        alignItems: 'center'
    };
    
    const titleStyle = {
        marginBottom: '20px'
    };
    
    const buttonStyle = {
        marginTop: '20px'
    };

    return (
        <Box>
            <img src={nyp_logo} width="60%" style={{ margin: "0px 0px 20px 0px" }} alt="NYP Logo" />


        {/* Show All Stamp Button */}
        
        <Popup trigger={<button>All Collected Stamps</button>}
                position="right center"
                modal
                overlayStyle={overlayStyle}
                contentStyle={popupContentStyle}>
                {close => <ModalContent close={close} />}
        </Popup>

        {/* Gained a stamp upon each completion of booth */}
        <Button variant="contained" color="primary"  onClick={toggleAiStamp} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',  margin: '0 auto'}}>
                    Completed Booth 1
        </Button>
        <Button variant="contained" color="primary"  onClick={toggleCsStamp} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',  margin: '0 auto'}}>
                    Completed Booth 2   
        </Button>
        <Button variant="contained" color="primary" onClick={toggleFtStamp} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',  margin: '0 auto'}}>
                    Completed Booth 3
        </Button>
        <Button variant="contained" color="primary"  onClick={toggleItStamp} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',  margin: '0 auto'}}>
                    Completed Booth 4
        </Button>


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