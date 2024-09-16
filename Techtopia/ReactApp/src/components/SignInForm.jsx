import { Button, Stack, TextField, Typography, colors, Box, InputAdornment, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ScreenMode } from '../pages/SignInPage';
import http from "../pages/http";
import { useFormik } from "formik";
import * as yup from "yup";
import { updateToken } from '../constants';
import nyp_logo from "./../assets/nyp_logo.png";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Loader from './Loader';
import { useLoader } from '../contexts/LoaderContext';
import { useToastify } from '../contexts/ToastifyContext';
import { CURRENT_USER_TYPE, USER_TYPES_NAV } from '../constants';

function requestChecker(token, navigate, setText, setStatus, statusList) {
  if (CURRENT_USER_TYPE === USER_TYPES_NAV.TSO) {
    http
      .get("/LoanRequestByLoanStatus?loanRequestStatus=0")
      .then((res) => {
        if (Object.keys(res.data).length > 0) {
          setText("There are " + Object.keys(res.data).length + " new incoming request");
          setStatus(statusList[3]);
        }
      })
      .finally(navigate("/MyAssets"));
  } else if (CURRENT_USER_TYPE === USER_TYPES_NAV.TSO_MANAGER) {
    http
      .get("/LoanRequestByLoanStatus?loanRequestStatus=1")
      .then((res) => {
        if (Object.keys(res.data).length > 0) {
          setText("There are " + Object.keys(res.data).length + " loan request pending approval");
          setStatus(statusList[3]);
        }
      })
      .finally(navigate("/MyAssets"));
  } else if (CURRENT_USER_TYPE === USER_TYPES_NAV.ADDD) {
    http
      .get("/LoanRequestByLoanStatus?loanRequestStatus=3")
      .then((res) => {
        if (Object.keys(res.data).length > 0) {
          setText("There are " + Object.keys(res.data).length + " loan request pending approval");
          setStatus(statusList[3]);
        }
      })
      .finally(navigate("/MyAssets"));
  } else {
    navigate("/MyAssets");
  }
}

function SignInForm({ onSwitchMode }) {
  const navigate = useNavigate();
  const { loading, setLoading } = useLoader();
  const { setText, setStatus, statusList } = useToastify();
  const [showPassword, setShowPassword] = useState(false);

  // Check validation schema
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      // .min(3, "Username must be at least 3 characters long"),
      .required("Username is required"),
    password: yup
      .string()
      .trim()
      //.min(8, "Password must be at least 8 characters long")
      //.matches(/[a-z]/, "Password must contain at least one lowercase letter")
      //.matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      //.matches(/\d/, "Password must contain at least one number")
      //.matches(/\W/, "Password must contain at least one symbol")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (data) => {
      setLoading(true);
      console.log(data);
      data.username = data.username.trim();
      data.password = data.password.trim();

      http
        .post("/Login", data)
        .then((res) => {
          setLoading(false);
          // Update token to get user role
          updateToken(res.data);
          localStorage.setItem("accessToken", res.data);

          // toastify
          setText("Login Successful");
          setStatus(statusList[0]);

          requestChecker(res.data, navigate, setText, setStatus, statusList);
        })
        .catch((err) => {
          console.error(err);
          if (err.response && err.response.status === 401) {
            formik.setErrors({
              username: 'Username or password is wrong.',
              password: 'Username or password is wrong.'
            });
            setLoading(false);
          }
        });
    },
  });

  // useEffect(() => {
  //   // Fetch data from API
  //   http.get("/Login").then((res) => {
  //     const fetchedData = res.data;

  //     // Extract login names
  //     const names = fetchedData
  //       .map((user) => user.loginName)
  //       .filter((name) => name);
  //     console.log(names);
  //   });
  // }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Stack
      component="form" onSubmit={formik.handleSubmit}
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
            width="60%"
            style={{ margin: "0px 0px 20px 0px" }}
            alt="NYP Logo"
          />
          <Typography variant='h4' fontWeight={600} color={colors.grey[800]}>
            Sign In
          </Typography>
          <Typography color={colors.grey[600]}>
            Please Sign In with NYP SSO
          </Typography>
        </Stack>

        <Stack spacing={4}>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography color={colors.grey[800]}>Username</Typography>
              <TextField
                type='text'
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                name="username" />
            </Stack>
            <Stack spacing={1}>
              <Typography color={colors.grey[800]}>Password</Typography>
              <TextField
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                name="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Stack>
          <Button
            variant='contained'
            size='large'
            sx={{
              bgcolor: colors.indigo[900],
              "&:hover": {
                bgcolor: colors.indigo[600]
              }
            }}
            type='submit'
          >
            {loading ? <Loader loading={loading} size={24} color={"white"} sx={{ marginY: "3px", color: 'white' }} /> : "Sign In"}
          </Button>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Typography>Want to use a different method to sign in?</Typography>
          <Typography
            onClick={() => onSwitchMode(ScreenMode.SELECTION)}
            fontWeight={600}
            sx={{
              cursor: "pointer",
              userSelect: "none",
              color: colors.indigo[900]
            }}
          >
            Select here
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SignInForm;