import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import Paper from '@mui/material/Paper';
import nyp_logo from "./../assets/images/RGB_SIT_1.png";
import '../css/UserLanding.css';
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

    const [isAiStampVisible, setAiStampVisible] = useState(false);
    const [isCsStampVisible, setCsStampVisible] = useState(false);
    const [isFtStampVisible, setFtStampVisible] = useState(false);
    const [isItStampVisible, setItStampVisible] = useState(false);

    const [queueNumber, setQueueNumber] = useState('0001');  // Queue number state

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingfetch, setLoadingFetch] = useState(false);

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
            location.reload();
            

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

    const visitorQueueLink = apiUrl + '/VisitorQueue';
    const [qNumber, setQNumber] = useState(null); // State for the queue number

    const fetchQueue = async () => { 
        try {
            const response = await axios.get(visitorQueueLink);
            console.log("Queue: ", response.data);
            console.log("Status code: ", response.status);
            if (response.status === 200) {
                const dataString = response.data;
                setQNumber(dataString);
                // const words = dataString.split(' ');
                // const specificWord = words[3];
                // console.log('Word',specificWord);
                //  // Update state with the parsed number
                //  const numberValue = parseInt(specificWord);
                //  setQNumber(numberValue); // Update the state

            }
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response.data);
                console.error("Error status:", error.response.status);
    
                // Handle specific status codes
                if (error.response.status === 404) {
                    console.log("Queue status: The user is not in any queue");
                    setQNumber('Not In A Queue'); // Update the state
                } else if (error.response.status === 500) {
                    console.log("Server error. Please try again later.");
                } else if (error.response.status === 400 || error.response.status === 401) {
                    console.log("Bad Request:", error.response.status);
                }
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Axios error:", error.message);
            }
        }
    };

    const visitorRedemptionLink = apiUrl + '/VisitorRedemptionStatus';
    const [rStatus, setRStatus] = useState(null); // State for the queue number

    const fetchRedemption = async () => { 
        try {
            const response = await axios.get(visitorRedemptionLink);
            console.log("Redemption: ", response.data);
            console.log("Status code: ", response.status);
            if (response.status === 200) {
                // const dataString = response.data;
                console.log('Visitor is eligible for redemption')
                setRStatus('Redemption is now eligible');
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response.data);
                console.error("Error status:", error.response.status);
    
                // Handle specific status codes
                if (error.response.status === 404) {
                    console.log("Ticket ID is not found");
                } else if (error.response.status === 500) {
                    console.log("Server error. Please try again later.");
                } else if (error.response.status === 400) {
                    console.log("Visitor have not visited all required booths");
                    setRStatus('Please Complete All Booths');
                } else if (error.response.status === 409) {
                    console.log("Visitor has already redeemed before");
                    setRStatus('Redemption Completed');

                }
                
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Axios error:", error.message);
            }
        }
    };

    const visitorBoothStatusLink = apiUrl + '/VisitorBoothStatus';

    const fetchBoothStatus = async () => { 
        try {
            const response = await axios.get(visitorBoothStatusLink);
            console.log("Booth Status: ", response.data);
            console.log("Status code: ", response.status);
            
            
            if (response.status === 200) {
                const values = response.data.map(item => item.boothId);
                console.log('Values', values);
                if (values.includes(4)) {
                    // toggleStampVisibility('AI');
                    stampVisibility('AI');
                }
                if (values.includes(1)) {
                    // toggleStampVisibility('CS');
                    stampVisibility('CS');
                }
                if (values.includes(3)) {
                    // toggleStampVisibility('FT');
                    stampVisibility('FT');
                }
                if (values.includes(2)) {
                    // toggleStampVisibility('IT');
                    stampVisibility('IT');
                }
     
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response.data);
                console.error("Error status:", error.response.status);
    
                // Handle specific status codes
                if (error.response.status === 404) {
                    console.log("User Not in any queue");
                } else if (error.response.status === 500) {
                    console.log("Server error. Please try again later.");
                } else if (error.response.status === 400) {
                    console.log("Bad Request:", error.response.status);
                }
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Axios error:", error.message);
            }
        }
    };

    //QR function
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
    const hasFetchedDataRefRedemp = useRef(false);
    const hasFetchedDataRefBoothStatus = useRef(false);
    const hasFetchedDataRefAll = useRef(false);



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
        // if (!ticket_id && !hasFetchedDataRefTicket.current) {
        //     hasFetchedDataRefTicket.current = true; // Mark as fetched
        //     fetchTicketId(); // Fetch ticket ID if not in local storage
            
        // } // Call the function to fetch ticket ID on component mount
        // else {
        //     // Get the existing data from database, if any.
        //     console.log(`Get data here!`);
        //     LoadUserData(ticket_id);
        // }
        const fetchData = async () => {
            try {
                setLoadingFetch(true); // Set loading to true before fetching data
                let ticketId = localStorage.getItem('ticket_id');

                if (!ticketId && !hasFetchedDataRefTicket.current) {
                    hasFetchedDataRefTicket.current = true; // Mark as fetched
                    ticketId = await fetchTicketId(); // Fetch ticket ID if not found
                }
                else {
                    console.log(`Get data here!`);
                    LoadUserData(ticket_id);
                }

                if (!hasFetchedDataRefQueue.current && !hasFetchedDataRefRedemp.current && !hasFetchedDataRefBoothStatus.current) {
                    // Now that we have the ticket ID, fetch other data
                    await fetchQueue();
                    await fetchRedemption();
                    await fetchBoothStatus();
                }
                
            } catch (error) {
                console.error("Error during fetching data:", error);
            } finally {
                setLoadingFetch(false); // Set loading to false after all data is fetched
            }
        };
        
        if(!hasFetchedDataRefAll.current){
            hasFetchedDataRefAll.current = true;
            fetchData();
        }
        generateQR();
        dispatch(connectWebSocket({ ticketId: ticket_id, refreshProfilePicture, refreshStamps, refreshQueueNumber, refreshRedemptionStatus, refreshAll}));

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

    // Function to toggle stamp visibility based on the stamp type
const toggleStampVisibility = (stampType) => {
    let newValue;

    switch (stampType) {
        case 'AI':
            newValue = !isAiStampVisible;
            setAiStampVisible(newValue);
            localStorage.setItem('aiStampVisible', newValue);
            break;
        case 'CS':
            newValue = !isCsStampVisible;
            setCsStampVisible(newValue);
            localStorage.setItem('csStampVisible', newValue);
            break;
        case 'FT':
            newValue = !isFtStampVisible;
            setFtStampVisible(newValue);
            localStorage.setItem('ftStampVisible', newValue);
            break;
        case 'IT':
            newValue = !isItStampVisible;
            setItStampVisible(newValue);
            localStorage.setItem('itStampVisible', newValue);
            break;
        default:
            console.warn(`Unknown stamp type: ${stampType}`);
            return;
    }
};

    // Function to toggle stamp visibility based on the stamp type
    const stampVisibility = (stampType) => {
    
        switch (stampType) {
            case 'AI':
                setAiStampVisible(true);
                break;
            case 'CS':
                setCsStampVisible(true);
                break;
            case 'FT':
                setFtStampVisible(true);
                break;
            case 'IT':
                setItStampVisible(true);
                break;
            default:
                console.warn(`Unknown stamp type: ${stampType}`);
                return;
        }
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

    const handleDropChange = (event) => {
        setSelectedValue(event.target.value);
    };

    // State to hold timestamp to force refresh
    const [qNumberTimestamp, setQNumberTimestamp] = useState(Date.now());
    const [rStatusTimestamp, setRStatusTimestamp] = useState(Date.now());

    // Function to refresh the queue number
    const refreshQueueNumber = () => {
        // Simulate fetching a new queue number
        setQNumberTimestamp(Date.now()); // Update timestamp to force refresh
        console.log("Queue number updated");
    };

    // Function to refresh the redemption status
    const refreshRedemptionStatus = () => {
        setRStatusTimestamp(Date.now()); // Update timestamp to force refresh
        console.log("Redemption status updated");
    };

    // Image URLs with timestamp for each stamp to force refresh
    const [aiStampSource, setAiStampSource] = useState(`${aiStamp}?t=${new Date().getTime()}`);
    const [csStampSource, setCsStampSource] = useState(`${csStamp}?t=${new Date().getTime()}`);
    const [ftStampSource, setFtStampSource] = useState(`${ftStamp}?t=${new Date().getTime()}`);
    const [itStampSource, setItStampSource] = useState(`${itStamp}?t=${new Date().getTime()}`);

    // Function to refresh the stamps images
    const refreshStamps = () => {
        setTimeout(() => {
            const timestamp = new Date().getTime();
            setAiStampSource(`${aiStamp}?t=${timestamp}`);
            setCsStampSource(`${csStamp}?t=${timestamp}`);
            setFtStampSource(`${ftStamp}?t=${timestamp}`);
            setItStampSource(`${itStamp}?t=${timestamp}`);
            console.log("Stamps updated");
        }, 2000); // 2000 milliseconds = 2 seconds
    };

    const imageRepo = import.meta.env.VITE_IMAGE_REPO

    const photoLink = `${imageRepo}${ticket_id}/cartoonprofile.jpg`;
    const [imageSource, setImageSource] = useState(photoLink);

    // Function to refresh the profile picture
    const refreshProfilePicture = () => {
        setTimeout(() => {
            setImageSource(`${photoLink}?t=${new Date().getTime()}`); // Append timestamp to force refresh
            console.log("photo updated");
        }, 5000); // 5000 milliseconds = 5 seconds
    };

    const refreshAll = ()=> {
        refreshProfilePicture();
        refreshStamps();
        refreshRedemptionStatus();
        refreshQueueNumber();
    }
    // const fallback_link = `https://openhouse2025-images-repo.s3.ap-southeast-1.amazonaws.com/user_profile/${ticket_id}/cartoonprofile.png`;
    //const fallback2_link = `https://openhouse2025-images-repo.s3.ap-southeast-1.amazonaws.com/user_profile/${ticket_id}/cartoonprofile.jpeg`;

    // const imageSrc = photo_link || fallback_link || fallback2_link;
    const formSGApi = import.meta.env.VITE_FORMSG_LINK
    const form_sg = formSGApi + ticket_id
    function clearLocalStorage() {
        localStorage.clear();
    }

    return (
        <Box className="bodyBox">
            <Box>
                {/* <img src={nyp_logo} width="60%" style={{ margin: "0px 0px 20px 0px" }} alt="NYP Logo" /> */}
                <div>
                    {/*
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="fileInput"
                />
                <label htmlFor="fileInput" style={{
                    cursor: 'pointer',
                    padding: '10px 20px',
                    background: '#007BFF',
                    color: '#fff',
                    borderRadius: '5px',
                    textAlign: 'center'
                }}>
                    Choose File
                </label>

                <button onClick={handleUpload} disabled={loading || !file} style={{ marginLeft: '10px' }}>
                    Upload
                </button>
                <button onClick={handleRemoveImage} style={{ marginLeft: '10px' }}>
                    Remove
                </button>
                */}
                </div>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <h1 class="boardingpassHeader">SIT BOARDING PASS</h1>
                <Paper elevation={12} sx={{ borderRadius: "20px", paddingBottom: "10px", paddingTop: "10px"}}>
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
                            </Box>
                        </a>
                        <Box className="QRBox">
                            <img src={qrImage} alt="QR Code" className="qrImage" />
                            <Typography className="ticketText">
                                {ticket_id}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
                <Paper className="BoardingPass" elevation={12} sx={{ borderRadius: "20px", marginTop: "20px" }}>
                    <Box className="BoardingPassContent">
                        <Box className="detailsBox">
                            <Box>
                                <Typography class="bold">
                                    Engraving Queue Left
                                </Typography>
                                <Typography key={qNumberTimestamp}>
                                    {qNumber}
                                    {/* {queueNumber} Queue number state */}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography class="bold">
                                    Redemption Status
                                </Typography>
                                <Typography key={rStatusTimestamp}>
                                    {rStatus}
                                    {/* {queueNumber} Queue number state */}
                                </Typography>
                            </Box>
                        </Box>
                        <h1>Stamps:</h1>
                        <Box className="stampsBox">
                            <Box className="stamps">
                                <Typography variant="subtitle1">AI Stamp</Typography>
                                <img
                                    src={aiStampSource}
                                    alt="aiStamp"
                                    width="100%"
                                    style={{
                                        ...displayStamp,
                                        display: isAiStampVisible ? 'block' : 'none',
                                        marginTop: '5px'
                                    }}
                                />
                            </Box>
                            <Box className="stamps">
                                <Typography variant="subtitle1">CS Stamp</Typography>
                                <img
                                    src={csStampSource}
                                    alt="csStamp"
                                    width="100%"
                                    style={{
                                        ...displayStamp,
                                        display: isCsStampVisible ? 'block' : 'none',
                                        marginTop: '5px'
                                    }}
                                />
                            </Box>
                        </Box>
                        <Box className="stampsBox">
                            <Box className="stamps">
                                <Typography variant="subtitle1">FT Stamp</Typography>
                                <img
                                    src={ftStampSource}
                                    alt="ftStamp"
                                    width="100%"
                                    style={{
                                        ...displayStamp,
                                        display: isFtStampVisible ? 'block' : 'none',
                                        marginTop: '5px'
                                    }}
                                />
                            </Box>
                            <Box className="stamps">
                                <Typography variant="subtitle1">IT Stamp</Typography>
                                <img
                                    src={itStampSource}
                                    alt="itStamp"
                                    width="100%"
                                    style={{
                                        ...displayStamp,
                                        display: isItStampVisible ? 'block' : 'none',
                                        marginTop: '5px'
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Paper>


                <div>
                    <h1>WebSocket Communication</h1>
                    <div class="messageDiv">
                        {messages.map((msg, index) => (
                            <div key={index}>{msg.message || 'Received non-JSON message'}</div>
                        ))}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Recipient ID"
                            value={recipientId}
                            onChange={(e) => setRecipientId(e.target.value)} // Handle recipient ID input
                        />
                        <input
                            type="text"
                            placeholder="Type a message"
                            value={input}
                            onChange={(e) => setInput(e.target.value)} // Handle message input
                        />
                        <button onClick={handleSendMessage}>Send Message</button>
                    </div>
                </div>
                <Box>
                    <Typography class="bold">
                        Passenger ID
                    </Typography>
                    <Typography>
                        {ticket_id}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => refreshStamps()}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}
                >
                    Refresh Stamps
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => toggleStampVisibility('AI')}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}
                >
                    Completed Booth 1
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => toggleStampVisibility('CS')}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}
                >
                    Completed Booth 2
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => toggleStampVisibility('FT')}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}
                >
                    Completed Booth 3
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => toggleStampVisibility('IT')}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}
                >
                    Completed Booth 4
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={clearLocalStorage}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}
                >
                    Clear Local Storage
                </Button>


            </Box>
        </Box>
    );
}

export default UserLanding;