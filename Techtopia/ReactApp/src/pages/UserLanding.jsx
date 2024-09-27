import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
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
import clickHereStamp from './../assets/images/clickHere_stamp.svg';



import profile_picture from './../assets/images/cartoonifyPlaceholder.png';

function UserLanding() {
    const [ticket_id, setUniqueId] = useState(() => localStorage.getItem('ticket_id') || ''); // Load from local storage // State for ticket ID
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    const [isAiStampVisible, setAiStampVisible] = useState(() => {
        return localStorage.getItem('aiStampVisible') === 'true';
    });
    const [isCsStampVisible, setCsStampVisible] = useState(() => {
        return localStorage.getItem('csStampVisible') === 'true';
    });
    const [isFtStampVisible, setFtStampVisible] = useState(() => {
        return localStorage.getItem('ftStampVisible') === 'true';
    });
    const [isItStampVisible, setItStampVisible] = useState(() => {
        return localStorage.getItem('itStampVisible') === 'true';
    });

    const [currentBooth, setCurrentBooth] = useState('Fintech');
    const [queueNumber, setQueueNumber] = useState('0001');  // Queue number state

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [output, setOutput] = useState(null);

    const [isDropdownBoothOpen, setDropdownBoothOpen] = useState(false);
    const [isDropdownWorkshopOpen, setDropdownWorkshopOpen] = useState(false);

    
    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix for URL-safe base64
        const jsonPayload = decodeURIComponent(escape(atob(base64))); // Decode base64 to string
        return JSON.parse(jsonPayload);
    };

    // Fetch the ticket ID
    const fetchTicketId = async () => {
        try {
            const response = await fetch("https://6117kul8qd.execute-api.ap-southeast-1.amazonaws.com/Prod/api/Register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const token = await response.text(); // Get the raw token string
            const decodedToken = parseJwt(token); // Decode the token
            const staffData = JSON.parse(decodedToken.Staff); // Parse the Staff JSON
            const newTicketId = staffData.TicketId; // Set the unique ID to the TicketId
            
            setUniqueId(newTicketId);
            localStorage.setItem('ticket_id', newTicketId); // Store in local storage

        } catch (error) {
            console.error("Error fetching ticket ID:", error);
        }
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

    // Function to set the new ID in localStorage and update the UI
    const refreshId = () => {
        const newId = fetchTicketId(); // Generate a new ID or fetch from an API
        localStorage.setItem('ticket_id', newId); // Update the localStorage with the new ID
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
        if (!ticket_id) {
            fetchTicketId(); // Fetch ticket ID if not in local storage
        } // Call the function to fetch ticket ID on component mount
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
        const savedImage = localStorage.getItem('uploadedImage');
        if (savedImage) {
        setOutput(savedImage);
        }
        const intervalId = setInterval(updateDateTime, 60000); 
        return () => clearInterval(intervalId); 
    }, [ticket_id]);

    const toggleDropdownBooth = () => {
        // Toggle booth dropdown and close workshop if it's open
        setDropdownBoothOpen(prev => !prev);
        if (isDropdownWorkshopOpen) {
            setDropdownWorkshopOpen(false);
        }
    };
    
    const toggleDropdownWorkshop = () => {
        // Toggle workshop dropdown and close booth if it's open
        setDropdownWorkshopOpen(prev => !prev);
        if (isDropdownBoothOpen) {
            setDropdownBoothOpen(false);
        }
    };


    const ModalContent = ({ close }) => (
        <div style={modalContentStyle}>
            <div style={contentStyle}>
                <button onClick={() => close()} className='close-button'>&times;</button>
                <h2 style={titleStyle}>All Collected Stamps</h2>
                <p>Here you can see all your collected stamps.</p>
    
                <div className='button-container'>
                    <button className="dropdown-button" onClick={toggleDropdownBooth} style={{ marginBottom: '10px', transition: 'background-color 0.3s' }}>
                        {isDropdownBoothOpen ? 'Hide Booth Stamps' : 'Show Booth Stamps'}
                    </button>

                    <button className="dropdown-button" onClick={toggleDropdownWorkshop} style={{ marginBottom: '10px', transition: 'background-color 0.3s' }}>
                        {isDropdownWorkshopOpen ? 'Hide Workshop Stamps' : 'Show Workshop Stamps'}
                    </button>
                </div>
                
    
                {isDropdownBoothOpen && (
                    <div class='dropdown' style={{ ...dropdownStyle }}>
                        <div style={gridStyle}>
                        <img src={aiStamp} alt="aiStamp" width='100%' style={{ ...displayStamp, display: isAiStampVisible ? 'block' : 'none' }} />
                        <img src={csStamp} alt="csStamp" width='100%' style={{ ...displayStamp, display: isCsStampVisible ? 'block' : 'none' }} />
                        <img src={ftStamp} alt="ftStamp" width='100%' style={{ ...displayStamp, display: isFtStampVisible ? 'block' : 'none' }} />
                        <img src={itStamp} alt="itStamp" width='100%' style={{ ...displayStamp, display: isItStampVisible ? 'block' : 'none' }} />
                        </div>
                        {/* Display message if no stamps are visible */}
                        {!isAiStampVisible && !isCsStampVisible && !isFtStampVisible && !isItStampVisible && (
                            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                                You have not collected anything.
                            </div>
                        )}
                    </div>
                )}
    
                {isDropdownWorkshopOpen && (
                    <div class='dropdown' style={{ ...dropdownStyle }}>
                        {/* Workshop stamps would go here */}
                        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                                You have not collected anything.
                            </div>
                    </div>
                )}
            </div>
        </div>
    );
      
    // Function to toggle AI stamp visibility
    const toggleAiStamp = () => {
        const newValue = !isAiStampVisible;
        setAiStampVisible(newValue);
        localStorage.setItem('aiStampVisible', newValue);
    };

    // Function to toggle Cs stamp visibility
    const toggleCsStamp = () => {
        const newValue = !isCsStampVisible;
        setCsStampVisible(newValue);
        localStorage.setItem('csStampVisible', newValue);
    };

    // Function to toggle Ft stamp visibility
    const toggleFtStamp = () => {
        const newValue = !isFtStampVisible;
        setFtStampVisible(newValue);
        localStorage.setItem('ftStampVisible', newValue);
    };

    // Function to toggle It stamp visibility
    const toggleItStamp = () => {
        const newValue = !isItStampVisible;
        setItStampVisible(newValue);
        localStorage.setItem('itStampVisible', newValue);
    };



      // Styles
    const dropdownStyle = {
        overflow: 'hidden',
        transition: 'height 0.3s ease-in-out',
        border: '1px solid #ddd', // Optional: border to visually separate the dropdown
        backgroundColor: '#fafafa'
    };
        
    
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
    

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns
        gap: '10px', // Space between stamps
        justifyItems: 'center', // Center items in their grid cells
        marginTop: '20px', // Space above the grid
      };
    

    // Handle File Upload Cartoonify

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };

    const handleUpload = async () => {
    if (!file) {
        alert("Please select a file first.");
        return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://www.cutout.pro/api/v1/cartoonSelfie?cartoonType=1', {
        method: 'POST',
        headers: {
            'APIKEY': '618aec9118be4ef49838a46064692ad9',
        },
        body: formData,
        });

        if (!response.ok) {
        throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setOutput(imageUrl);

        // Save the image URL to local storage
        localStorage.setItem('uploadedImage', imageUrl);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
    };

    const handleRemoveImage = () => {
        setOutput(null);
        localStorage.removeItem('uploadedImage');
      };

    const handleDropChange = (event) => {
    setSelectedValue(event.target.value);
    };

    const photo_link = `https://openhouse2025-images-repo.s3.ap-southeast-1.amazonaws.com/user_profile/${ticket_id}/profile.png`
    const form_sg = `https://form.gov.sg/66e14a264cccbc8d098f46d1?66e14a409253225fefacaf1a=${ticket_id}`
    
    return (
        <Box>
            <img src={nyp_logo} width="60%" style={{ margin: "0px 0px 20px 0px" }} alt="NYP Logo" />


            {/* Show All Stamp Button */}
            <Box className="profile_box" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '5%', right: '10%' }}>
                    <Popup
                        trigger={
                            <button
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    borderRadius: '50%', // Circular shape
                                    width: '100px', // Set width and height for hitbox
                                    height: '100px',
                                    padding: '0',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={clickHereStamp}
                                    alt="Click Here"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover', // Adjust size here
                                    }}
                                />
                            </button>
                        }
                        position="right center"
                        modal
                        overlayStyle={overlayStyle}
                        contentStyle={popupContentStyle}
                    >
                        {close => <ModalContent close={close} />}
                    </Popup>
                </div>

                <Box className="profilePicture">
                    <img src={photo_link} alt="Output" className="profileImage" />
                </Box>
            </Box>
            <Box class="boxForm">
                <a href={form_sg} target="_blank" rel="noopener noreferrer">
                    <button class="formSg">Go to Form Page</button>
                </a>
            </Box>
            <h1>NYP BOARDING PASS</h1>
            <Paper elevation={2} sx={{ borderRadius: "20px", paddingBottom: "10px"}}>
                <Box class="QRBox">
                    <a href="#"><img src={qrImage} alt="QR Code" /></a>
                </Box>
            </Paper>
            <Paper className="BoardingPass" elevation={2} sx={{ borderRadius: "20px", borderTop: "1px dotted black"}}>
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
                                {ticket_id}
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
            <Button variant="contained" color="primary" onClick={refreshId} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', margin: '0 auto', width:'60%' }}>
                Refresh ID
            </Button>
                {/* Button to cycle through booth names */}
                <Button variant="contained" color="primary" onClick={handleCycleBooth} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', margin: '0 auto', width:'60%' }}>
                    Change Booth
                </Button>
                {/* New button to increment queue number */}
                <Button variant="contained" color="primary" onClick={handleIncrementQueue} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', margin: '0 auto', width:'60%' }}>
                    Add Queue Number
                </Button>
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
        </Box>
    );
}

export default UserLanding;