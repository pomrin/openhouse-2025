import React, { useState, useEffect } from 'react'
import { Grid, colors, Box } from '@mui/material'
import assets from '../assets'
import SignInSelection from '../components/SignInSelection'
import SignInForm from '../components/SignInForm'
import { removeToken, tokenValue } from '../constants';
import { useToastify } from '../contexts/ToastifyContext'

export const ScreenMode = {
    SELECTION: "selection",
    SIGNIN: "signIn"
}

export default function SignInPage() {
    const { setText, setStatus } = useToastify();
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState("unset");
    const [width, setWidth] = useState(0);

    const [backgroundImage, setBackgroundImage] = useState(assets.images.selectionBg)
    const [currMode, setCurrMode] = useState(ScreenMode.SELECTION)

    const onSwitchMode = (mode) => { // Switch between selection and sign in mode
        setWidth(100);

        const timeout1 = setTimeout(() => { // Set the new mode
            setCurrMode(mode);
            setBackgroundImage(mode === ScreenMode.SELECTION ? assets.images.selectionBg : assets.images.signinBg); // Change background image
        }, 1100);

        const timeout2 = setTimeout(() => { // Reset the animation
            setLeft("unset");
            setRight(0);
            setWidth(0);
        }, 1200);

        const timeout3 = setTimeout(() => { // Reset the position
            setRight("unset");
            setLeft(0);
        }, 2500);

        return () => { // Clear the timeouts
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
        };
    };

    useEffect(() => {
        removeToken();
        setStatus("");
        setText("");
    }, []);

    return (
        <Grid container sx={{ height: "100vh" }}>
            <Grid item xs={6} sx={{ position: "relative", padding: 3 }}>
                {
                    currMode === ScreenMode.SELECTION ? (
                        <SignInSelection onSwitchMode={onSwitchMode} />
                    ) : (
                        <SignInForm onSwitchMode={onSwitchMode} />
                    )
                }
                <Box sx={{
                    position: "absolute",
                    top: 0,
                    left: left,
                    right: right,
                    width: `${width}%`,
                    height: "100%",
                    bgcolor: colors.indigo[700],
                    transition: "all 1s ease-in-out"
                }} />
            </Grid>
            <Grid item xs={6} sx={{
                position: "relative",
                backgroundImage: `url(${backgroundImage})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
            }}>
                <Box sx={{
                    position: "absolute",
                    top: 0,
                    left: left,
                    right: right,
                    width: `${width}%`,
                    height: "100%",
                    bgcolor: colors.common.white,
                    transition: "all 1s ease-in-out"
                }} />
            </Grid>
        </Grid >
    );
}
