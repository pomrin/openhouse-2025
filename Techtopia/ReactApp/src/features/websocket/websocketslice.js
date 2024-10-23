// src/features/websocket/websocketSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

let socket = null; // WebSocket reference

// Thunks for connecting, sending messages, and handling WebSocket events
export const connectWebSocket = createAsyncThunk(
    'websocket/connect',
    async ({ticketId, handleCycleBooth, refreshProfilePicture }, { dispatch }) => {
        const websocketUrl = import.meta.env.VITE_WEBSOCKET_API;
        socket = new WebSocket(websocketUrl);

        socket.onopen = () => {
            console.log('Connected to WebSocket');
            dispatch(setIsConnected(true));

            if (ticketId) {
                const broadcastMessage = { action: "broadcast", message: ticketId };
                socket.send(JSON.stringify(broadcastMessage));
                console.log('Broadcasted ticket_id:', ticketId);
            }
        };

        socket.onmessage = (event) => {
            console.log('Received message:', event.data);
            try {
                const messageData = JSON.parse(event.data);
                dispatch(addMessage(messageData));

                // Call the functions if specific messages are received
                if (messageData.message === 'cycleBooth') {
                    handleCycleBooth(); // Call the passed function
                } else if (messageData.message === 'updateImage') {
                    refreshProfilePicture(); // Call the passed function
                }
            } catch (error) {
                console.log(error, event.data);
                if (event.data === 'cycleBooth') {
                    handleCycleBooth(); // Call the passed function for string message
                }
                dispatch(addMessage({ message: event.data }));
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            dispatch(setIsConnected(false));
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
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
  
      const messageObject = { action: "sendmessage", recipientId, message: input };
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
