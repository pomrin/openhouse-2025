import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useToastify } from '../contexts/ToastifyContext';

export default function Toastify() {
    const { status, text, statusList, setText, setStatus } = useToastify();

    useEffect(() => {
        if (status === statusList[0]) {
            toast.success(text);
        } else if (status === statusList[1]) {
            toast.warning(text);
        } else if (status === statusList[2]) {
            toast.error(text);
        } else if (status === statusList[3]) {
            toast.info(text);
        }

        setTimeout(() => {
            setText("");
            setStatus("");
        }, 500);
    }, [status, text, statusList]);

    return null;
}
