import React, { useEffect, useState, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Grid, Button, RadioGroup, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Backdrop from '@mui/material/Backdrop';

import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Completed Booth Icon
import CancelIcon from '@mui/icons-material/Cancel'; // Uncompleted Booth Icon

import http from './http.js';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Not ready > Update/Display Queue status

function MasterAdmin() {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(null); 
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ensure user is an admin
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

    const [tagColors, setTagColors] = useState([]);
    const [colorsFetched, setColorsFetched] = useState(false); // Track whether colors have been fetched
    const [selectedColor, setSelectedColor] = useState(null);
    
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

    // Fetch tag colors / Display prompt if no ticket selected
    useEffect(() => {   
        // Load in overlay prompt when no ticket is selected
        if (!selectedTicket) {
            setSelectedTicket(null);
        }

        // Fetch tag colors once access token is available
        if (accessToken && !colorsFetched) {
            fetchColors();
        }
    }, [accessToken, colorsFetched, selectedTicket]);

    // DataGrid Table
    const noOfRows = 15; // default number of rows to retrieve
    const [tableRows, setTableRows] = useState([]); // Table rows

    // Load table data after accessToken is obtained
    useEffect(() => {
        if (accessToken) {
            retrieveVisitorTickets();
        }
    }, [accessToken]);

    // Refresh Table rows
    const refreshTableData = async () => {
        try {
            await retrieveVisitorTickets();
    
            // Refresh `selectedTicket` based on the updated `tableRows` data
            const updatedTicket = tableRows.find(row => row.ticketId === selectedTicket.ticketId);
            if (updatedTicket) {
                setSelectedTicket(updatedTicket);
            }
        } catch (error) {
            console.log("Error refreshing table data:", error);
        }
    };

    // Custom alignment of booth status icon cell
    const PaddedCell = ({ value }) => (
        <div style={{ marginTop: '8px' }}>
            {value?.icon && <span>{value.icon}</span>}   
        </div>
    );

    // Table Columns
    const columns = [
        { field: 'ticketId', headerName: 'TicketID', width: 190, headerAlign: 'center', align: 'center' },
        { field: 'CsBooth', headerName: 'Cybersecurity', width: 180, headerAlign: 'center', align: 'center', renderCell: (params) => <PaddedCell value={params.value} /> },
        { field: 'ItBooth', headerName: 'Information Technology', width: 180, headerAlign: 'center', align: 'center', renderCell: (params) => <PaddedCell value={params.value} /> },
        { field: 'FtBooth', headerName: 'Fintech', width: 180, headerAlign: 'center', align: 'center', renderCell: (params) => <PaddedCell value={params.value} /> },
        { field: 'AiBooth', headerName: 'Artificial Intelligence (AI)', width: 180, headerAlign: 'center', align: 'center', renderCell: (params) => <PaddedCell value={params.value} /> },
        { field: 'redemptionStatus', headerName: 'Redemption Status', width: 200, headerAlign: 'center', align: 'center' },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 80,
            sortable: false,
            renderCell: (params) => (
              <IconButton
                color="warning"
                onClick={() => editTicket(params.row)}
              >
                <EditIcon />
              </IconButton>
            ),
        },
    ];
    
    // Display 15 rows of data by default
    const [paginationModel, setPaginationModel] = useState({ 
        page: 0, 
        pageSize: 15 
    });

    // Retrieve rows when accessToken changes or pagination model updates
    useEffect(() => {
        if (accessToken) {
            retrieveVisitorTickets(); 
        }
    }, [accessToken, paginationModel]);

    // Handle pagination changes
    const handlePaginationModelChange = (newModel) => {
        setPaginationModel(newModel); 
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


    // Styles
    const pageBodyStyle = {
        minHeight: '100vh', 
        marginTop: '4%',
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center'
    };

    const mainContentStyle = {
        height: '95vh',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    };

    const contentContainerStyle = {
        height: '95vh',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'hidden'
    };

    const tableContainerStyle = {
        height: '100%',
        overflowY: 'scroll'
    };

    const ticketContainerStyle = {
        height: '100%',
        display: 'flex',
        overflowY: 'scroll',
        flexDirection: 'column',
        borderLeft: '2px solid gray',
        paddingTop: '20px'
    };

    const ticketContentContainer = {
        border: '1px solid lightgray',
        backgroundColor: 'rgb(200,200,200,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        margin: '10px',
        padding: '1.5%'
    };

    const formContentContainer = {
        backgroundColor: 'rgb(235,235,235,0.9)',
        display: 'flex',
        flexDirection: 'column',
        padding: '2%',
        margin: '10px'
    };
    
    const redemptionInfoContainer = {
        textAlign: 'center',
        borderBottom: '2px solid grey',
        margin: '2% 0 2% 10px',
        padding: '2% 1%'
    };

    const submitFormBtnStyle = {
        width: '30%',
        padding: '5px', 
        backgroundColor: '#008080',
        color: 'white',
        border: '1px solid black',
    };

    const returnBtnStyle = {
        border: '1px solid grey', 
        borderRadius: '5px', 
        color: 'black',
        width: '30%'
    };

    const disabledButtonStyle = {
        ...submitFormBtnStyle,
        backgroundColor: '#008080', 
        color: 'black', 
        border: '1px solid #ccc', 
        cursor: 'not-allowed', 
        opacity: 0.29
    };

    const btnContainerStyle = {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row'
    };


    // Helper function to get the corresponding booth status name
    const getBoothStatusFieldById = (boothId) => {
        switch (boothId) {
            case 1: return 'CsBooth';
            case 2: return 'ItBooth';
            case 3: return 'FtBooth';
            case 4: return 'AiBooth';
            default: return '';
        }
    };

    // Helper function to format date
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); 
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };


    // Select ticket to edit
    const editTicket = (ticketData) => {
        setSelectedTicket(ticketData); 
    };

    // Visitor's profile picture ]
    const removeProfilePicture = async () => {
        await removeVisitorPicture(selectedTicket.ticketId);
    };

    // Conditional content rendering for visitor profile picture container
    const VisitorProfilePhotoContent = ({ profilePhotoSrc }) => {
        return (
            <Box id="visitorPictureContent" style={ticketContentContainer}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Visitor's Profile Picture</Typography>
                <Grid container spacing={1} sx={{ padding: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {profilePhotoSrc ? (
                        <>
                            {/* Visitor's profile image */}
                            <Grid item xy={10} sx={{ height: '145px', width: '145px' }}>
                                <img
                                    src={profilePhotoSrc}
                                    alt="Profile Image"
                                    className="profileImage"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                    }}
                                />
                            </Grid>
                            
                            {/* Remove profile picture button */}
                            <Grid item xy={2}>
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    onClick={removeProfilePicture}
                                    sx={{ my: '10px' }}
                                >
                                    Remove Profile Picture
                                </Button>
                            </Grid>
                        </>
                    ) : (
                        <Typography variant="body1" color="textSecondary" sx={{ my: '10px' }}>
                            No profile picture 
                        </Typography>
                    )}
                </Grid>
            </Box>
        );
    };

    // Booth Statuses display on right panel
    const [boothStatuses, setBoothStatuses] = useState(selectedTicket?.boothStatuses || {});

    // Button onclick event to trigger addBoothStamp and refresh display
    const adminAddBoothStamp = async (boothId) => {
        try {
            setLoading(true);
    
            // API call to issue the booth stamp
            const result = await addBoothStamp(boothId);
    
            // Update UI design upon successful issuance of stamp (1s delay)
            setTimeout(() => {
                const updatedTicket = { ...selectedTicket }; 
                const boothStatusField = getBoothStatusFieldById(boothId);  
                updatedTicket[boothStatusField].status = 'Completed'; 
    
                // Update selectedTicket and boothStatuses
                setSelectedTicket(updatedTicket);
                setBoothStatuses(updatedTicket.boothStatuses || {});  
    
            }, 1000); 
        } catch (error) {
            console.log('Error sending add stamp request:', error);
            showToast('An error occurred while issuing a booth stamp', 'error');
        } finally {
            setLoading(false);
        }
    };

    // BoothStatus display container
    const BoothStatus = ({ status, boothName, boothId }) => {
        return status === 'Completed' ? (
            <CompletedBooth boothName={boothName} />
        ) : (
            <UnCompletedBooth
                boothName={boothName}
                boothId={boothId}
                onAddBoothStamp={() => adminAddBoothStamp(boothId)} 
            />
        );
    };

    const CompletedBooth = ({ boothName }) => (
        <Grid item xs={6} sx={{ textAlign: 'center', backgroundColor: 'rgb(80,225,100,0.3)' }}>
            <Typography>{boothName}</Typography>
            <Typography variant="body2" sx={{ marginBottom: '5%' }}>Completed</Typography>
        </Grid>
    );
    
    const UnCompletedBooth = ({ boothName, boothId, onAddBoothStamp }) => {
        return (
            <Grid item xs={6} sx={{ textAlign: 'center', backgroundColor: 'rgb(231,76,60,0.3)' }}>
                <Typography>{boothName}</Typography>
                <Typography variant="body2">Uncompleted</Typography>
                <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={onAddBoothStamp}  // Use the onAddBoothStamp prop here
                    sx={{ marginBottom: '5%' }}
                >
                    Mark as completed
                </Button>
            </Grid>
        );
    };

    // Redemption / Engraving Form
    const [isRedemptionFormVisible, setRedemptionFormVisible] = useState(false);
    const [isUpdEngravingFormVisible, setUpdEngravingFormVisible] = useState(false);
    const formRef = useRef(null);

    // Auto scroll to any active form
    useEffect(() => {
        if (formRef.current && (isRedemptionFormVisible || isUpdEngravingFormVisible)) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [isRedemptionFormVisible, isUpdEngravingFormVisible]);

    // Update Redemption Form
    const displayRedemptionForm = () => {
        setRedemptionFormVisible(true);
    };

    const closeRedemptionForm = () => {
        setRedemptionFormVisible(false);
    };
    
    // Redemption Form content
    const RedemptionFormContent = ({ closeForm }) => (
        <Box id="updateRedemptionFormContent" style={formContentContainer}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>Update Redemption Information</Typography>
            <Typography variant="body2">TicketID: {selectedTicket.ticketId}</Typography>
            <FormControl component='fieldset' id="updateRedemptionForm" sx={{ alignItems: 'flex-start' }}>
                <Typography variant="body2">Tag Color:</Typography>
                <TagColorsRadioBtns tagColors={tagColors} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

                {/* Form buttons container */}
                <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center', alignContent: 'center' }}>
                    <Button 
                        style={selectedColor ? submitFormBtnStyle : disabledButtonStyle} 
                        onClick={submitUpdatesToRedemption} 
                        disabled={!selectedColor}
                    >
                        Update
                    </Button>

                    <Button onClick={closeRedemptionForm} style={returnBtnStyle}>
                        Cancel
                    </Button>
                </Box>
            </FormControl>
        </Box>
    );

    // Handle tag color form submission
    const submitUpdatesToRedemption = async () => {
        try {
            const result = await updateVisitorTag(selectedTicket.ticketId, selectedColor);

        } catch (error) {
            console.log('Error updating redemption status:', error);
            showToast('An error occurred while updating the tag. Please try again.', 'error');
        } finally {
            setSelectedColor(null);
        }
    };
    
    // Update Engraving Form
    const displayEngravingForm = () => {
        setUpdEngravingFormVisible(true);
    };

    const closeEngravingForm = () => {
        setUpdEngravingFormVisible(false);
    };

    // Engraving Form content
    const EngravingFormContent = ({ closeForm }) => {
        const [newEngravingText, setNewEngravingText] = useState('');
        const [warning, setWarning] = useState('');
    
        // Validation rules for the text field
        const validateEngravingText = (text) => {
            if (!text) {
                setWarning('Text field cannot be empty.');
                return false;
            }
            if (text.length > 12) { // soft locked at 12 char
                setWarning('Too many characters. Maximum is 12.');
                return false;
            }
            setWarning(''); // No invalidation
            return true;
        };
    
        // Handle input change
        const handleInputChange = (event) => {
            const text = event.target.value;
            setNewEngravingText(text);
            validateEngravingText(text);
        };
    
        // Handle form submission
        const submitUpdatesToEngraving = async () => {
            if (validateEngravingText(newEngravingText)) {
                try {
                    const result = await updateEngravingText(selectedTicket.ticketId, newEngravingText)
                
                } catch (error) {
                    console.log('Error updating engraving text:', error)

                }
            }
        };
    
        // Button disabled state
        const isButtonDisabled = !newEngravingText || !!warning;
    
        return (
            <Box id="updateEngravingFormContent" style={formContentContainer}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Update Engraving Text
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: '2%' }}>
                    TicketID: {selectedTicket.ticketId}
                </Typography>
                <FormControl component="fieldset" id="updateEngravingForm" fullWidth>
                    <TextField
                        required
                        id="newEngravingText"
                        label="Text to Engrave"
                        autoComplete='off'
                        onChange={handleInputChange}
                        error={!!warning}
                        helperText={warning || ' '}
                    />
                    {/* Form buttons container */}
                    <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center', alignContent: 'center' }}>
                        <Button
                            style={isButtonDisabled ? disabledButtonStyle : submitFormBtnStyle}
                            onClick={submitUpdatesToEngraving}
                            disabled={isButtonDisabled}
                        >
                            Update
                        </Button>
    
                        <Button onClick={closeForm} style={returnBtnStyle}>
                            Cancel
                        </Button>
                    </Box>
                </FormControl>
            </Box>
        );
    };

    // Queue
    // Test cases | In queue - 0686 | Engraving - 0174 | Pending Collection - 0385TUE | Collected - 0076MON
    const TicketDetails = ({ selectedTicket }) => {
        const [queue, setQueue] = useState({
            queueStatus: '',
            engravingText: '',
            datePendingCollection: '',
            dateCollected: '',
        });

        useEffect(() => {
            if (selectedTicket?.ticketId) {
                const fetchQueueStatus = async () => {
                    const data = await retrieveCollectionInformation(selectedTicket.ticketId);
                    if (data) {
                        setQueue({
                            queueStatus: data.queueStatus || '---',
                            engravingText: data.textToEngrave || '---',
                            datePendingCollection: data.datePendingCollection || '---',
                            dateCollected: data.dateCollected || '---',
                        });
                    }
                };
                fetchQueueStatus();
            }
        }, [selectedTicket]);

        return { queue }; 
    };

    const { queue } = TicketDetails({ selectedTicket });

    // Ticket Redemption & Queue status 
    const RedemptionStatus = ({ tagRedemptionStatus, tagColor, dateRedeemed }) => {
        return (
            <Box id="redemptionStatusContent" style={ticketContentContainer}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Luggage Tag Redemption Status</Typography>
                <Grid container spacing={1} sx={{ padding: '1%' }}>
                    <Grid item xs={10} sx={{ marginLeft: '15px', display: 'flex', flexDirection: 'row' }}>
                        <Typography sx={{ fontWeight: 500 }}>Redemption Status:</Typography>
                        <Typography sx={{ fontWeight: 600, marginLeft: '10px' }}>{tagRedemptionStatus}</Typography>
                    </Grid>
    
                    {/* Redemption Status */}
                    <Grid container id="redemptionInfo" style={redemptionInfoContainer}>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Luggage Tag Color:</Typography>
                            <Typography variant="caption">{tagColor}</Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Engraving Text:</Typography>
                            <Typography variant="caption">{queue.engravingText || '---'}</Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Date Redeemed:</Typography>
                            <Typography variant="caption">{dateRedeemed}</Typography>
                        </Grid>
                    </Grid>
    
                    {/* Queue Status */}
                    <Grid container id="QueueInfo" style={redemptionInfoContainer}>
                        <Grid item xs={8} sx={{ margin: '-20px 0 18px 15px', display: 'flex', flexDirection: 'row' }}>
                            <Typography sx={{ marginBottom: '5px', fontWeight: 500 }}>Queue Status:</Typography>
                            <Typography sx={{ fontWeight: 600, marginLeft: '10px' }}>{queue.queueStatus || '---'}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Date Pending Collection:</Typography>
                            <Typography variant="caption">{queue.datePendingCollection || '---'}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Date Collected:</Typography>
                            <Typography variant="caption">{queue.dateCollected || '---'}</Typography>
                        </Grid>
                    </Grid>
    
                    {/* Update Buttons Container */}
                    <Box id="buttonsContainer" style={btnContainerStyle}>
                        {/* Update Redemption Info Button */}
                        {selectedTicket.redemptionStatus !== 'Redeemed' && (
                            <Button
                                variant="contained"
                                onClick={displayRedemptionForm}
                                sx={{
                                    width: '30%',
                                    backgroundColor: '#FFA24A',
                                    color: 'white',
                                    '&:hover': { backgroundColor: '#e59444' },
                                }}
                            >
                                Update Redemption Info
                            </Button>
                        )}

                        {/* Change Engraving Text Button */}
                        {queue.queueStatus === 'In queue' && (
                            <Button
                                variant="contained"
                                onClick={displayEngravingForm}
                                sx={{
                                    width: '30%',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    '&:hover': { backgroundColor: '#43A047' },
                                }}
                            >
                                Change Engraving Text
                            </Button>
                        )}

                        {/* Mark as Collected Button */}
                        {queue.queueStatus === 'In queue' && (
                            <Button
                                variant="contained"
                                sx={{
                                    width: '30%',
                                    backgroundColor: 'white',
                                    color: 'black',
                                    '&:hover': { backgroundColor: '#f2f2f2' },
                                }}
                            >
                                Mark as Collected
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Box>
        );
    };

    // Tag Color buttons for redemption/update form
    const TagColorsRadioBtns = ({ tagColors, selectedColor, setSelectedColor }) => {
        // Ensure tagColors is not empty
        if (!Array.isArray(tagColors) || tagColors.length === 0) {
            return <div>Error loading colors, please refresh the page and try again</div>;
        }
    
        // Utility function to determine if the color is light/dark
        const isColorLight = (color) => {
            const hex = color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            // Calculate brightness (standard formula)
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 155; // threshold for light/dark
        };

        // Handle selection change
        const handleColorChange = (event) => {
            const selectedColorName = event.target.value;
            const selectedColorObj = tagColors.find(color => color.luggageTagColorName === selectedColorName);
            setSelectedColor(selectedColorObj); // Update with the entire color object
        };
    
        return (
            <RadioGroup
                aria-label="tagColor"
                name="tagColorOptions"
                sx={{ gap: 0.9, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
                {tagColors.map((color) => (
                    <Box key={color.luggageTagColorName} sx={{ display: 'inline-block' }}>
                        <FormControlLabel
                            value={color.luggageTagColorName}
                            control={<div />} 
                            label={color.luggageTagColorName}
                            onClick={() => setSelectedColor(color)} 
                            sx={{
                                backgroundColor: color.luggageTagColorCode,
                                borderRadius: '20px',
                                padding: selectedColor?.luggageTagColorName === color.luggageTagColorName ? '10px 20px' : '5px 15px',
                                color: isColorLight(color.luggageTagColorCode) ? 'black' : 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                margin: '5px 0',
                                boxShadow: selectedColor?.luggageTagColorName === color.luggageTagColorName
                                    ? '0 0 5px rgba(0, 0, 0, 0.3), 0 0 5px black'
                                    : 'none',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    </Box>
                ))}
            </RadioGroup>
        );
    };
    
    // (1a) Retrieve tickets from API [ ticketID, booth statuses, redemption status ]
    const getVisitorTickets = async (offset, noOfRows) => {
        try {
            const response = await http.get(`${apiUrl}/AdminVisitorWithBooths`, {
                params: {
                    offset, offset,
                    limit: noOfRows
                }
            });
    
            return response.data;
        } catch (error) {
            console.log('Error fetching visitor tickets:', error);
            showToast('Error fetching visitor tickets.', 'error');
        }
    };

    // (1b) Handle Transformation of relevant data to display in table
    const retrieveVisitorTickets = async (noOfRows) => {
        setLoading(true);
    
        try {
            // Calculate offset for the current page
            const offset = paginationModel.page * paginationModel.pageSize;
    
            const listOfTickets = await getVisitorTickets(offset, noOfRows);
            if (listOfTickets) {
                const transformedRows = listOfTickets.map(visitor => {
                    const redemptionStatus = visitor.luggageRedeemedDate ? 'Redeemed' : 'Unredeemed';
    
                    const boothStatuses = {
                        CsBooth: {
                            status: visitor.visitorBooths.some(booth => booth.boothId === 1) ? 'Completed' : 'Uncompleted',
                            icon: visitor.visitorBooths.some(booth => booth.boothId === 1) ? <CheckCircleOutlineIcon /> : <CancelIcon />
                        },
                        ItBooth: {
                            status: visitor.visitorBooths.some(booth => booth.boothId === 2) ? 'Completed' : 'Uncompleted',
                            icon: visitor.visitorBooths.some(booth => booth.boothId === 2) ? <CheckCircleOutlineIcon /> : <CancelIcon />
                        },
                        FtBooth: {
                            status: visitor.visitorBooths.some(booth => booth.boothId === 3) ? 'Completed' : 'Uncompleted',
                            icon: visitor.visitorBooths.some(booth => booth.boothId === 3) ? <CheckCircleOutlineIcon /> : <CancelIcon />
                        },
                        AiBooth: {
                            status: visitor.visitorBooths.some(booth => booth.boothId === 4) ? 'Completed' : 'Uncompleted',
                            icon: visitor.visitorBooths.some(booth => booth.boothId === 4) ? <CheckCircleOutlineIcon /> : <CancelIcon />
                        }
                    };
    
                    return {
                        id: visitor.visitorId,
                        ticketId: visitor.ticketId,
                        profileImageUrl: visitor.profileImageUrl,
                        luggageTagColorName: visitor.luggageTagColorName,
                        luggageRedeemedDate: visitor.luggageRedeemedDate,
                        ...boothStatuses,
                        redemptionStatus
                    };
                });
                setTableRows(transformedRows);
            }
        } catch (error) {
            console.log('Error setting visitor tickets:', error);
            showToast('Error setting visitor tickets.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // (2) Retrieve tag colors [ name & color hex ]
    const getTagColors = async () => {
        try {
            const response = await http.get(`${apiUrl}/LuggageTagColors`, {
            });
    
            if (response.status != 200) {
                throw new Error('Failed to fetch tag colors from API');
            }
    
            const data = await response.data;
            return data; // Return the colors data
        } catch (error) {
            console.log('Error retrieving luggage tag colors:', error);
            throw error; // Rethrow the error to be caught in fetchColors
        }
    };

    // (3a) API (PUT) call to create/update redemption information
    const updateVisitorTag = async (ticketId, selectedColor) => {
        setLoading(true);
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
            setLoading(false);
        }
    };
    
    // (3b) Process API response and display content accordingly
    const handleVisitorTagUpdate = (response) => {
        switch (response.status) {
            case 200:
                // Response 200: Successful update
                showToast('Tag updated successfully!', 'success');
                setRedemptionFormVisible(false);
                refreshTableData();
    
                // Update redemptionStatus UI (1s delay)
                setTimeout(() => {
                    setSelectedTicket(selectedTicket => ({
                        ...selectedTicket, 
                        redemptionStatus: selectedTicket.redemptionStatus === 'Unredeemed' ? 'Redeemed' : selectedTicket.redemptionStatus,  
                        luggageTagColorName: selectedColor.luggageTagColorName,  
                        luggageRedeemedDate: selectedTicket.luggageRedeemedDate || formatDate(new Date()) // Apply custom formatting
                    }));
                }, 1000); 
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

    // (4) API call and retrieve collection information for a specific ticket ID
    const retrieveCollectionInformation = async (ticketId) => {
        try {
            // Get queue information
            const response = await http.get(`${apiUrl}/AdminQueue`, {
                params: {
                    limit: noOfRows
                }
            });

            if (response.data) {
                // Search and transform the data for the specific ticket ID
                const allQueues = [
                    ...response.data.queue,
                    ...response.data.queueEngraving,
                    ...response.data.queuePendingCollection,
                    ...response.data.queueCollected
                ];

                const ticketInfo = allQueues.find(ticket => {
                    return ticket.ticketId === ticketId;
                });

                if (ticketInfo) {
                    let queueStatus = '';

                    if (response.data.queue.some(ticket => ticket.ticketId === ticketId)) {
                        queueStatus = 'In queue'; // In the "queue" list
                    } else if (response.data.queueEngraving.some(ticket => ticket.ticketId === ticketId)) {
                        queueStatus = 'Currently Engraving'; // In the "queueEngraving" list
                    } else if (response.data.queuePendingCollection.some(ticket => ticket.ticketId === ticketId)) {
                        queueStatus = 'Pending Collection'; // In the "queuePendingCollection" list
                    } else if (response.data.queueCollected.some(ticket => ticket.ticketId === ticketId)) {
                        queueStatus = 'Collected'; // In the "queueCollected" list
                    }

                    return {
                        queueStatus,
                        textToEngrave: ticketInfo.textToEngrave,
                        datePendingCollection: ticketInfo.datePendingCollection,
                        dateCollected: ticketInfo.dateCollected,
                    };
                } else {
                    console.log('Ticket not found');
                    return null; // Handle case where ticketId is not found
                }
            }
        } catch (error) {
            console.log('Error fetching or processing queue information:', error);
            return null;
        } finally {
            console.log('Retrieved Collection Info');
        }
    };

    // (5a) API (PUT) call to update engraving text
    const updateEngravingText = async (ticketId, newEngravingText) => {
        setLoading(true);
        const requestBody = {
            ticketId: ticketId,
            engravingText: newEngravingText
        };

        try {
            const response = await http.put(`${apiUrl}/AdminEngravingText`, requestBody);
            handleEngravingTextUpdate(response, newEngravingText);
        } catch (error) {
            handleEngravingTextUpdate(error, newEngravingText);
            console.log('Error updating engraving text:', error);
        } finally {
            setLoading(false);
        }
    };

    // (5b) Process API response and display content accordingly
    const handleEngravingTextUpdate = (response, newEngravingText) => {
        switch (response.status) {
            case 200:
                // Response 200: Successful update
                showToast('Engraving text updated successfully!', 'success');
                setUpdEngravingFormVisible(false);
    
                // Update redemptionStatus UI (1s delay)
                setTimeout(() => {
                    setSelectedTicket(selectedTicket => ({
                        ...selectedTicket, 
                        engravingText: newEngravingText,  
                    }));
                }, 1000); 
                break;
            case 400:
                // Response 400: Not valid for update
                showToast('Tag not qualified for engraving text update.', 'error');
                break;
            case 404:
                // Response 404: Ticket ID not found
                showToast('Ticket ID not found. Please try again.', 'error');
                break;
            default:
                showToast(response.message || 'Failed to update engraving text, please try again.', 'error');
                break;
        }
    };

    // (6a) API (PUT) call to add booth stamp
    const addBoothStamp = async (boothId) => {
        setLoading(true);
        const requestBody = {
            ticketId: selectedTicket.ticketId,
            boothId: boothId
        };

        try {
            const response = await http.put(`${apiUrl}/AdminIssueStamp`, requestBody);
            handleAddBoothStamp(response);
        } catch (error) {
            handleAddBoothStamp(error);
            console.log('Error adding booth stamp:', error);
        } finally {
            setLoading(false);
        }
    };

    // (6b) Process API response and diaplay toast content
    const handleAddBoothStamp = (response) => {
        switch (response.status) {
            case 200:
                // Response 200: Successful issuance of stamp
                showToast('Visitor Issued Stamp successfully.', 'success');
                refreshTableData();
                break;
            case 404:
                // Response 404: BoothID or TicketID not found
                showToast('No Visitor with Ticket ID or no booth with the Booth Id found.', 'error');
                break;
            case 409:
                // Response 409: Visitor already has stamp badge
                showToast('Visitor have already been issued with the Stamp for the booth.', 'error');
                break;
            case 500:
                // Response 500: Unexpected Exception
                showToast('No idea wat happened.', 'error');
                break;
            default:
                showToast(response.message || 'Failed to issue booth stamp, please try again.', 'error');
                break;
        }
    };

    // (7) API (PUT) to remove visitor's profile pic
    const removeVisitorPicture = async (ticketId) => {
        setLoading(true);
        const requestBody = {
            ticketId: ticketId
        };

        try {
            const response = await http.put(`${apiUrl}/SuperAdminVisitorUpdate`, requestBody);

            if (response.status === 404) {
                showToast("Ticket ID not found.", 'error');
                return;  
            } else if (response.status !== 200) {
                showToast("Error removing visitor's profile picture.", 'error');
                throw new Error("Unexpected error occurred during API call");
            }
            
            showToast("Successfully removed visitor's profile picture.", 'success')

            // Update the selectedTicket profile picture (1s delay)
            setTimeout(() => {
                setSelectedTicket(selectedTicket => ({
                    ...selectedTicket,
                    profileImageUrl: null 
                }));
            }, 1000);

        } catch (error) {
            console.log("Error removing visitor's profile picture:", error)
            throw error;
        } finally {
            setLoading(false);
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
        <Box id="pageContentContainer" style={pageBodyStyle}>
            <Box id="mainContent" style={mainContentStyle}>
                <Box id="contentContainer" style={contentContainerStyle}> 
                    <Grid container spacing={1} sx={{ overflow: 'hidden' }}>

                        {/* Ticket Table */}
                        <Grid item xs={8} id="tableContent" style={tableContainerStyle}>
                            <Paper sx={{ height: '100%', width: '100%' }}>
                                <DataGrid
                                    columns={columns}
                                    rows={tableRows}
                                    getRowId={(row) => row.ticketId}
                                    pageSizeOptions={[10, 15, 30, 50]}
                                    paginationModel={paginationModel}
                                    onPaginationModelChange={handlePaginationModelChange}
                                    sx={{ 
                                        border: 0, 
                                        height: '100%'
                                    }}
                                />
                            </Paper>
                        </Grid>

                        {/* Selected Ticket associated information */}
                        <Grid item xs={4} id="selectedTicketContent" style={ticketContainerStyle}>     

                            {selectedTicket ? (
                                <><Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
                                    Ticket ID: {selectedTicket.ticketId}
                                </Typography>

                                {selectedTicket && (
                                    <><Box id="actionPanel">
                                        {/* Display associated profile picture */}
                                        <VisitorProfilePhotoContent profilePhotoSrc={selectedTicket.profileImageUrl}/>

                                        {/* Display ticket booths completion status */}
                                        <Box id="boothStatusContent" style={ticketContentContainer}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>Booth Status</Typography>
                                            <Grid container spacing={1} sx={{ padding: '2%' }}>
                                                <BoothStatus boothName="Cybersecurity Booth" boothId={1} status={selectedTicket.CsBooth.status} />
                                                <BoothStatus boothName="Information Technology Booth" boothId={2} status={selectedTicket.ItBooth.status} />
                                                <BoothStatus boothName="Financial Technology Booth" boothId={3} status={selectedTicket.FtBooth.status} />
                                                <BoothStatus boothName="Artificial Intelligence Booth" boothId={4} status={selectedTicket.AiBooth.status} />
                                            </Grid>
                                        </Box>

                                        {/* Display ticket redemption & queue status */}
                                        <RedemptionStatus
                                            key={selectedTicket.ticketId}
                                            tagRedemptionStatus={selectedTicket.redemptionStatus || '---'}
                                            tagColor={selectedTicket.luggageTagColorName || '---'}
                                            dateRedeemed={selectedTicket.luggageRedeemedDate || '---'}
                                        />
                                                                    
                                        {/* Update Redemption Form */}
                                        {isRedemptionFormVisible && (
                                            <div ref={formRef}>
                                                <RedemptionFormContent closeForm={closeRedemptionForm} />
                                            </div>
                                        )}

                                        {/* Update Engraving Text Form */}
                                        {isUpdEngravingFormVisible && (
                                            <div ref={formRef}>
                                                <EngravingFormContent closeForm={closeEngravingForm} />
                                            </div>
                                        )}



                                    </Box></>
                                    )}
                                </>
                            ) : (
                                // Overlay prompt
                                <Box sx={{
                                    height: '100%', 
                                    width: '100%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                                    color: 'white'
                                }}>
                                    <Typography variant="h6">Select a ticket to edit</Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Snackbar open={openToast} autoHideDuration={3000} onClose={closeToast}>
                        <Alert
                            onClose={closeToast}
                            severity= {toastSeverity}
                            variant="filled"
                            sx={{ width: 'auto' }}>
                            {toastMessage}
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
        </Box>
    );
}

export default MasterAdmin;