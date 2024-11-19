import React, { useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import QrScanner from 'qr-scanner';

import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Grid, Button, RadioGroup } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import '../css/BoothRedemption.css';
import CustomCircularProgress from './../components/customLoader.jsx';

import http from './http.js';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Ticket IDs for testing in order ( Eligible, Already redeemed, Missing stamps ): NYP0001THU | NYP0275TUE | NYP0002FRI

function RedemptionPage() {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(null);

    const [tagColors, setTagColors] = useState([]);
    const [colorsFetched, setColorsFetched] = useState(false); // Track whether colors have been fetched

    // Ensure user is an admin/booth helper
    useEffect(() => {
        // Retrieve accessToken from localStorage
        const token = localStorage.getItem('adminAccessToken');

        if (!token) {
            // If no token, redirect to login page
            navigate('/adminlogin');
        } else {
            // Set the accessToken
            setAccessToken(token);
        }
    }, [navigate]);

    // Fetch tag colors once access token is available
    useEffect(() => {
        if (accessToken && !colorsFetched) {
            fetchColors();
        }
    }, [accessToken, colorsFetched]);

    // Return to booth selection pg
    const handleBack = () => {
        navigate('/selectbooth');
    };

    // Fetch luggage tag colors from database
    const fetchColors = async () => {
        try {
            const colors = await getTagColors();
            setTagColors(colors);
            setColorsFetched(true); // Set to true after fetching colors
        } catch (error) {
            console.error('Error fetching colors:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching is complete
        }
    };

    // Progress Loader
    const [loading, setLoading] = useState(true); // State used to manage page load if auth token hasn't been stored
    const [scannerLoading, setScannerLoading] = useState(false); // State used to manage loader display when awaiting API response

    //Styles
    const pageContentStyle = {
        height: '95vh',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'top',
        alignItems: 'center',
        paddingTop: '64px',
        paddingBottom: '20px'
    };

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
        margin: '3% 0'
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
        overflowY: 'scroll',
        overflowX: 'hidden',
        backgroundColor: 'white',
        borderRadius: '10px',
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
        padding: '5px 0',
        marginLeft: '3%',
        overflowX: 'hidden'
    };

    const returnBtnStyle = {
        border: '1px solid grey',
        borderRadius: '5px',
        marginTop: '5%',
        color: 'black'
    };

    const submitEligibleFormBtnStyle = {
        width: '90%',
        padding: '5px',
        backgroundColor: '#008080',
        color: 'white',
        border: '1px solid black',
        marginLeft: '1%'
    };

    const submitUpdateFormBtnStyle = {
        width: '90%',
        padding: '5px',
        backgroundColor: '#008080',
        color: 'white',
        border: '1px solid black',
        marginLeft: '5%'
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

    // Tag Color buttons for redemption/update form
    const TagColorsRadioBtns = ({ tagColors, selectedColor, setSelectedColor }) => {
        // Ensure tagColors is not empty
        if (!Array.isArray(tagColors) || tagColors.length === 0) {
            return <div>Error loading colors, please refresh the page and try again</div>;
        }

        // Handle selection change
        const handleColorChange = (event) => {
            const selectedColorName = event.target.value;
            const selectedColorObj = tagColors.find(color => color.luggageTagColorName === selectedColorName);
            setSelectedColor(selectedColorObj); // Update with the entire color object
        };

        // Split tagColors array into smaller arrays (for each row)
        const chunkArray = (array, chunkSize) => {
            const result = [];
            for (let i = 0; i < array.length; i += chunkSize) {
                result.push(array.slice(i, i + chunkSize));
            }
            return result;
        };

        const colorRows = chunkArray(tagColors, 3); // Each row to contain only 3 colors

        return (
            <>
                {colorRows.map((row, rowIndex) => (
                    <RadioGroup
                        key={rowIndex}
                        aria-label="tagColor"
                        name={`tagColorOptions-${rowIndex}`}
                        value={selectedColor ? selectedColor.luggageTagColorName : ''}
                        onChange={handleColorChange}
                        sx={{ display: 'flex', flexDirection: 'row', marginY: '3%', flexWrap: 'nowrap' }}
                    >
                        {row.map((color) => (
                            <FormControlLabel
                                key={color.luggageTagColorName}
                                value={color.luggageTagColorName}
                                control={
                                    <Radio
                                        sx={{
                                            color: color.luggageTagColorCode,
                                            '&.Mui-checked': {
                                                color: color.luggageTagColorCode,
                                            },
                                            '& .MuiSvgIcon-root': {
                                                borderRadius: '50%',
                                                width: 30,
                                                height: 30,
                                                backgroundColor: color.luggageTagColorCode,
                                                border: '2px solid transparent',
                                            },
                                            '&.Mui-checked .MuiSvgIcon-root': {
                                                borderColor: 'black',
                                            },
                                        }}
                                    />
                                }
                                label={color.luggageTagColorName}
                            />
                        ))}
                    </RadioGroup>
                ))}
            </>
        );
    };

    // Handle tag color form submission
    const [ticketId, setTicketId] = useState(null);

    const submitUserRedemption = async () => {
        try {
            const result = await redeemVisitorTag(ticketId, selectedColor);
            // handleVisitorRedemption(result);
        } catch (error) {
            console.log('Error submitting redemption:', error);
            showToast('An error occurred while redeeming the tag. Please try again.', 'error');
        } finally {
            setSelectedColor(null); // Reset form selection color
        }
    };

    const submitUpdatedTagColor = async () => {
        try {
            const result = await updateVisitorTag(ticketId, selectedColor);
            // handleVisitorTagUpdate(result);
        } catch (error) {
            console.log('Error submitting tag color update: ', error);
            showToast('An error occurred while updating the tag. Please try again.', 'error')
        } finally {
            setSelectedColor(null); // Reset form selection color
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

        // Clear selected color value (in the case user selected a color but cancelled)
        setSelectedColor(null);

        // Reset scanner timeout when closing popup
        resetScannerTimeout();

        setTimeout(() => {
            startScanner(); // Restart QR scanner after 1 sec delay
        }, 1000);
    };

    // The 3 different popup contents -> eligible / already_redeemed / ineligible
    const EligibilityContent = ({ eligibility, selectedColor, setSelectedColor }) => {
        let content;

        switch (eligibility) {
            case 'eligible':
                content = (
                    <><Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', marginY: '10px' }}>
                        Visitor is eligible for luggage tag redemption 🎉
                    </Typography>
                        <Typography variant='body2' sx={{ padding: '2%', textAlign: 'center' }}>
                            Assist the visitor in their redemption process by selecting their preferred tag color below:
                        </Typography>

                        <Box sx={{ backgroundColor: 'rgb(200,200,200)', padding: '2%', borderRadius: '8px', marginTop: '2%' }}>
                            {/* Color selection form */}
                            <FormControl component='fieldset' id="tagColorForm" sx={{ alignItems: 'flex-start', paddingY: '5% 5% 1% 5%', margin: '2% 0 1% 4%' }}>
                                <Typography variant="body1">Preferred Color: </Typography>
                                <TagColorsRadioBtns tagColors={tagColors} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                                <Box sx={{ width: '100%', margin: '0 0 10px -1%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                    <Typography variant="body1">Selected color:</Typography>
                                        <Box
                                            sx={{
                                                width: '30px',
                                                height: '30px',
                                                backgroundColor: selectedColor ? selectedColor.luggageTagColorCode : 'transparent',
                                                borderRadius: '50%',
                                                border: '1px solid black',
                                                marginLeft: '3%'
                                            }}
                                        />
                                        <Typography variant="body1" id='CurrentSelectedColor' sx={{ fontWeight: 500, marginLeft: '2%' }}>
                                            {selectedColor ? selectedColor.luggageTagColorName : '-'}  {/* Display selected color name */}
                                        </Typography>
                                    </Box>
                                    {selectedColor && (
                                        <Button style={submitEligibleFormBtnStyle} onClick={submitUserRedemption}>
                                            Proceed with Redemption
                                        </Button>
                                    )}
                            </FormControl>
                        </Box></>
                );
                break;
            case 'already_redeemed':
                content = (
                    <><Typography variant="h6" sx={{ fontWeight: 700, marginY: '10px', textAlign: 'center' }}>
                        Visitor has already redeemed their luggage tag 🏷️
                    </Typography>
                        <Typography variant='body2' sx={{ textAlign: 'center' }}>
                            If they would like a tag color change*, please select their new color choice below.
                        </Typography>
                        <Typography variant='caption' sx={{ color: '#ff0000' }}>
                            *Color change applicable only for unengraved tags
                        </Typography>
                        <Box sx={{ backgroundColor: 'rgb(200,200,200)', padding: '2%', borderRadius: '8px', marginTop: '2%' }}>
                            {/* Display Current Color */}
                            <Box sx={{ marginY: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                <Typography variant="body2">Current tag color:</Typography>
                                <Box sx={{
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: currentColor ? currentColor.toLowerCase() : 'transparent',
                                    borderRadius: '50%',
                                    border: '1px solid black',
                                    marginLeft: '3%',
                                }}
                                />
                                <Typography variant="body2" sx={{ fontWeight: 500, marginLeft: '2%' }}>
                                    {currentColor || '----'}  {/* Display current color name */}
                                </Typography>
                            </Box>

                            {/* Color selection form */}
                            <FormControl component="fieldset" id="updateColorForm" sx={{ alignItems: 'flex-start', padding: '5% 6% 0 0', margin: '0 0 10px 3%' }}>
                                <Typography variant="body1" sx={{ textAlign: 'start' }}>Select New Tag Color</Typography>
                                <TagColorsRadioBtns tagColors={tagColors} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                                <Box sx={{ width: '100%', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                    <Typography variant="body1">Selected color:</Typography>
                                    <Box
                                        sx={{
                                            width: '30px',
                                            height: '30px',
                                            backgroundColor: selectedColor ? selectedColor.luggageTagColorCode : 'transparent',
                                            borderRadius: '50%',
                                            border: '1px solid black',
                                            marginLeft: '3%'
                                        }}
                                    />
                                    <Typography variant="body1" id='CurrentSelectedColor' sx={{ fontWeight: 500, marginLeft: '2%' }}>
                                        {selectedColor ? selectedColor.luggageTagColorName : '-'}  {/* Display selected color name */}
                                    </Typography>
                                </Box>
                                {selectedColor && selectedColor.luggageTagColorName !== currentColor && (
                                    <Button style={submitUpdateFormBtnStyle} onClick={submitUpdatedTagColor}>
                                        Update Tag Color
                                    </Button>
                                )}
                            </FormControl>
                        </Box></>
                );
                break;
            case 'ineligible':
                content = (
                    <><Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', marginY: '10px' }}>
                        Visitor is ineligible for luggage tag redemption ❌
                    </Typography>
                        <Typography variant='body2' sx={{ textAlign: 'center', padding: '1%' }}>
                            Visitor has not met redemption prerequisites by visiting and collecting stamps from all required booths.
                        </Typography></>
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
                    <Button onClick={closePopup} style={returnBtnStyle}>Close</Button>
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

                // Reset timeout when the scanner starts
                resetScannerTimeout();

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
        if (!loading && accessToken) {
            startScanner();
        }
    }, [loading, accessToken]);

    // Reset scanner timeout
    const resetScannerTimeout = () => {
        if (scannerTimeout.current) {
            clearTimeout(scannerTimeout.current); // Clear existing timeout
        }

        // Set a new timeout to stop the scanner if inactive for too long
        scannerTimeout.current = setTimeout(() => {
            handleScannerTimeout();
        }, 60000);  // 1 minute timeout
    };

    // Handle scanner timeout
    const handleScannerTimeout = () => {
        if (scanner.current) {
            stopScanner(); // Call the stopScanner function to stop the scanner
            showToast("Scanner stopped due to inactivity.", 'info');
        }
    };

    const [currentColor, setCurrentColor] = useState(null);  // State to store the current color

    // Handle successful QR scan
    const onScanSuccess = async (result) => {
        if (hasValidated) return; // Prevent multiple validations

        try {
            stopScanner(); // Stop QR scanner upon successful scan
            const ticketId = result.data;
            setTicketId(ticketId);

            // (1) Check if ticket ID is valid
            const apiResponse = await eligibilityValidation(ticketId);

            // (2) Display content according to visitor eligibility
            // await handleEligibilityResponse(apiResponse, ticketId);

            // Reset scanner timeout after processing
            resetScannerTimeout();

        } catch (error) {
            console.log("Error in onScanSuccess:", error);
            showToast('An error occurred while validating the ticket.', 'error');
        }
    };

    // API connections and response handling ( 4 API functions )

    // (1a) API (GET) call to validate visitor's redemption eligibility
    const eligibilityValidation = async (ticketId) => {
        setScannerLoading(true);
        try {

            const response = await http.get(`${apiUrl}/AdminVisitorBooth`, {
                params: {
                    ticketId: ticketId
                }
            });

            await handleEligibilityResponse(response, ticketId);
            return;
        } catch (error) {

            const errorCode = error.status;
            if (errorCode == 400 || errorCode == 404 || errorCode == 409) {
                await handleEligibilityResponse(error, ticketId);
            } else {
                throw error;
            }
        } finally {
            setScannerLoading(false);
        }
    };

    // (1b) Process API response to determine visitor's eligibility and content to display
    const handleEligibilityResponse = async (apiResponse, ticketId) => {
        switch (apiResponse.status) {
            case 200:
                // Response 200: User is eligible
                setEligibilityStatus('eligible');
                setIsPopupOpen(true);
                break;
            case 400:
                // Response 400: Visitor has not visited all required booths
                setEligibilityStatus('ineligible');
                setIsPopupOpen(true);
                break;
            case 404:
                // Response 404: Invalid ticket ID
                showToast('Ticket ID not found!', 'error');
                startScanner();
                break;
            case 409:
                // Response 409: Visitor has already redeemed tag
                setEligibilityStatus('already_redeemed');
                const currentColor = await setCurrentTagColor(ticketId);
                if (currentColor) {
                    setIsPopupOpen(true);
                } else {
                    console.log("Current color could not be fetched.");
                }
                break;
            default:
                showToast('Unexpected response from the server.', 'error');
                startScanner();
                break;
        }
    };

    // (2a) API (POST) call to redeem visitor's luggage tag
    const redeemVisitorTag = async (ticketId, selectedColor) => {
        setScannerLoading(true);
        const requestBody = {
            ticketId: ticketId,
            luggageTagColor: selectedColor.luggageTagColorName
        };

        try {
            const response = await http.post(`${apiUrl}/AdminRedemption`,

                requestBody
            );
            // console.log(`redeemVisitorTag response: ${JSON.stringify(response.status)}`);
            handleVisitorRedemption(response);
            return response;
        } catch (error) {
            // console.log(`redeemVisitorTag error response: ${JSON.stringify(error)}`);
            handleVisitorRedemption(error);
            console.log('Error redeeming tag:', error);

        } finally {
            setScannerLoading(false);
        }
    };

    // (2b) Process API response and display content accordingly
    const handleVisitorRedemption = (response) => {
        console.log(`handleVisitorRedemption response: ${JSON.stringify(response.status)}`);
        switch (response.status) {
            case 200:
                // Response 200: Successful redemption
                showToast('Tag redeemed successfully!', 'success');
                setIsPopupOpen(false);
                break;
            case 400:
                // Response 400: Missing parameter or invalid luggage color
                showToast('Invalid color or missing parameter. Please try again.', 'error');
                break;
            case 404:
                // Invalid ticket ID
                showToast('Ticket ID not found!', 'error');
                startScanner();
                break;
            case 409:
                // Response 409: Visitor already redeemed tag
                showToast('Visitor has already redeemed a tag');
                break;
            default:
                showToast(response.message || 'Failed to redeem tag, please try again.', 'error');
                break;
        }
    };

    // (3a) API (PUT) call to update visitor's luggage tag color
    const updateVisitorTag = async (ticketId, selectedColor) => {
        setScannerLoading(true);
        const requestBody = {
            ticketId: ticketId,
            luggageTagColor: selectedColor.luggageTagColorName
        };

        try {

            const response = await http.put(`${apiUrl}/AdminRedemption`, requestBody);
            handleVisitorTagUpdate(response);
        } catch (error) {
            handleVisitorTagUpdate(error);
            console.log('Error updating tag:', error);
        } finally {
            setScannerLoading(false);
        }
    };

    // (3b) Process API response and display content accordingly
    const handleVisitorTagUpdate = (response) => {
        switch (response.status) {
            case 200:
                // Response 200: Successful update
                showToast('Tag updated successfully!', 'success');
                setIsPopupOpen(false);
                break;
            case 400:
                // Response 400: Missing parameter or invalid luggage color
                showToast('Invalid color or missing parameter. Please try again.', 'error');
                break;
            case 404:
                // Response 404: Ticket ID not found
                showToast('Ticket ID not found. Please try again.', 'error');
                break;
            default:
                showToast(response.message || 'Failed to update tag, please try again.', 'error');
                break;
        }
    };

    // (4a) API (GET) to retrieve associated tag color for update content
    const getTagCurrentColor = async (ticketId) => {
        try {

            const response = await http.get(`${apiUrl}/AdminVisitor`, {
                params: {
                    ticketId: ticketId
                }
            });

            if (response.status != 200) {
                throw new Error('Failed to fetch visitor data from API');
            }

            console.log(`getTagCurrentColor response : ${JSON.stringify(response.data)}`);

            const data = response.data;
            return data.luggageTagColorName;  // Return the luggage tag color name
        } catch (error) {
            console.log("Error retrieving visitor's current tag color:", error);
            throw error;
        }
    };

    // (4b) Set current tag color in state
    const setCurrentTagColor = async (ticketId) => {
        if (ticketId) {
            try {
                const color = await getTagCurrentColor(ticketId);
                if (color) {
                    setCurrentColor(color);
                    return color;
                } else {
                    console.error("Color not found in response.");
                }
            } catch (error) {
                console.error("Error fetching current color:", error);
            }
        } else {
            console.error("Ticket ID is null, cannot fetch color");
        }
    };

    // (5) Retrieve tag colors [ name & color hex ]
    const getTagColors = async () => {
        try {

            const response = await http.get(`${apiUrl}/LuggageTagColors`, {
            });
            if (response.status != 200) {
                throw new Error('Failed to fetch tag colors from API');
            }

            const data = response.data;
            return data; // Return the colors data
        } catch (error) {
            console.log('Error retrieving luggage tag colors:', error);
            throw error; // Rethrow the error to be caught in fetchColors
        }
    };

    // Render a loading spinner if token not retrieved yet
    if (loading) {
        return (
            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <Box id="pageContent" style={pageContentStyle}>

                {/* Back button */}
                <Box display="flex" width="100%" justifyContent="flex-start">
                    <IconButton onClick={handleBack} aria-label="Go Back">
                        <ArrowBackIcon />
                        <Typography variant="h6" sx={{ my: 1 }}>
                            Back
                        </Typography>
                    </IconButton>
                </Box>

                {/* Successful scan popup */}
                <Popup open={isPopupOpen} onClose={closePopup}
                    modal
                    overlayStyle={overlayStyle}
                    contentStyle={popupContentStyle}>
                    {close => <ModalContent eligibility={eligibilityStatus} />}
                </Popup>

                {/* Main Content */}
                <Box id="contentContainer" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    height: '100vh'
                }}>
                    <Grid container spacing={2}>
                        {/* Booth name */}
                        <Grid item xs={12} id="boothName" sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ my: 2 }}>
                                QR Code Scanner
                            </Typography>

                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Current Booth: Redemption
                            </Typography>
                        </Grid>

                        {/* QR scanner */}
                        <Grid item xs={12} className="QRscannerContainer">
                            <Box id="QRscanner" sx={{
                                border: '3px solid #3f51b5',
                                width: '300px',
                                height: '300px',
                                borderRadius: '8px',
                                background: 'transparent',
                                overflow: 'hidden'
                            }}>
                                <video ref={videoEl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }}></video>
                                {/* Show "Start scanner" button if the scanner is not active; else show loader if awaiting API response */}
                                {!scannerLoading ? (
                                    !scannerActive && (
                                        <Button onClick={startScanner} style={{ ...startQRscannerBtn, zIndex: scannerActive ? -99 : 1 }}>
                                            Start scanner
                                        </Button>
                                    )
                                ) : (
                                    <CustomCircularProgress />
                                )}
                                <div ref={qrBoxEl} className="qr-box"></div>
                            </Box>
                        </Grid>
                        <Grid item xs={12} className="botContainer" sx={{ flexDirection: 'column' }}>
                            <Grid item xs={11} sx={{ textAlign: 'center', background: '#f0f0f0', borderRadius: '15px', marginY: '1%' }}>
                                <Typography variant='body1' sx={{ padding: '10px', marginY: '5%' }}>
                                    Align visitor's QR code within frame to begin redemption process.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Snackbar open={openToast} autoHideDuration={3000} onClose={closeToast}>
                        <Alert
                            onClose={closeToast}
                            severity={toastSeverity}
                            variant="filled"
                            sx={{ width: '80%' }}>
                            {toastMessage}
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
        </Box>
    );
}

export default RedemptionPage;