import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../../http";
import { useFormik } from "formik";
import * as yup from "yup";

import Stack from "@mui/material/Stack";
import { Typography, Container, TextField, Box, Button, Card, CardContent, MenuItem } from '@mui/material'
import Grid from '@mui/material/Grid';
import Iconify from "../components/iconify";
import { useToastify } from "../../../contexts/ToastifyContext";
import { useUtil } from "../../../contexts/UtilContext";
// -------------------------------------------------------------

function AddUserPage() {
    const navigate = useNavigate();
    const { setStatus, setText, statusList } = useToastify();
    const { userRoles } = useUtil();
    const [error, setError] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const formik = useFormik({
        initialValues: {
            loginName: '',
            staffName: '',
            email: '',
            roleId: 1
        },
        validationSchema: yup.object().shape({
            loginName: yup.string().required("Staff ID is required"),
            staffName: yup.string().trim().required("Name is required"),
            email: yup.string().trim().required("Email is required"),
        }),
        onSubmit: (data) => {
            console.log(data);
            data.loginName = data.loginName;
            data.staffName = data.staffName.trim();
            data.email = data.email.trim();
            http
                .post("/Staff", data)
                .then((res) => {
                    setStatus(statusList[0]);
                    setText("Successfully added a user");                    
                    setTimeout(() => {
                        setText("");
                        setStatus("");
                      }, 100);
                    console.log(res.data);
                    navigate("/ManageUsers")
                })
                .catch((error) => {
                    console.error("There was an error adding the staff!", error);
                });
        }
    });

    const handleChange = (event) => {
        formik.setFieldValue('staffId', event.target.value);
    }

    // check staff id
    const checkStaffId = async () => {
        try {
            await http
                .get(`/MockADService`, {
                    params: { staffId: formik.values.loginName }
                })
                .then((res) => {
                    console.log(res.data);
                    setError('');
                    setButtonDisabled(true);
                    formik.setFieldValue('staffName', res.data.name);
                    formik.setFieldValue('email', res.data.email);
                });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("Staff ID not found");
                setError('Staff ID not found');
                setButtonDisabled(false);
                formik.setFieldValue('name', "");
                formik.setFieldValue('email', "");
            } else {
                console.log("An error occurred:", error.message);
            }
        }
    };

    return (
        <Container style={{ margin: "20px" }} maxWidth='xl'>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={5}
            >
                <Typography variant="h4">Add New User</Typography>

                <Link to={"/ManageUsers"}>
                    <Button
                        variant="contained"
                        color="inherit"
                        startIcon={<Iconify icon="ep:back" />}
                    >
                        Go Back
                    </Button>
                </Link>
            </Stack>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Card style={{ width: "100%", backgroundColor: "#ffffff", paddingLeft: 10, paddingRight: 10 }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                                <Stack>
                                    <Typography variant="h6">Key in your Staff ID:</Typography>
                                    <TextField
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            handleChange(e);
                                        }}
                                        error={formik.touched.loginName && Boolean(formik.errors.loginName) || Boolean(error)}
                                        helperText={formik.touched.loginName && formik.errors.loginName || error}
                                        name="loginName"
                                        fullWidth
                                        variant="outlined"
                                        value={formik.values.staffId}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <br></br>
                                <Button
                                    variant='contained'
                                    color="inherit"
                                    onClick={checkStaffId}
                                    sx={{ height: "60px" }}>
                                    Check ID
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack>
                                    <Typography variant="h6">Name</Typography>
                                    <TextField
                                        value={formik.values.staffName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.staffName && Boolean(formik.errors.staffName)}
                                        helperText={formik.touched.staffName && formik.errors.staffName}
                                        name="staffName"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: buttonDisabled,
                                            sx: {
                                                backgroundColor: buttonDisabled ? "#f0f0f0" : "transparent",
                                                borderRadius: 1,
                                                cursor: buttonDisabled ? "not-allowed" : "text",
                                                outline: "none",
                                                "&:focus": {
                                                    outline: "none",
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#ccc",
                                                        boxShadow: "none",
                                                    },
                                                },
                                            },
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: buttonDisabled ? "#ccc" : "",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: buttonDisabled ? "#ccc" : "",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: buttonDisabled ? "#ccc" : "",
                                                    boxShadow: "none",
                                                    outline: "none",
                                                },
                                            },
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack>
                                    <Typography variant="h6">Email</Typography>
                                    <TextField
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                        name="email"
                                        fullWidth
                                        InputProps={{
                                            readOnly: buttonDisabled,
                                            sx: {
                                                backgroundColor: buttonDisabled ? "#f0f0f0" : "transparent",
                                                borderRadius: 1,
                                                cursor: buttonDisabled ? "not-allowed" : "text",
                                                outline: "none",
                                                "&:focus": {
                                                    outline: "none",
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#ccc",
                                                        boxShadow: "none",
                                                    },
                                                },
                                            },
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: buttonDisabled ? "#ccc" : "",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: buttonDisabled ? "#ccc" : "",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: buttonDisabled ? "#ccc" : "",
                                                    boxShadow: "none",
                                                    outline: "none",
                                                },
                                            },
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack>
                                    <Typography variant="h6">Role</Typography>
                                    <TextField
                                        name="roleId"
                                        value={formik.values.roleId}
                                        onChange={formik.handleChange}
                                        error={formik.touched.roleId && Boolean(formik.errors.roleId)}
                                        helperText={formik.touched.roleId && formik.errors.roleId}
                                        fullWidth
                                        select
                                    >
                                        {userRoles.map(item => (
                                            <MenuItem value={item.roleId}>{item.roleName}</MenuItem>
                                        ))}
                                    </TextField>
                                </Stack>
                            </Grid>
                        </Grid>
                        <br></br>
                        <Button
                            // if result is 200
                            disabled={(import.meta.env.VITE_ALLOW_MANUAL_USER_CREATION == "false" || !(formik.isValid && formik.dirty))} // dont change the false here, change in .env
                            //else if result is 400
                            // disabled
                            type="submit"
                            variant='contained'
                            color="inherit">
                            Add User
                        </Button>
                    </CardContent>
                </Card>

            </Box>
        </Container>
    )
}

export default AddUserPage