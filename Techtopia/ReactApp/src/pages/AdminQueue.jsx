import React, { useState, useEffect } from 'react';
import { Typography, Grid, Modal, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTimes } from 'react-icons/fa';
import QrReader from "../components/QrReader";
import '../css/AdminQueue.css';

function AdminQueue() {
    // QR code scanner state and logic
    const [openQr, setOpenQr] = useState(false);
    const [scannedResult, setScannedResult] = useState("");
    const navigate = useNavigate();

    const handleScanResult = (result) => {
        if (result) {
            const extracted = result.match(/http:\/\/([^/]+)/)?.[1];
            setScannedResult(extracted);

            if (extracted) {
                sessionStorage.setItem("scannedResult", extracted);
                navigate(`/engravingselection/${extracted}`);
            }
        }
    };

    // Queue management state and logic
    const [queues, setQueues] = useState({
        queue: [],
        queueEngraving: [],
        queuePendingCollection: [],
        queueCollected: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedQueue, setSelectedQueue] = useState('');
    
    // New state for ticket details
    const [ticketDetails, setTicketDetails] = useState({
        ticketId: '',
        TagColor: '',
        textToEngrave: '',
    });

    const colorMapping = {
        BLUE: '#0000FF',
        BLACK: '#000000',
        RED: '#FF0000',
        GREEN: '#008000',
        YELLOW: '#FFFF00',
        GRAY: '#808080',
    };

    const QueueStatus = {
        0: 'Delete',
        1: 'In Queue',
        2: 'Engraving',
        3: 'Pending Collection',
        4: 'Collected',
    };

    const isBright = (hex) => {
        const bigint = parseInt(hex.replace(/^#/, ''), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155;
    };

    const [showAllTickets, setShowAllTickets] = useState(false); // New state for toggling ticket view

    const isToday = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        return date.getFullYear() === today.getFullYear() &&
               date.getMonth() === today.getMonth() &&
               date.getDate() === today.getDate();
    };

    const filteredTickets = showAllTickets
        ? queues.queue
        : queues.queue.filter(ticket => isToday(ticket.dateJoined));

    const toggleTicketView = () => {
        setShowAllTickets(!showAllTickets);
    };

    const exportToCSV = () => {
        const csvRows = [];
        const headers = ['Ticket ID', 'Tag Color', 'Text to Engrave', 'Date Joined', 'Queue Status'];
        csvRows.push(headers.join(','));
    
        // Assuming you want to export all queues
        const allTickets = [...queues.queue, ...queues.queueEngraving, ...queues.queuePendingCollection, ...queues.queueCollected];
    
        allTickets.forEach(ticket => {
            const row = [
                ticket.ticketId,
                ticket.tagColor,
                ticket.textToEngrave,
                new Date(ticket.dateJoined).toLocaleString(),
                QueueStatus[ticket.queueStatus] // Assuming you have queueStatus in ticket
            ];
            csvRows.push(row.join(','));
        });
    
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'queues.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    

    useEffect(() => {
        const fetchQueueData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.error("No token found. Redirecting to login.");
                } else {
                    const response = await fetch(
                        `${import.meta.env.VITE_QUEUE_API}?limit=4`, // Use the .env variable
                        {
                            method: 'GET',
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
    
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
    
                    const data = await response.json();
                    setQueues({
                        queue: data.queue || [],
                        queueEngraving: data.queueEngraving || [],
                        queuePendingCollection: data.queuePendingCollection || [],
                        queueCollected: data.queueCollected || [],
                    });
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setError('Failed to load queue data.');
                setLoading(false);
            }
        };
    
        fetchQueueData(); // Fetch initially
    
        const intervalId = setInterval(fetchQueueData, 5000); // Fetch every 5 seconds
    
        return () => clearInterval(intervalId); // Clear the interval on unmount
    }, []);
    
    const handleTicketClick = (ticketId) => {
        const ticketItem = queues.queue.find(item => item.ticketId === ticketId);
        if (ticketItem) {
            setTicketDetails({
                ticketId: ticketItem.ticketId,
                tagColor: ticketItem.tagColor,
                textToEngrave: ticketItem.textToEngrave,
                dateJoined: ticketItem.dateJoined, // Ensure date format handling
            });
        }
        setSelectedTicketId(ticketId);
        setFormOpen(true);
    };
    
    const handleFormClose = () => {
        setFormOpen(false);
        setSelectedTicketId(null);
        setSelectedQueue('');
    };

    const handleQueueChange = (event) => {
        setSelectedQueue(event.target.value);
    };

    const validateQueueStatus = (status) => {
        return Object.keys(QueueStatus).includes(String(status));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!validateQueueStatus(selectedQueue)) {
            setError('Invalid queue status.');
            return;
        }
    
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert("You are not logged in. Please log in first.");
                navigate('/adminlogin'); // Redirect to login page
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_QUEUE_API}`,  // Use the .env variable
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ticketId: selectedTicketId,
                        queuE_STATUS_TO_UPDATE: parseInt(selectedQueue),
                    }),
                }
            );
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            alert('Ticket updated successfully!');
            handleFormClose();
            window.location.reload();
        } catch (error) {
            setError('Failed to update ticket.');
        }
    };
    
    // Update the handleDelete function to set status to 0
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert("You are not logged in. Please log in first.");
                navigate('/adminlogin');
                return;
            }
    
            const response = await fetch(
                `${import.meta.env.VITE_QUEUE_API}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ticketId: String(selectedTicketId),
                        queuE_STATUS_TO_UPDATE: 0, // Set to 0 for delete
                    }),
                }
            );
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server Error:", errorText);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            alert('Ticket moved to deleted queue successfully!');
            handleFormClose();
            window.location.reload();
        } catch (error) {
            console.error('Failed to move ticket to deleted queue:', error);
            setError('Failed to move ticket to deleted queue.');
        }
    };
    
        const renderQueueItems = (queueItems) => (
        <Grid container spacing={1} justifyContent="center">
            {queueItems.map((item, index) => {
                const backgroundColor = colorMapping[item.tagColor.toUpperCase()] || 'gray';
                const textColor = isBright(backgroundColor) ? 'black' : 'white';

                return (
                    <Grid item key={index}>
                        <div
                            onClick={() => handleTicketClick(item.ticketId)}
                            style={{
                                backgroundColor,
                                color: textColor,
                                textAlign: 'center',
                                padding: '8px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                width: '120px',
                                height: '80px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                            }}
                        >
                            {item.ticketId}
                        </div>
                    </Grid>
                );
            })}
        </Grid>
    );

    return (
        <div>
            {openQr && (
                <div className="overlay">
                    <QrReader onResult={handleScanResult} />
                </div>
            )}
            <div
                className="fab"
                onClick={() => setOpenQr(!openQr)}
                role="button"
                aria-label={openQr ? "Close QR Scanner" : "Open QR Scanner"}
            >
                {openQr ? <FaTimes /> : <FaPlus />}
            </div>
            
            <Grid
                container
                sx={{
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '80px',
                    overflowY: 'auto', // Allow vertical scrolling
                }}
            >
                <Typography variant="h4" textAlign="center" sx={{ mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }} paddingTop={'20px'}>
                    Queue Management
                </Typography>
                <Button onClick={exportToCSV} variant="outlined" sx={{ mb: 2 }}>
                 Export Queues to CSV
                </Button>
                <Grid container spacing={2} justifyContent="center" sx={{ flexGrow: 1, padding: { xs: '8px', md: '16px' } }}>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" textAlign="center">Queue</Typography>
                        {renderQueueItems(queues.queue)}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" textAlign="center">Engraving</Typography>
                        {renderQueueItems(queues.queueEngraving)}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" textAlign="center">Pending Collection</Typography>
                        {renderQueueItems(queues.queuePendingCollection)}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" textAlign="center">Collected</Typography>
                        {renderQueueItems(queues.queueCollected)}
                    </Grid>
                </Grid>

                <Modal open={formOpen} onClose={handleFormClose}>
                    <div className="modal-content" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', maxWidth: '400px', margin: 'auto' }}>
                        <Typography variant="h6" gutterBottom>Update Ticket</Typography>
                        
                        {/* Display Ticket Details */}
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Date Joined:</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {ticketDetails.dateJoined ? new Date(ticketDetails.dateJoined).toLocaleString() : 'N/A'}
                        </Typography>

                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Luggage Tag Color:</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>{ticketDetails.tagColor?.toUpperCase()}</Typography>

                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Engraving Text:</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>{ticketDetails.textToEngrave}</Typography>

                        {/* Queue Status Form */}
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Queue Status</InputLabel>
                            <Select value={selectedQueue} onChange={handleQueueChange}>
                                {Object.entries(QueueStatus).map(([statusKey, statusLabel]) => (
                                    <MenuItem key={statusKey} value={statusKey}>
                                        {statusLabel}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                            <Button onClick={handleSubmit} variant="contained" sx={{ mt: 1 }}>
                                Update
                            </Button>
                            <Button onClick={handleDelete} variant="contained" color="error">
                                Move to Deleted Queue
                            </Button>
                        </div>
                    </div>
                </Modal>
            </Grid>
        </div>
    );
}

export default AdminQueue;
