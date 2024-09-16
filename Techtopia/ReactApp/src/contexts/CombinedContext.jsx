import React from 'react';
import { ToastifyProvider } from './ToastifyContext';
import { LoaderProvider } from './LoaderContext';
import { UtilProvider } from './UtilContext';

const CombinedProvider = ({ children }) => {
    return (
        <ToastifyProvider>
            <LoaderProvider>
                <UtilProvider>
                    {children}
                </UtilProvider>
            </LoaderProvider>
        </ToastifyProvider>
    );
};

export default CombinedProvider;
