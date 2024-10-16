import React, { useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import QrScanner from 'qr-scanner';

import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Button, RadioGroup } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';

import '../css/BoothRedemption.css';
import nyp_logo from "./../assets/nyp_logo.png";
import placeholderTag from './../assets/images/luggage-tag.webp';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Auth token for test (TBD)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQU1JTFlOIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQk9PVEhfSEVMUEVSIiwibmJmIjoxNzI5MDUxOTU3LCJleHAiOjE3MjkxMzgzNTcsImlzcyI6InNpdC5ueXAuZWR1LnNnIiwiYXVkIjoic2l0Lm55cC5lZHUuc2cifQ.v49hKAVN5jndF_tUvyYfty_8LsG9qVRCTtiJqz0vOxw';

// RedemptionPage Component
// This component handles the redemption process for visitors' luggage tags.
// Mockup codes to be changed/deleted once backend done

function RedemptionPage() {
    const navigate = useNavigate();
    
    //Styles
    const overlayStyle = {
        background: 'rgba(0, 0, 0, 0.7)' // Transparent black background
    };

    const overlayContentStyle = {
        maxHeight: 'calc(100vh - 40px)', // Ensure modal content area is scrollable if it overflows
        overflowY: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        margin: '8% 0'
    };

    const popupContentStyle = {
        width: '100%', // Full width
        height: '100vh', // Full height
        padding: '0', // Remove default padding
        border: 'none', // Remove default border
        display: 'flex',
        alignItems: 'center', // Center content vertically
        justifyContent: 'center', // Center content horizontally
        background: 'rgba(0, 0, 0, 0.7)' // Transparent black background
    };

    const modalContentStyle = {
        width: '90%',
        overflowY: 'hidden',
        backgroundColor: 'white',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const eligibilityContentContainerStyle = {
        width: '95%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '10px',
        background: '#dedede',
        padding: '10px 0'
    };

    const returnBtnStyle = {
        border: '1px solid grey', 
        borderRadius: '5px', 
        marginTop: '5%', 
        color: 'black'
    };

    const submitFormBtnStyle = {
        width: '90%', 
        padding: '5px', 
        backgroundColor: '#008080',
        color: 'white',
        border: '1px solid black'
    };

    const startQRscannerBtn = {
    position: 'relative', 
    bottom: '60%',
    left: '23%',
    borderRadius: '10px', 
    padding: '10px', 
    margin: '5px 15px', 
    backgroundColor: 'rgba(211,211,211,0.6)', 
    color: 'grey',
    Transition: 'z-index 0.55'
    };
    
    // Placeholder colors (According to colors in SQL database)
    const tagColors = [
        { name: 'BLACK', hex: '#000000' },
        { name: 'BLUE', hex: '#0000FF' },
        { name: 'GREEN', hex: '#00FF00' },
        { name: 'RED', hex: '#FF0000' },
        { name: 'YELLOW', hex: '#FFFF00' },
        { name: 'WHITE', hex: '#FFFFFF' }
    ];

    // Tag Color buttons for redemption form
    const TagColorsRadioBtns = ({ selectedColor, setSelectedColor }) => {
        // Split colors into two rows: max 5 per row
        const firstRowColors = tagColors.slice(0, 5);
        const secondRowColors = tagColors.slice(5);
    
        return (
            <><RadioGroup
                aria-label="tagColor"
                name="tagColorOptions"
                value={selectedColor}
                onChange={(event) => setSelectedColor(event.target.value)}
                sx={{ display: 'flex', flexDirection: 'row', marginY: '3%', flexWrap: 'nowrap' }}
            >
                {firstRowColors.map((color) => (
                    <FormControlLabel
                        key={color.name}
                        value={color.name}
                        control={
                            <Radio
                                sx={{
                                    color: color.hex,
                                    '&.Mui-checked': {
                                        color: color.hex,
                                    },
                                    '& .MuiSvgIcon-root': {
                                        borderRadius: '50%',
                                        width: 30,
                                        height: 30,
                                        backgroundColor: color.hex,
                                        border: '2px solid transparent',
                                    },
                                    '&.Mui-checked .MuiSvgIcon-root': {
                                        borderColor: 'black',
                                    },
                                }}
                            />
                        }
                        label=""
                    />
                ))}
            </RadioGroup>

            {/* Second row of colors */}
            <RadioGroup
                aria-label="tagColor"
                name="tagColorOptions"
                value={selectedColor}
                onChange={(event) => setSelectedColor(event.target.value)}
                sx={{ display: 'flex', flexDirection: 'row', marginY: '3%', flexWrap: 'nowrap' }}
            >
                {secondRowColors.map((color) => (
                    <FormControlLabel
                        key={color.name}
                        value={color.name}
                        control={
                            <Radio
                                sx={{
                                    color: color.hex,
                                    '&.Mui-checked': {
                                        color: color.hex,
                                    },
                                    '& .MuiSvgIcon-root': {
                                        borderRadius: '50%',
                                        width: 30,
                                        height: 30,
                                        backgroundColor: color.hex,
                                        border: '2px solid transparent',
                                    },
                                    '&.Mui-checked .MuiSvgIcon-root': {
                                        borderColor: 'black',
                                    },
                                }}
                            />
                        }
                        label=""
                    />
                ))}
            </RadioGroup></>
        );
    };

    // Handle tag color form submission
    const [ticketId, setTicketId] = useState(null);

    const submitUserRedemption = async () => {
        try {
            const result = await sendToRedemptionApi(ticketId, selectedColor); 
            
            if (result.success) {
                showToast('Tag redeemed successfully!', 'success');
                setIsPopupOpen(false); 
            } else {
                showToast(result.message || 'Failed to redeem tag, please try again.', 'error');
            }
        } catch (error) {
            console.log('Error submitting redemption:', error);
            showToast('An error occurred while redeeming the tag. Please try again.', 'error');
        } finally {
            setSelectedColor(null);
        }
    };

    // Eligibility modal content
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [eligibilityStatus, setEligibilityStatus] = useState(null); // Track visitor's elgibility status
    const [selectedColor, setSelectedColor] = useState(null);

    const closePopup = () => {
        setIsPopupOpen(false);
        setHasValidated(false);
        setScannerActive(true);
        
        setTimeout(() => {
            startScanner(); // Restart QR scanner after 1 sec delay
        }, 1000);
    };
    
    const EligibilityContent = ({ eligibility, selectedColor, setSelectedColor }) => {
        let content;

        switch (eligibility) {
            case 'missing_stamps':
                content = (
                    <Typography variant="body2" sx={{ textAlign: 'center', marginY: '10px', width: '80%' }}>
                        Visitor has yet to collect all stamps.
                    </Typography>
                );
                break;
            case 'already_redeemed':
                content = (
                    <Typography variant="body2" sx={{ textAlign: 'center', marginY: '10px' }}>
                        Visitor has already redeemed their luggage tag.
                    </Typography>
                );
                break;
            case 'eligible':
                content = (
                    <>
                        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', marginBottom: '20px' }}>
                            Visitor Eligible
                        </Typography>
                        <img src={placeholderTag} width='85%' alt="Luggage Tag" />
                        <FormControl component='fieldset' id="tagColorForm" sx={{ alignItems: 'flex-start', paddingY: '5%', marginLeft: '5%' }}>
                            <Typography variant="body1">Preferred Color</Typography>
                            <TagColorsRadioBtns selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                            {selectedColor && (
                                <Button style={submitFormBtnStyle} onClick={submitUserRedemption}>
                                    Proceed with Redemption
                                </Button>
                            )}
                        </FormControl>
                    </>
                );
                break;
            default:
                content = (
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                        The scanned QR code does not seem to be a valid visitor's QR. <br />
                        Please rescan or contact support.
                    </Typography>
                );
                break;
        }

        return content;
    };
    
    const ModalContent = ({ eligibility }) => {
        return (
            <Box style={modalContentStyle}>
                <Box style={overlayContentStyle}>
                    <Box id="eligibilityStatusContainer" style={eligibilityContentContainerStyle}>
                        <EligibilityContent 
                            eligibility={eligibility} 
                            selectedColor={selectedColor} 
                            setSelectedColor={setSelectedColor} 
                        />
                    </Box>
                    <Button onClick={closePopup} style={returnBtnStyle}>Return</Button>
                </Box>
            </Box>
        );
    };
    
    // Toast States
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('info');

    const showToast = (message, severity) => {
        setToastMessage(message);
        setToastSeverity(severity);
        setOpenToast(true);
    };

    const closeToast = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenToast(false);
      };

    // QR States

    const scanner = useRef(null);
    const videoEl = useRef(null);
    const qrBoxEl = useRef(null);
    const scannerTimeout = useRef(null);
    const [scannerActive, setScannerActive] = useState(false); // Tracks if the scanner is active
    const [hasValidated, setHasValidated] = useState(false); // Tracks whether qr code has been validated
    
    // Track whether scanner is active
    const isScannerInitialized = useRef(false);

    // Initialize or restart the scanner
    const startScanner = () => {
        if (isScannerInitialized.current) {
            console.log("Scanner already initialized");  // Debugging
            return;
        }

        if (videoEl.current && !scanner.current) {
            scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
                preferredCamera: "environment",
                highlightScanRegion: true,
                highlightCodeOutline: true,
                overlay: qrBoxEl.current || undefined
            });
        }

        if (scanner.current) {
            scanner.current.start().then(() => {
                setScannerActive(true);
                isScannerInitialized.current = true;

                // Set a timeout to stop the scanner if inactive for too long
                scannerTimeout.current = setTimeout(() => {
                    handleScannerTimeout();
                }, 60000);  // 1 minute timeout
            }).catch((err) => {
                console.log("Failed to start scanner:", err);
                isScannerInitialized.current = false;
                showToast("Camera is blocked or not accessible.", 'warning');
            });
        }
    };

    // Stop scanner when needed
    const stopScanner = () => {
        if (scanner.current) {
            scanner.current.stop();
            isScannerInitialized.current = false;
            setScannerActive(false);
        }

        if (scannerTimeout.current) {
            clearTimeout(scannerTimeout.current);
            scannerTimeout.current = null;
        }
    };

    // Auto-start scanner on component load
    useEffect(() => {
        startScanner();
    }, []);

    // Handle scanner timeout
    const handleScannerTimeout = () => {
        if (scanner.current) {
            scanner.current.stop();
            isScannerInitialized.current = false;
            setScannerActive(false);
            showToast("Scanner stopped due to inactivity.", 'info');
        }
    };

    // Handle successful QR scan
    const onScanSuccess = async (result) => {
        if (hasValidated) return; // Prevent multiple validations

        try {
            stopScanner(); // Stop QR scanner upon successful scan
            const ticketId = result.data;
            setTicketId(ticketId);

            // Check if ticketId is valid
            const apiResponse = await eligibilityValidation(ticketId);

            // Handle the response from the API
            if (apiResponse.status === 200) {
                // Response 200: User is eligible
                setEligibilityStatus('eligible');
                setIsPopupOpen(true);
            } else if (apiResponse.status === 400) {
                // Response 400: Visitor has not visited all required booths
                setEligibilityStatus('missing_stamps');
                setIsPopupOpen(true);
            } else if (apiResponse.status === 404) {
                // Invalid ticket ID
                showToast('Ticket ID not found!', 'error');
            } else if (apiResponse.status === 409) {
                // Visitor has already redeemed tag
                setEligibilityStatus('already_redeemed');
                setIsPopupOpen(true);
            }

            setHasValidated(true); // Mark as validated
        } catch (error) {
            console.log("Error in onScanSuccess:", error);
            showToast('An error occurred while validating the ticket.', 'error');
        }
    };
    
    // Validate visitor's eligibility status
    const eligibilityValidation = async (ticketId) => {
        try {
            const response = await fetch(`${apiUrl}/VisitorBooth?ticketId=${encodeURIComponent(ticketId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                }
            });
            return response;
        } catch (error) {
            console.log("Error calling CheckRedemption API:", error);
            throw error;
        }
    };

    // Redeem visitor's luggage tag
    const sendToRedemptionApi = async (ticketId, selectedColor) => {
        const requestBody = {
            ticketId: ticketId,
            luggageTagColor: selectedColor
        };

    try {
        const response = await fetch(`${apiUrl}/Redemption`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (response.ok) {  
            // Response 200: Successful redemption
            console.log('Success:', result);
            showToast('Tag redeemed successfully!', 'success');
            setIsPopupOpen(false);  
        } else if (response.status === 400) {
            // Response 400: Missing parameter or invalid luggage color
            showToast('Invalid color or missing parameter. Please try again.', 'error');
        } else if (response.status === 404) {
            // Response 404: Ticket ID not found
            showToast('Ticket ID not found. Please check the ticket.', 'error');
        } else if (response.status === 409){
            // Response 409: Visitor already redeemed
            showToast('Visitor has already redeemed a tag');
        } else {
            // Other errors
            console.log('Unknown error:', result);
            showToast('An unexpected error occurred. Please try again.', 'error');
        }
    } catch (error) {
        console.log('Error redeeming tag:', error);
    }
};

    return (
        <><img src={nyp_logo} width="60%" style={{ margin: "0px 0px 20px 0px" }} alt="NYP Logo" />
        
        {/* Successful scan popup */}
        <Popup open={isPopupOpen} onClose={closePopup} 
            modal 
            overlayStyle={overlayStyle} 
            contentStyle={popupContentStyle}>
            {close => <ModalContent eligibility={eligibilityStatus} />}
        </Popup>

        <Box className="content">
            <Box id="contentContainer" sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',  
                alignItems: 'center',
                width: '100%',
                height: '100vh'
            }}>
                <Grid container spacing={3}>
                    {/* Booth name */}
                    <Grid item xs={12} id="boothName">
                        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, marginY: '5%' }}>
                            REDEMPTION
                        </Typography>
                    </Grid>
                    {/* QR scanner */}
                    <Grid item xs={12} className="QRscannerContainer">
                        <Box id="QRscanner" sx={{
                            border: '2px solid black',
                            width: '300px',
                            height: '300px',
                            borderRadius: '20px',
                            background: 'transparent',
                            
                        }}>
                            <video ref={videoEl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}></video>
                            {/* Show "Start scanner" button if the scanner is not active */}
                            {!scannerActive && (
                                <Button onClick={startScanner} style={{...startQRscannerBtn,  zIndex: scannerActive ? -99 : 99}}>
                                    Start scanner
                                </Button>
                            )}
                            <div ref={qrBoxEl} className="qr-box">
                            </div> 
                        </Box>
                    </Grid>
                    <Grid item xs={12} className="botContainer" sx={{ flexDirection: 'column' }}>
                        <Grid item xs={11} sx={{ textAlign: 'center', background: '#f0f0f0', borderRadius: '15px', marginY: '1%' }}>
                            <Typography variant='body1' sx={{ padding: '10px', marginY: '5%' }}>
                                Align visitor's QR code within frame to begin redemption process.
                            </Typography>
                        </Grid>
                        <Grid item xs={11}>
                            <Button variant="contained" onClick={() => navigate('/')} sx={{ borderRadius: '20px', boxShadow: '1em', padding: '13px 25px', border: '1px solid gray', marginY: '12%' }}>
                                Return
                            </Button>
                        </Grid>

                        {/* Testing (TBD) */}
                        <Grid item xs={11}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setEligibilityStatus('eligible');
                                    setIsPopupOpen(true); // Open the eligibility popup
                                }}
                                sx={{ borderRadius: '20px', boxShadow: '1em', padding: '13px 25px', border: '1px solid gray', marginY: '12%' }}
                            >
                                Test Eligibility
                            </Button>
                        </Grid>

                    </Grid>
                </Grid>
            </Box>
            <div>
                <Snackbar open={openToast} autoHideDuration={3000} onClose={closeToast}>
                    <Alert
                        onClose={closeToast}
                        severity= {toastSeverity}
                        variant="filled"
                        sx={{ width: '80%' }}>
                        {toastMessage}
                    </Alert>
                </Snackbar>
            </div>
        </Box></>
    );
}

export default RedemptionPage;