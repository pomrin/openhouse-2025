import React, { useState, useEffect, useRef } from 'react';
import { Container, AppBar, Toolbar, Box, Typography, Button, Link } from '@mui/material';
import Paper from '@mui/material/Paper';
import '../css/UserLandingDemo.css';
import '../App.css';
import plane_image from './../assets/images/plane_image.png';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import aiStamp from './../assets/images/ai_stamp.svg';
import csStamp from './../assets/images/cs_stamp.svg';
import ftStamp from './../assets/images/ft_stamp.svg';
import itStamp from './../assets/images/it_stamp.svg';
import clickHereStamp from './../assets/images/clickHere_stamp.svg';
import noImageUploaded from './../assets/images/noImageUploaded.png';
import boothimage1 from './../assets/images/step1.png';
import boothimage2 from './../assets/images/step2.png';
import boothimage3 from './../assets/images/step3.png';
import boothimage4 from './../assets/images/step4.png';
import uploadProfile from './../assets/images/upload_profile.png';
import circleAnimation from './../assets/images/circleanimation.gif';
// import http from './http';
import axios from './http';
import profile_picture from './../assets/images/cartoonifyPlaceholder.png';
//redux
import { useDispatch, useSelector } from 'react-redux';
import { connectWebSocket, sendMessage } from '../features/websocket/websocketslice';
// import axios from 'axios';



function UserLanding() {

    // websocket in redux
    const dispatch = useDispatch();
    const [input, setInput] = useState('');
    const [recipientId, setRecipientId] = useState('');


    const isConnected = useSelector((state) => state.websocket.isConnected);
    const messages = useSelector((state) => state.websocket.messages);

    //set const
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

    const [queueNumber, setQueueNumber] = useState('0001');  // Queue number state

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [output, setOutput] = useState(null);

    const [isDropdownBoothOpen, setDropdownBoothOpen] = useState(true);
    const [isDropdownWorkshopOpen, setDropdownWorkshopOpen] = useState(false);
    const [workshopButtonColor, setWorkshopButtonColor] = useState('#4CAF50'); // Original color
    const [boothButtonColor, setBoothButtonColor] = useState('red'); // Original color

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix for URL-safe base64
        const jsonPayload = decodeURIComponent(escape(atob(base64))); // Decode base64 to string
        return JSON.parse(jsonPayload);
    };

    // Fetch the ticket ID
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchTicketId = async () => {
        try {
            const response = await axios.post(apiUrl + "/Register", {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const token = response.data;
            const decodedToken = parseJwt(token);
            const staffData = JSON.parse(decodedToken.Staff);
            const newTicketId = staffData.TicketId;

            setUniqueId(newTicketId);
            localStorage.setItem('ticket_id', newTicketId);
            localStorage.setItem('accessToken', token);

        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response.data);
                console.error("Error status:", error.response.status);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Axios error:", error.message);
            }
        }
    };

    // List of booths
    const booths = ['Fintech', 'Cybersec', 'AI', 'Infotech'];

    //List of images:
    const boothImages = [boothimage1, boothimage2, boothimage3, boothimage4]

    const [currentBooth, setCurrentBooth] = useState('Fintech');
    const [currentImage, setCurrentImage] = useState(boothImages[0]);

    // Function to cycle through the booth names
    const handleCycleBooth = () => {
        setCurrentBooth((prevBooth) => {
            const currentIndex = booths.indexOf(prevBooth);
            const nextIndex = (currentIndex + 1) % booths.length;
            return booths[nextIndex];
        });
        setCurrentImage((prevImage) => {
            const currentIndex = boothImages.indexOf(prevImage);
            const nextIndex = (currentIndex + 1) % boothImages.length;
            return boothImages[nextIndex];
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
        const url = `${ticket_id}`; // URL to encode
        const qrApi = import.meta.env.VITE_QR_CODE_API
        const qrSrc = qrApi + encodeURIComponent(url);
        setQrImage(qrSrc);
    };


    const arrayBufferToBlob = (arrayBuffer) => {
        return new Blob([arrayBuffer]);
    };

    const hasFetchedDataRef = useRef(false);
    const hasFetchedDataRefTicket = useRef(false);
    const hasFetchedDataRefQueue = useRef(false);

    async function LoadUserData(ticketId) {
        try {

            // POST request to the "Stamp" API
            const response = await axios.get(apiUrl + "/VisitorMyInfo");

            if (response.status === 200) {
                console.log(`response: ${JSON.stringify(response.data)}`);
                // var data = JSON.parse(response);
                // console.log(`data: ${response.data["profileImageUrl"]}`);
                if (response.data["profileImageUrl"]) {
                    var profileImageUrl = response.data["profileImageUrl"];
                    var fullPath = `${imageRepo}${ticket_id}/${profileImageUrl}?t=${new Date().getTime()}`;
                    console.log(`fullPath: ${fullPath}`);
                    setImageSource(fullPath);
                }
            }
        } catch (error) {
            console.error('Error sending Stamp API request:', error);
        }
    };

    useEffect(() => {
        if (!ticket_id && !hasFetchedDataRefTicket.current) {
            hasFetchedDataRefTicket.current = true; // Mark as fetched
            fetchTicketId(); // Fetch ticket ID if not in local storage
        } // Call the function to fetch ticket ID on component mount
        else {
            // Get the existing data from database, if any.
            console.log(`Get data here!`);
            LoadUserData(ticket_id);
        }
        generateQR();
        dispatch(connectWebSocket({ ticketId: ticket_id, onMessageHandler, refreshAll }));

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
    }, [ticket_id, dispatch]);

    const handleSendMessage = () => {
        if (input && recipientId && isConnected) {
            dispatch(sendMessage({ recipientId, input }));
            setInput('');
            setRecipientId('');
        } else {
            console.error('Message and recipient ID must not be empty');
        }
    };

    const toggleDropdownBooth = () => {
        setDropdownBoothOpen(prev => {
            const newBoothState = !prev;

            if (newBoothState) {
                // If booth is now open, set workshop button color to original
                //setWorkshopButtonColor('red');
                // setBoothButtonColor('#4CAF50'); // Set booth button color to red
                setBoothButtonColor('red');
                setWorkshopButtonColor('#4CAF50'); // Set booth button color to red
            } else {
                // If booth is closing, reset booth button color
                setBoothButtonColor('#4CAF50');
            }

            if (isDropdownWorkshopOpen) {
                setDropdownWorkshopOpen(false);
            }

            return newBoothState;
        });
    };

    const toggleDropdownWorkshop = () => {
        setDropdownWorkshopOpen(prev => {
            const newWorkshopState = !prev;

            if (newWorkshopState) {
                // If workshop is now open, set booth button color to original
                setBoothButtonColor('#4CAF50');
                setWorkshopButtonColor('red'); // Set workshop button color to red
            } else {
                // If workshop is closing, reset workshop button color
                setWorkshopButtonColor('#4CAF50');
            }

            if (isDropdownBoothOpen) {
                setDropdownBoothOpen(false);
            }

            return newWorkshopState;
        });
    };

    const ModalContent = ({ close }) => (
        <div style={modalContentStyle}>
            <div style={contentStyle}>
                <button onClick={() => close()} className='close-button'>&times;</button>
                <h2 style={titleStyle}>All Collected Stamps</h2>
                <p>Here you can see all your collected stamps.</p>

                {/* <div className='button-container'>
                    <button className="dropdown-button" onClick={toggleDropdownBooth} style={{ marginBottom: '10px', transition: 'background-color 0.3s', backgroundColor: boothButtonColor }}>
                        {isDropdownBoothOpen ? 'Hide Booth Stamps' : 'Show Booth Stamps'}
                    </button>

                    <button className="dropdown-button" onClick={toggleDropdownWorkshop} style={{ marginBottom: '10px', transition: 'background-color 0.3s', backgroundColor: workshopButtonColor }}>
                        {isDropdownWorkshopOpen ? 'Hide Workshop Stamps' : 'Show Workshop Stamps'}
                    </button>
                </div> */}


                {/* {isDropdownBoothOpen && ( */}
                <div class='dropdown' style={{ ...dropdownStyle }}>
                    <div style={gridStyle}>
                        <img src={aiStamp} alt="aiStamp" width='100%' style={{ ...displayStamp, display: isAiStampVisible ? 'block' : 'none' }} />
                        <img src={csStamp} alt="csStamp" width='100%' style={{ ...displayStamp, display: isCsStampVisible ? 'block' : 'none' }} />
                        <img src={ftStamp} alt="ftStamp" width='100%' style={{ ...displayStamp, display: isFtStampVisible ? 'block' : 'none' }} />
                        <img src={itStamp} alt="itStamp" width='100%' style={{ ...displayStamp, display: isItStampVisible ? 'block' : 'none' }} />
                        {/* <img src={aiStamp} alt="aiStamp" width='100%' style={{ ...displayStamp, display: isAiStampVisible ? 'block' : 'none' }} />
                        <img src={csStamp} alt="csStamp" width='100%' style={{ ...displayStamp, display: isCsStampVisible ? 'block' : 'none' }} />
                        <img src={ftStamp} alt="ftStamp" width='100%' style={{ ...displayStamp, display: isFtStampVisible ? 'block' : 'none' }} />
                        <img src={itStamp} alt="itStamp" width='100%' style={{ ...displayStamp, display: isItStampVisible ? 'block' : 'none' }} /> */}
                    </div>
                    {/* Display message if no stamps are visible */}
                    {!isAiStampVisible && !isCsStampVisible && !isFtStampVisible && !isItStampVisible && (
                        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                            You have not collected anything.
                        </div>
                    )}
                </div>
                {/* )} */}

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

    function uint8ArrayToBase64(uint8Array) {
        let binaryString = '';
        const len = uint8Array.byteLength;
        for (let i = 0; i < len; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
        }
        return btoa(binaryString);
    }

    const base64ToBlob = (base64, type) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: type });
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();


        // Check if the file is a valid File object
        if (file instanceof File) {
            console.log('File Name:', file.name);
            console.log('File Type:', file.type);
            console.log('File Size:', file.size); // Size in bytes

            // Convert the file to a Uint8Array to access the binary data
            const byteArray = new Uint8Array(await file.arrayBuffer());
            const base64String = uint8ArrayToBase64(byteArray);
            console.log('Base64 Representation:', base64String);

            // Convert Base64 back to Blob
            const blob = base64ToBlob(base64String, file.type);
            console.log('Blob created from Base64:', blob);

            formData.append('file', blob); // Use 'file' as the key

            try {
                const cutoutproApi = import.meta.env.VITE_CUTOUTPRO_API
                const cutoutproApiKey = import.meta.env.VITE_CUTOUTPRO_API_KEY
                console.log(cutoutproApi);
                console.log(cutoutproApiKey);
                const response = await fetch(cutoutproApi, {
                    method: 'POST',
                    headers: {
                        'APIKEY': cutoutproApiKey, // Replace with your API key
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Network response was not ok: ${errorText}`);
                }

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setOutput(imageUrl);

                localStorage.setItem('uploadedImage', imageUrl);
                // Create a link element to trigger download
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = 'out.png'; // Name of the downloaded file
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            console.error('The provided input is not a valid File object');
            setError('Invalid file input.');
        }
    };




    const handleRemoveImage = () => {
        setOutput(null);
        localStorage.removeItem('uploadedImage');
    };

    const handleDropChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const imageRepo = import.meta.env.VITE_IMAGE_REPO

    const photoLink = ``;
    const [imageSource, setImageSource] = useState(photoLink);

    // Function to refresh the profile picture
    function onMessageHandler(messageData) {
        setTimeout(() => {
            var imageURL = messageData.message;
            setImageSource(`${imageRepo}${ticket_id}/${imageURL}?t=${new Date().getTime()}`); // Append timestamp to force refresh
            console.log(`photo updated - ${imageRepo}${ticket_id}/${imageURL}`);
        }, 5000); // 5000 milliseconds = 5 seconds
    };

    function refreshAll() {
        if (ticket_id) {
            LoadUserData(ticket_id);
        }
    }
    // const fallback_link = `https://openhouse2025-images-repo.s3.ap-southeast-1.amazonaws.com/user_profile/${ticket_id}/cartoonprofile.png`;
    //const fallback2_link = `https://openhouse2025-images-repo.s3.ap-southeast-1.amazonaws.com/user_profile/${ticket_id}/cartoonprofile.jpeg`;

    // const imageSrc = photo_link || fallback_link || fallback2_link;
    const formSGApi = import.meta.env.VITE_FORMSG_LINK_DEMO
    const form_sg = formSGApi + ticket_id



    function clearLocalStorage() {
        localStorage.clear();
    }

    const [showOverlay, setShowOverlay] = useState(false);
    const onHover = () => {
        setShowOverlay(true);
    };

    const onLeave = () => {
        setShowOverlay(false);
    };

    return (
        <Container>
            <div class='container'>
                <img src="/images/rgb_sit_1.png" alt="image" style={{ width: 'auto', height: '100%' }} ></img>
            </div>
            <Box className="bodyBox">
                {/* <div className='centertopdiv'>
                <img src={nyp_logo} alt="NYP Logo" />
            </div> */}
                <Box>
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <h1 class="boardingpassHeader">SIT BOARDING PASS</h1>
                    <h2 class="boardingpassSubHeader">*Early Access*</h2>
                    <h3 class="boardingpassSubHeader">
                        Do you want to see what you would look like as a digital avatar?
                    </h3>
                    <br />
                    <div
                        onMouseEnter={onHover}
                        onMouseLeave={onLeave}>
                        <h3>
                            Upload your photo now and join us as we aim to set a Singapore Book of Records title for
                            'Most People Contributing to a Digital Avatar Montage.'</h3>
                    </div>
                    <br />
                    <Paper elevation={12} sx={{ borderRadius: "20px", paddingBottom: "10px", paddingTop: "10px" }}>
                        <Box className="topdiv">
                            <a href={form_sg} target="_blank" rel="noopener noreferrer">
                                <Box className="profilePicture" sx={{ position: "relative" }}>
                                    <img
                                        src={imageSource}
                                        alt="Profile"
                                        className="profileImage"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = noImageUploaded; // Fallback image on error
                                        }}
                                    />
                                    <div className="uploadCircle">
                                        <img src={uploadProfile} alt="Upload" className="uploadImage" />
                                    </div>
                                    {showOverlay && <div className="CircleAnimationDiv">
                                    </div>}
                                </Box>
                            </a>
                            <Box className="QRBox">
                                <img src={qrImage} alt="QR Code" className="qrImage" />
                            </Box>
                            <Box>
                                <Typography class="bold">
                                    Ticket ID: {ticket_id}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box >
        </Container >
    );
}

export default UserLanding;