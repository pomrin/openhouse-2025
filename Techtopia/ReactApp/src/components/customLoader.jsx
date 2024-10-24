import React from 'react';
import { Box, CircularProgress } from '@mui/material';

function CustomCircularProgress() {
    return (
        <Box sx={{
            width: 'fit-content',
            position: 'relative', 
            bottom: '65%',
            left: '32%',
            borderRadius: '10px', 
            padding: '10px', 
            margin: '5px 15px'  
        }}>
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0462f9" />
                        <stop offset="100%" stopColor="#ff0000" />
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress size={50} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
        </Box>    
    );
}

export default CustomCircularProgress;
