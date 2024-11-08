import React, { useState, useEffect, useRef } from 'react';
import Map from './../assets/images/CybersecurityMap.png';
import '../css/Wayfinder.css'; // Import your CSS file
import axios from './http';
import { useDispatch, useSelector } from "react-redux";
import { visitorLogin } from '../features/user/userslice';

const Cybersecurity = () => {
    const dispatch = useDispatch();
    const [scale, setScale] = useState(1.1);
    const [ticket_id, setUniqueId] = useState(() => localStorage.getItem('ticket_id') || ''); // Load from local storage // State for ticket ID
    const [loadingfetch, setLoadingFetch] = useState(false);
    // const [position, setPosition] = useState({ x: 0, y: 0 });
    // const containerRef = useRef(null);
    // const isDragging = useRef(false);
    // const startPos = useRef({ x: 0, y: 0 });

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale * 1.2, 1.6)); // Max zoom level of 3
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale / 1.2, 1.1)); // Min zoom level of 1
    };

    // const handleMouseDown = (e) => {
    //     isDragging.current = true;
    //     startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    // };

    // const handleMouseMove = (e) => {
    //     if (isDragging.current) {
    //         const dx = e.clientX - startPos.current.x;
    //         const dy = e.clientY - startPos.current.y;

    //         // Calculate new position
    //         let newX = dx;
    //         let newY = dy;

    //         // Get container dimensions
    //         const containerWidth = containerRef.current.offsetWidth * scale;
    //         const containerHeight = containerRef.current.offsetHeight * scale;
    //         const maxX = 0; // Left edge
    //         const minX = window.innerWidth - containerWidth; // Right edge
    //         const maxY = 0; // Top edge
    //         const minY = window.innerHeight - containerHeight; // Bottom edge

    //         // Limit panning within bounds
    //         newX = Math.min(maxX, Math.max(newX, minX));
    //         newY = Math.min(maxY, Math.max(newY, minY));

    //         setPosition({ x: newX, y: newY });
    //     }
    // };

    // const handleMouseUp = () => {
    //     isDragging.current = false;
    // };

    // const handleMouseLeave = () => {
    //     isDragging.current = false;
    // };

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
            // localStorage.setItem("accessToken", token);
            dispatch(visitorLogin({ ticketId: newTicketId, token }));
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

    const hasFetchedDataRefTicket = useRef(false);
    const hasFetchedDataRefAll = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingFetch(true); // Set loading to true before fetching data
                let ticketId = localStorage.getItem('ticket_id');

                if (!ticketId && !hasFetchedDataRefTicket.current) {
                    hasFetchedDataRefTicket.current = true; // Mark as fetched
                    ticketId = await fetchTicketId(); // Fetch ticket ID if not found
                }

            } catch (error) {
                console.error("Error during fetching data:", error);
            } finally {
                setLoadingFetch(false); // Set loading to false after all data is fetched
            }
        };

        if (!hasFetchedDataRefAll.current) {
            hasFetchedDataRefAll.current = true;
            fetchData();
            console.log(ticket_id);
        }

        // For active and inactive state
        const handleVisibilityChange = () => {
            console.log('Not active anymore');
            if (document.visibilityState === 'visible') {
                console.log('Reactive');
            }
        };
        window.addEventListener('visibilitychange', handleVisibilityChange);
    }, [ticket_id]);

    return (
        <div
            className="map-container"
        // onMouseDown={handleMouseDown}
        // onMouseMove={handleMouseMove}
        // onMouseUp={handleMouseUp}
        // onMouseLeave={handleMouseLeave}
        // style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
        >
            <div className="button-container" >
                <button onClick={zoomIn} className="zoom-button" >+</button>
                <button onClick={zoomOut} className="zoom-button" >−</button>
            </div>
            <div
                className="container"
                style={{
                    transform: `scale(${scale}) `
                }}
            //  translate(${position.x}px, ${position.y}px)`,
            //  ref={containerRef}
            >
                <img src={Map} alt="Cybersecurity Map" className="map-image" />
            </div>
        </div>
    );
}

export default Cybersecurity;
