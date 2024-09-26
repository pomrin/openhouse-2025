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

// RedemptionPage Component
// This component handles the redemption process for visitors' luggage tags.
// Mockup codes to be changed/deleted once backend done

function RedemptionPage() {
    const navigate = useNavigate();
    
     // Fake API for testing
     const [ticketId, setTicketId] = useState('');
     // Function to generate a random user ID
     const generateRandomUserId = () => {
         const randomString = Math.random().toString(36).substring(2, 9).toUpperCase(); // Generates 8-character string
         return `U${randomString}`;
     };
     // Function to convert user_id to ticket_id
     const generateTicketId = (userId) => {
         return userId.replace('U', 'T'); // Replace the starting U with T
     };
     // Call function to generate new UID on page load/refresh
     useEffect(() => {
         const userId = generateRandomUserId();
         const ticketId = generateTicketId(userId);
         setTicketId(ticketId); // Set the ticket_id to state
     }, []);
     // Mock API call to redeem the tag
     const redeemTag = async () => {
        try {
            // Simulate an API call with a delay
            const mockResponse = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,  // Simulate successful API response
                        message: 'Tag redeemed successfully!',
                        ticket_id: ticketId,
                        color: selectedColor,
                    });
                }, 2000);
            });
    
            console.log(mockResponse.message);
            console.log('Ticket ID:', mockResponse.ticket_id);
            console.log('Selected Color:', mockResponse.color);
    
            return mockResponse; // Return the response
        } catch (error) {
            console.error('Error redeeming tag:', error);
            return { success: false }; // Return failure in case of error
        }
    };
    // End of fake API (TBD)

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
    }

    const eligibilityContentContainerStyle = {
        width: '95%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '10px',
        background: '#dedede',
        padding: '10px 0'
    }

    const returnBtnStyle = {
        border: '1px solid grey', 
        borderRadius: '5px', 
        marginTop: '5%', 
        color: 'black'
    }

    const submitFormBtnStyle = {
        width: '90%', 
        padding: '5px', 
        backgroundColor: '#008080',
        color: 'white',
        border: '1px solid black'
    }

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
    }
    
    // Placeholder colors (TBC)
    const tagColors = [
        { name: 'Salmon', hex: '#FA8072' },
        { name: 'Beige', hex: '#F5F5DC' },
        { name: 'Mint', hex: '#98FF98' },
        { name: 'Blue', hex: '#87CEEB' },
        { name: 'Purple', hex: '#9370DB' }
    ]

    // Tag Color buttons for redemption form
    const [selectedColor, setSelectedColor] = useState('');
    
    const TagColorsRadioBtns = ({ selectedColor, setSelectedColor }) => {
        return (
            <RadioGroup
            aria-label="tagColor"
            name="tagColorOptions"
            value={selectedColor}
            onChange={(event) => setSelectedColor(event.target.value)}
            sx={{ display: 'flex', flexDirection: 'row', marginY: '3%' }}
          >
            {tagColors.map((color) => (
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
                label="" // No label, only circles
              />
            ))}
          </RadioGroup>
        );
    };

    // Handle tag color form submission
    const submitUserRedemption = async () => {
        try {
            const result = await redeemTag();   // Mock API for testing
            
            if (result.success) {
                showToast('Tag redeemed successfully!', 'success');
                setIsPopupOpen(false); 
            } else {
                showToast('Failed to redeem tag, please try again.', 'error');
            }
        } catch (error) {
            console.error('Error redeeming tag:', error); 
            showToast('An error occurred while redeeming the tag. Please try again.', 'error');
        } finally {
            setSelectedColor(null);
        }
    };

    // Eligibility modal content
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [eligibilityStatus, setEligibilityStatus] = useState(null); // Track visitor's elgibility status
   
    const closePopup = () => {
        setIsPopupOpen(false);
    };
    
    const EligibilityContent = ({ eligibility }) => {
        let content;
        
        // Cases (waiting on backend bfr change)
        switch (eligibility) {
            case 'missing_stamps':
                content = (
                    <Typography variant="body2" sx={{ textAlign: 'center', marginBottom: '20px' }}>
                        User has yet to collect all stamps.
                    </Typography>
                );
                break;
            case 'already_redeemed':
                content = (
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                        Visitor has already redeemed their luggage tag.
                    </Typography>
                );
                break;
            case 'eligible':
                content = (
                  <><Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', marginBottom: '20px' }}>
                        Visitor Eligible
                    </Typography>
                    <img src={placeholderTag} width='85%' alt="Luggage Tag"/>
                    <FormControl component='fieldset' id="tagColorForm" sx={{ alignItems: 'flex-start', paddingY: '5%', marginLeft: '5%' }}>
                        <Typography variant="body1">Preferred Color</Typography>
                        <TagColorsRadioBtns selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                        {selectedColor && ( 
                            <Button style={submitFormBtnStyle} onClick={submitUserRedemption}>
                                Proceed with Redemption
                            </Button>
                        )}
                    </FormControl></>
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
                        <EligibilityContent eligibility={eligibility} />
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
    const [scannerActive, setScannerActive] = useState(false); // Tracks if the scanner is active
    
    // Track whether scanner is active
    const isScannerInitialized = useRef(false);

    // Initialize or restart the scanner
    const startScanner = () => {
        if (isScannerInitialized.current) {
            console.log("Scanner already initialized"); // Debug
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
                isScannerInitialized.current = true; // Set scanner as active ( for tracking )

            }).catch((err) => {
                console.log("Failed to start scanner:", err); // Debug
                isScannerInitialized.current = false;
                showToast("Camera is blocked or not accessible.", 'warning');
            });
        }
    };

    // Handle successful QR scan
    const onScanSuccess = async (result) => {
        try {
            // Actual API call to be inserted here

            // Mockup of API call
            console.log('QR code scanned: ', result.data);
    
            // Simulate async operation (e.g., validating scanned QR code)
            const isValid = await simulateAsyncValidation(result.data);
    
            // Set eligibility status based on scanned data
            if (isValid.includes('eligible')) {
                setEligibilityStatus('eligible');
            } else if (isValid.includes('missing_stamps')) {
                setEligibilityStatus('missing_stamps');
            } else if (isValid.includes('already_redeemed')) {
                setEligibilityStatus('already_redeemed');
            } else {
                setEligibilityStatus('unknown'); // Fallback if QR code doesn't match known values
            }
            // End of mockup

            setIsPopupOpen(true); // Open modal popup
    
            if (scanner.current) {
                await scanner.current.stop();
                isScannerInitialized.current = false;
                setScannerActive(false); // Stop scanner
            }
        } catch (error) {
            console.error("Error in onScanSuccess:", error); // Debug
        }
    };
    
    // Simulate async QR code validation
    const simulateAsyncValidation = async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data); // Simulate async response, resolve the scanned data
            }, 1000);
        });
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
                                1. Press button above to start QR scanner. <br />
                                2. Align the visitor's code within the frame.
                            </Typography>
                        </Grid>
                        <Grid item xs={11}>
                            <Button variant="contained" onClick={() => navigate('/')} sx={{ borderRadius: '20px', boxShadow: '1em', padding: '13px 25px', border: '1px solid gray', marginY: '12%' }}>
                                Return
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