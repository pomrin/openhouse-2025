// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import websocketReducer from '../features/websocket/websocketslice';

const store = configureStore({
  reducer: {
    websocket: websocketReducer,
  },
});

export default store;
