import React, { createContext, useContext, useState } from 'react';
import Toastify from '../components/Toastify';

const ToastifyContext = createContext();

export const ToastifyProvider = ({ children }) => {
    // toastify
    const [status, setStatus] = useState("")
    const [text, setText] = useState("")
    const [statusList] = useState(["success", "warning", "error", "info"]);

    return (
        <ToastifyContext.Provider
            value={{
                status, setStatus,
                text, setText,
                statusList
            }}>
            {children}
            <Toastify />
        </ToastifyContext.Provider>
    );
};

export const useToastify = () => useContext(ToastifyContext);