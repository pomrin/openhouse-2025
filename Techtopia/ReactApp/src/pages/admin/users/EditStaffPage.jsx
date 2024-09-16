import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import http from "../../http";
import { useFormik } from "formik";
import * as yup from "yup";

import Stack from "@mui/material/Stack";
import { Typography, Container, TextField, Box, Button, Card, CardContent, Switch, MenuItem } from '@mui/material'
import Grid from '@mui/material/Grid';
import Iconify from "../components/iconify";
import { useToastify } from "../../../contexts/ToastifyContext";
// -------------------------------------------------------------

export default function EditStaffPage() {
  const { setStatus, setText, statusList } = useToastify();
  const { id } = useParams();
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState([]);
  const [userLoginName, setUserLoginName] = useState("");
  const [user, setUser] = useState({
    loginName: userLoginName,
    staffName: "",
    email: "",
    roleId: 0,
    disabled: false,
  });

  const validationSchema = yup.object().shape({
    staffName: yup.string().trim().required("Staff Name cannot be empty"),
    email: yup.string().trim().required("Email cannot be em"),
  });

  const formik = useFormik({
    initialValues: user,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (data) => {
      data.loginName = userLoginName;
      data.staffName = data.staffName.trim();
      data.email = data.email.trim();
      if (data.disabled == 0 || data.disabled == false) {
        data.disabled = false;
      } else {
        data.disabled = true;
      }
      http
        .put("/Staff", data)
        .then((res) => {
          setStatus(statusList[0]);
          setText("Successfully updated the user");         
          setTimeout(() => {
            setText("");
            setStatus("");
          }, 100);
          console.log(res.data);
          navigate("/ManageUsers");
        })
        .catch((error) => {
          console.error("There was an error updating the staff!", error);
        });
    },
  });

  // Get user details
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await http.get("/Login");
        const fetchedData = res.data;

        console.log(fetchedData);

        const userData = fetchedData.find((user) => user.staffId == id);

        if (userData) {
          setUser(userData);
          setUserLoginName(Object.values(userData)[1]);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    console.log(user);
    console.log(userLoginName);
  }, [user, userLoginName]);

  // Get user roles
  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const res = await http.get("/StaffRole");
        setUserRoles(res.data);
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    };

    fetchUserRoles();
  }, [])

  return (
    <Container style={{ margin: "20px" }} maxWidth='xl'>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Editing User: {userLoginName}</Typography>

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
        <Card style={{ width: "100%", backgroundColor: "#ffffff", paddingLeft: 10, paddingRight: 10, borderWidth: 10, borderColor: "#d9dadb" }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Stack>
                  <Typography variant="h6">Staff Name</Typography>
                  <TextField
                    name="staffName"
                    value={formik.values.staffName}
                    onChange={formik.handleChange}
                    error={formik.touched.staffName && Boolean(formik.errors.staffName)}
                    helperText={formik.touched.staffName && formik.errors.staffName}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      sx: {
                        backgroundColor: "#f0f0f0",
                        borderRadius: 1,
                        cursor: "not-allowed",
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
                          borderColor: "#ccc",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ccc",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ccc",
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
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      sx: {
                        backgroundColor: "#f0f0f0",
                        borderRadius: 1,
                        cursor: "not-allowed",
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
                          borderColor: "#ccc",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ccc",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ccc",
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
                  <Typography variant="h6">Staff Role</Typography>
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
              <Grid item xs={12} md={4}>
                <Stack>
                  <Typography variant="h6">Disable user</Typography>
                  <Switch
                    checked={formik.values.disabled}
                    onChange={(event) => formik.setFieldValue('disabled', event.target.checked)}
                    name="disabled"
                  />
                </Stack>
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant='contained'
              color="inherit"
              sx={{ marginTop: 2 }}
            >
              Save Details
            </Button>
          </CardContent>
        </Card>

      </Box>
    </Container>
  );
}
