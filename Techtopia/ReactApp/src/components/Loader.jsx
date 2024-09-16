import React from 'react';
import { CircularProgress } from '@mui/material';

function Loader({ loading, size, sx }) {
    if (loading) {
        return (
            <CircularProgress
                size={size}
                sx={sx}
            />
        );
    }
}

export default Loader;
