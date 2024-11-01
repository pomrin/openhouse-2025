// src/features/websocket/websocketSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

let socket = null; // WebSocket reference
let pingInterval = null;
let reconnectAttempts = 0; // Track reconnect attempts
let isFirstConnection = true;

const MAX_RECONNECT_ATTEMPTS = 5; // Optional limit on the number of attempts
const RECONNECT_DELAY_BASE = 1000; // Initial delay in ms (1 second)

// Thunks for connecting, sending messages, and handling WebSocket events
export const connectWebSocket = createAsyncThunk(
    'websocket/connect',
    async ({ ticketId, refreshProfilePicture, refreshStamps, refreshQueueNumber, refreshRedemptionStatus, refreshAll }, { dispatch }) => {
        const websocketUrl = import.meta.env.VITE_WEBSOCKET_API;
        
        const establishConnection = () => {
            socket = new WebSocket(websocketUrl);

            socket.onopen = () => {
                console.log('Connected to WebSocket');
                reconnectAttempts = 0; // Reset attempts on successful connection
                dispatch(setIsConnected(true));

                if (!isFirstConnection && refreshAll) {
                    refreshAll();
                    console.log("All components updated")
                }

                // Set to false after the first connection
                isFirstConnection = false;

                if (ticketId) {
                    const registerMessage = { action: "register", ticketId: ticketId, userGroup: "Visitor" };
                    socket.send(JSON.stringify(registerMessage));
                    console.log('Registered ticket_id:', ticketId);
                }

                // Start ping interval
                pingInterval = setInterval(() => {
                    if (socket.readyState === WebSocket.OPEN) {
                        const pingMessage = { action: "ping" };
                        socket.send(JSON.stringify(pingMessage));
                        console.log('Sent ping');
                    }
                }, 2 * 60 * 1000); // 2 minutes
            };

            socket.onmessage = (event) => {
                console.log('Received message:', event.data);
                try {
                    const messageData = JSON.parse(event.data);
                    dispatch(addMessage(messageData));

                    // Call the functions if specific messages are received
                    if (messageData.command === 'UPDATE_STAMP') {
                        refreshStamps(messageData.message);
                    } else if (messageData.command === 'UPDATE_PHOTO') {
                        refreshProfilePicture(messageData.message);
                    } else if (messageData.command === 'UPDATE_QUEUES') {
                        refreshQueueNumber(messageData.message);
                    } else if (messageData.command === 'UPDATE_REDEMPTION_STATUS') {
                        refreshRedemptionStatus(messageData.message);
                    }
                } catch (error) {
                    console.log(error, event.data);
                    dispatch(addMessage({ message: event.data }));
                }
            };

            socket.onclose = () => {
                clearInterval(pingInterval);
                console.log('WebSocket connection closed');
                dispatch(setIsConnected(false));
                
                // Attempt to reconnect with exponential backoff
                if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                    const delay = RECONNECT_DELAY_BASE * Math.pow(2, reconnectAttempts);
                    setTimeout(() => {
                        reconnectAttempts += 1;
                        console.log(`Attempting to reconnect... (Attempt ${reconnectAttempts})`);
                        establishConnection(); // Recursive attempt to reconnect
                    }, delay);
                }
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                socket.close(); // Close socket on error to trigger reconnect in `onclose`
            };
        };

        establishConnection(); // Initial connection attempt
    }
);

export const sendMessage = createAsyncThunk(
    'websocket/sendMessage',
    async ({ recipientId, input }, { getState }) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not connected');
        }

        if (!recipientId || !input) {
            throw new Error('Recipient ID and message input must not be empty');
        }

        const messageObject = { action: "sendmessage", recipientId, message: input, authKey: "Av3ryS3cr3tK3y" };
        socket.send(JSON.stringify(messageObject));
        console.log('Sent message:', messageObject);
    }
);

const websocketSlice = createSlice({
    name: 'websocket',
    initialState: {
        messages: [],
        isConnected: false,
        ticketId: '',
    },
    reducers: {
        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
});

export const { setIsConnected, addMessage } = websocketSlice.actions;
export default websocketSlice.reducer;
