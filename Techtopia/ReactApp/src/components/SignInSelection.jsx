import React from 'react'
import { Stack, colors, Typography, Button } from '@mui/material'
import { ScreenMode } from '../pages/SignInPage';
import nyp_logo from "./../assets/nyp_logo.png";

const SignInSelection = ({ onSwitchMode }) => {
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
                height: "100%",
                color: colors.grey[800]
            }}
        >
            <Stack spacing={5} sx={{
                width: "100%",
                maxWidth: "500px"
            }}>
                <Stack>
                    <img
                        src={nyp_logo}
                        width="100%"
                        style={{ margin: "0px 0px 20px 0px" }}
                        alt="NYP Logo"
                    />
                    <Typography variant='h4' fontWeight={600} color={colors.grey[800]}>
                        Choose Your Sign in Method
                    </Typography>
                </Stack>


                <Stack direction="row" spacing={4} sx={{ justifyContent: "center" }}>
                    <Button
                        disabled
                        variant='contained'
                        size="large"
                        sx={{
                            padding: "10px 20px",
                            color: "white",
                            bgcolor: colors.indigo[900],
                            "&:hover": {
                                bgcolor: colors.indigo[600]
                            }
                        }}
                    >
                        Infosys Credentials
                    </Button>
                    <Button
                        variant='contained'
                        size="large"
                        sx={{
                            padding: "10px 20px",
                            color: "white",
                            bgcolor: colors.indigo[900],
                            "&:hover": {
                                bgcolor: colors.indigo[600]
                            }
                        }}
                        onClick={() => onSwitchMode(ScreenMode.SIGN_UP)}
                    >
                        NYP SSO
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default SignInSelection