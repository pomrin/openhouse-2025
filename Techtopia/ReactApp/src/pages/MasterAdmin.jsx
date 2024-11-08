import React, { useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';

import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Grid, Button, RadioGroup, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Backdrop from '@mui/material/Backdrop';

import EditIcon from '@mui/icons-material/Edit';

import noImageUploaded from './../assets/images/noImageUploaded.png';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Redemption Form is WIP

function MasterAdmin() {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(null); 
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ensure user is an admin/booth helper
    useEffect(() => {
        // Retrieve accessToken from localStorage
        const token = localStorage.getItem('accessToken');

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
        // Fetch tag colors once access token is available
        if (accessToken && !colorsFetched) {
            fetchColors();
        }
    
        // Load in overlay prompt when no ticket is selected
        if (!selectedTicket) {
            setSelectedTicket(null);
        }
    }, [accessToken, colorsFetched, selectedTicket]);

    // DataGrid Table
    // Table Columns
    const columns = [
        { field: 'ticketid', headerName: 'TicketID', width: 190, headerAlign: 'center', align: 'center' },
        { field: 'booth1', headerName: 'Cybersecurity', width: 180, headerAlign: 'center', align: 'center' },
        { field: 'booth2', headerName: 'Data Analytics', width: 180, headerAlign: 'center', align: 'center' },
        { field: 'booth3', headerName: 'Fintech', width: 180, headerAlign: 'center', align: 'center' },
        { field: 'booth4', headerName: 'Artificial Intelligence (AI)', width: 180, headerAlign: 'center', align: 'center' },
        { field: 'redemptionstatus', headerName: 'Redemption Status', width: 200, headerAlign: 'center', align: 'center' },
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

    // Table Rows with fake data [HARDCODED TEMPORARILY]
    const rows = [
        { ticketid: 'NYP0001MON', booth1: 'yes', booth2: 'no', booth3: 'yes', booth4: 'no', redemptionstatus: 'no' }, //1
        { ticketid: 'NYP0002MON', booth1: 'yes', booth2: 'yes', booth3: 'yes', booth4: 'yes', redemptionstatus: 'yes' },
        { ticketid: 'NYP0003MON', booth1: 'no', booth2: 'no', booth3: 'no', booth4: 'no', redemptionstatus: 'no' },
        { ticketid: 'NYP0004MON', booth1: 'yes', booth2: 'yes', booth3: 'yes', booth4: 'yes', redemptionstatus: 'no' },
        { ticketid: 'NYP0005MON', booth1: 'no', booth2: 'no', booth3: 'yes', booth4: 'no', redemptionstatus: 'no' },
        { ticketid: 'NYP0006MON', booth1: 'yes', booth2: 'no', booth3: 'yes', booth4: 'no', redemptionstatus: 'no' }, //6
        { ticketid: 'NYP0001TUE', booth1: 'no', booth2: 'yes', booth3: 'yes', booth4: 'yes', redemptionstatus: 'no' }, //7
        { ticketid: 'NYP0001MO', booth1: 'yes', booth2: 'no', booth3: 'yes', booth4: 'no', redemptionstatus: 'no' },
        { ticketid: 'NYP0002FRI', booth1: 'yes', booth2: 'yes', booth3: 'yes', booth4: 'yes', redemptionstatus: 'yes' },
        { ticketid: 'NYP0003FRI', booth1: 'no', booth2: 'no', booth3: 'no', booth4: 'no', redemptionstatus: 'no' },
        { ticketid: 'NYP0001FRI', booth1: 'yes', booth2: 'no', booth3: 'yes', booth4: 'no', redemptionstatus: 'no' }, //11
        { ticketid: 'NYP0002MO', booth1: 'yes', booth2: 'yes', booth3: 'yes', booth4: 'yes', redemptionstatus: 'yes' },
        { ticketid: 'NYP0003MO', booth1: 'no', booth2: 'no', booth3: 'no', booth4: 'no', redemptionstatus: 'no' },
        { ticketid: 'NYP0004MO', booth1: 'yes', booth2: 'yes', booth3: 'yes', booth4: 'yes', redemptionstatus: 'no' },
        { ticketid: 'NYP0005MO', booth1: 'no', booth2: 'no', booth3: 'yes', booth4: 'no', redemptionstatus: 'no' },
        { ticketid: 'NYP0006MO', booth1: 'yes', booth2: 'no', booth3: 'yes', booth4: 'no', redemptionstatus: 'no' },
        { ticketid: 'NYP0001TU', booth1: 'no', booth2: 'yes', booth3: 'yes', booth4: 'yes', redemptionstatus: 'no' },
        { ticketid: 'NYP0001M', booth1: 'yes', booth2: 'no', booth3: 'yes', booth4: 'no', redemptionstatus: 'no' },
        { ticketid: 'NYP0002M', booth1: 'yes', booth2: 'yes', booth3: 'yes', booth4: 'yes', redemptionstatus: 'yes' },
        { ticketid: 'NYP0003M', booth1: 'no', booth2: 'no', booth3: 'no', booth4: 'no', redemptionstatus: 'no' },
    ];
    
    // Display 15 rows of data by default
    const paginationModel = { 
        page: 0, 
        pageSize: 15 
    };

    // Toast & Popup States
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('info');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

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

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedColor(null);
    };

    // Display Redemption Form Popup
    const displayRedemptionForm = () => {
        if (selectedTicket) {
            setIsPopupOpen(true); // Open the popup if a ticket is selected
        }
    };


    // Styles
    const pageBodyStyle = {
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center'
    };

    const popupContentStyle = {
        width: '100%',
        height: '100%', 
        padding: '0', 
        border: 'none', 
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'rgba(0, 0, 0, 0.7)' 
    };

    const mainContentStyle = {
        height: '95vh',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'top',
        alignItems: 'center',
        paddingBottom: '10px',
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
        flexDirection: 'column',
        overflowY: 'hidden',
        borderLeft: '2px solid gray'
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

    const redemptionFormContainer = {
        backgroundColor: 'rgb(250,250,250,0.9)',
        display: 'flex',
        flexDirection: 'column',
        padding: '2%'
    };
    
    const redemptionInfoContainer = {
        textAlign: 'center',
        borderBottom: '2px solid grey',
        margin: '2% 0 2% 10px',
        padding: '2% 1%'
    };

    const submitFormBtnStyle = {
        width: '60%',
        padding: '5px', 
        backgroundColor: '#008080',
        color: 'white',
        border: '1px solid black',
        margin: '20px 1% 20px 18%'
    };

    const returnBtnStyle = {
        border: '1px solid grey', 
        borderRadius: '5px', 
        marginTop: '5%', 
        color: 'black'
    };

    const btnContainerStyle = {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row'
    };

    // Select ticket to edit
    const editTicket = (ticketData) => {
        setSelectedTicket(ticketData); 
    };

    // Visitor's profile picture 
    const VisitorProfilePhotoContent = ({ profilePhotoSrc }) => {
        return (
            <Box id="visitorPictureContent" style={ticketContentContainer}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Visitor's Profile Picture</Typography>
                <Grid container spacing={1} sx={{ padding: '5pz', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Grid item xy={10} sx={{ height: '145px', width: '145px' }}>
                    <img
                        src={profilePhotoSrc}
                        alt="Profile Image"
                        className="profileImage"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = noImageUploaded; // Fallback image on error
                        }}
                    />
                    </Grid>
                    <Grid item xy={2}>
                        <Button variant="outlined" color="error" onClick={removeProfilePicture} sx={{ my: '10px'}}>
                            Remove Profile Picture
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        )
    };

    // Delete visitor profile picture
    const removeProfilePicture = async () => {
        try {
            console.log('api thingy happens');
        } catch (error) {
            console.log("Error deleting visitor's profile picture:", error);
            showToast('An error occurred while removing profile picture. Please try again.', 'error');
        } finally {
            console.log('loader is gone~');
        }
    };

    // Booth completion status 
    const BoothStatus = ({ boothName, status }) => {
        return status === 'yes' ? (
            <CompletedBooth boothName={boothName} />
        ) : (
            <UnCompletedBooth boothName={boothName} />
        );
    };
    
    const CompletedBooth = ({ boothName }) => {
        return (
            <Grid item xs= {6} sx={{ textAlign: 'center', backgroundColor: 'rgb(80,225,100,0.3)'}}>
                <Typography>{boothName}</Typography>
                <Typography variant="body2" sx={{ marginBottom: '5%'}}>Completed</Typography>
            </Grid>
        );
    };

    const UnCompletedBooth = ({ boothName }) => {
        return (
            <Grid item xs= {6} sx={{ textAlign: 'center', backgroundColor: 'rgb(231,76,60,0.3)'}}>
                <Typography>{boothName}</Typography>
                <Typography variant="body2">Uncompleted</Typography>
                <Button size="small" variant="outlined" color="success" sx={{ marginBottom: '5%'}}>
                    Mark as completed
                </Button>
            </Grid>
        );
    };

    // Ticket Redemption & COllection status [HARDCODED TEMPORARILY]
    const RedemptionStatus = ({ tagRedemptionStatus, collectionStatus, tagColor, engravingText, dateRedeemed, datePendingCollection, dateCollected }) => {
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
                            <Typography variant="caption">{engravingText}</Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Date Redeemed:</Typography>
                            <Typography variant="caption">{dateRedeemed}</Typography>
                        </Grid>
                    </Grid>

                    {/* Collection Status */}
                    <Grid container id="collectionInfo" style={redemptionInfoContainer}>
                        <Grid item xs={8} sx={{ margin: '-20px 0 18px 15px', display: 'flex', flexDirection: 'row' }}>
                            <Typography sx={{ marginBottom: '5px', fontWeight: 500 }}>Collection Status:</Typography>
                            <Typography sx={{ fontWeight: 600, marginLeft: '10px' }}>{collectionStatus}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Date Pending Collection:</Typography>
                            <Typography variant="caption">{datePendingCollection}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Date Collected:</Typography>
                            <Typography variant="caption">{dateCollected}</Typography>
                        </Grid>
                    </Grid>

                    {/* Update Buttons Container [DISPLAY IF COLLECTION STATUS NOT COLLECTED] */}
                    <Box id="buttonsContainer" style={btnContainerStyle}>
                        <Button variant="contained" onClick={displayRedemptionForm} sx={{ 
                            backgroundColor: '#FFA24A' ,
                            '&:hover': { backgroundColor: '#e59444' } 
                            }}>
                            Update Redemption Info
                        </Button>
                        <Button variant="contained" sx={{ 
                            backgroundColor: 'white', 
                            color: 'black',
                            '&:hover': { backgroundColor: '#f2f2f2' }
                            }}>
                            Update Collection Status
                        </Button>
                    </Box>
                </Grid>
            </Box>
        );
    };

    // Handle tag color form submission
    const [ticketId, setTicketId] = useState(null);

    const submitUpdatesToRedemption = async () => {
        try {
            const result = await updateVisitorTag(ticketId, selectedColor);
            handleVisitorTagUpdate(result); 
        } catch (error) {
            console.log('Error updating redemption status:', error);
            showToast('An error occurred while updating the tag. Please try again.', 'error');
        } finally {
            setSelectedColor(null);
        }
    };

    // Redemption form content
    const RedemptionFormContent = () => {
        return (
            <Box id="updateRedemptionFormContainer" style={redemptionFormContainer}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Update Redemption Information</Typography>
                <FormControl component='fieldset' id="updateRedemptionForm" sx={{ alignItems: 'flex-start' }}>
                    <Typography>Tag Color:</Typography>
                    <TagColorsRadioBtns tagColors={tagColors} selectedColor={selectedColor} setSelectedColor={setSelectedColor}/>
                    {selectedColor && (
                        <Button style={submitFormBtnStyle} onClick={submitUpdatesToRedemption}>
                            Update
                        </Button>
                    )}
                </FormControl>
                <Button onClick={closePopup} style={returnBtnStyle}>Close</Button>
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
    
    // (1) Retrieve tag colors [ name & color hex ]
    const getTagColors = async () => {
        try {
            const response = await fetch(`${apiUrl}/LuggageTagColors`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            if (!response.ok) {
                showToast('Error fetching colors. Please reload the page.', 'error');
                throw new Error('Failed to fetch tag colors from API');
            }
    
            const data = await response.json();
            return data; // Return the colors data
        } catch (error) {
            console.log('Error retrieving luggage tag colors:', error);
            throw error; // Rethrow the error to be caught in fetchColors
        }
    };

    // (2a) API (PUT) call to create/update redemption information
    const updateVisitorTag = async (ticketId, selectedColor) => {
        setScannerLoading(true);
        const requestBody = {
            ticketId: ticketId,
            luggageTagColor: selectedColor.luggageTagColorName
        };
    
    try {
        const response = await fetch(`${apiUrl}/AdminRedemption`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` 
            },
            body: JSON.stringify(requestBody)
        });
        return response
    } catch (error) {
        console.log('Error updating tag:', error);
    } finally {
        setScannerLoading(false);
    }
    };

    // (2b) Process API response and display content accordingly
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
                <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 700, marginY: '10px' }}>Master Admin</Typography>
                <Box id="contentContainer" style={contentContainerStyle}> 
                    <Grid container spacing={1} sx={{ overflow: 'hidden' }}>

                        {/* Ticket Table */}
                        <Grid item xs={8} id="tableContent" style={tableContainerStyle}>
                            <Paper sx={{ height: '100%', width: '100%' }}>
                                <DataGrid
                                    columns={columns}
                                    rows={rows}
                                    getRowId={(row) => row.ticketid}
                                    initialState={{ pagination: { paginationModel } }}
                                    pageSizeOptions={[10, 15, 30, 50]}
                                    stickyHeader
                                    sx={{ 
                                        border: 0, 
                                        height: '100%'
                                    }}
                                />
                        </Paper>
                        </Grid>

                        {/* Selected Ticket associated information */}
                        <Grid item xs={4} id="selectedTicketContent" style={ticketContainerStyle}>     
                            {/* Redemption Form popup Content */}
                            <Popup open={isPopupOpen} onClose={closePopup} modal contentStyle={popupContentStyle}>
                                {close => <RedemptionFormContent/>}
                            </Popup>

                            {selectedTicket ? (
                                <><Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
                                    Ticket ID: {selectedTicket.ticketid}
                                </Typography>


                                {selectedTicket && (
                                    <><Box id="actionPanel">
                                        {/* Display associated profile picture  */}
                                        <VisitorProfilePhotoContent profilePhotoSrc={noImageUploaded}/>

                                        {/* Display ticket booths completion status */}
                                        <Box id="boothStatusContent" style={ticketContentContainer}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>Booth Status</Typography>
                                            <Grid container spacing={1} sx={{ padding: '2%' }}>
                                                <BoothStatus boothName="Cybersecurity Booth" status={selectedTicket.booth1} />
                                                <BoothStatus boothName="Data Analytics Booth" status={selectedTicket.booth2} />
                                                <BoothStatus boothName="Financial Technology Booth" status={selectedTicket.booth3} />
                                                <BoothStatus boothName="Artificial Intelligence Booth" status={selectedTicket.booth4} />
                                            </Grid>
                                        </Box>

                                        {/* Display ticket redemption & collection status */}
                                        <RedemptionStatus                     
                                            tagRedemptionStatus="REDEEMED" 
                                            collectionStatus="COLLECTED" 
                                            tagColor="BLUE"
                                            engravingText="qwertyy"
                                            dateRedeemed="2024-10-23 05:45:35"
                                            datePendingCollection ="2024-10-23 06:29:11"
                                            dateCollected="2024-10-23 06:59:48"
                                            />
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