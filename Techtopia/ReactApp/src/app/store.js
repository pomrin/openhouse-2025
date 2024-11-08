// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import websocketReducer from '../features/websocket/websocketslice';
import userReducer from '../features/user/userslice';

const store = configureStore({
  reducer: {
    websocket: websocketReducer,
    user: userReducer
  },
});

export default store;
