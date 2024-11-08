import axios from "axios";
import { USER_TYPES_NAV } from '../constants';


// Create an axios instance with a predefined base URL
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add a request interceptor to include the access token in headers
instance.interceptors.request.use(
  function (config) {
    // Retrieve the access token from local storage

    var accessToken;
    let userRole = localStorage.getItem("userRole");
    if (userRole === USER_TYPES_NAV.BOOTH_HELPER ||
      userRole === USER_TYPES_NAV.ADMIN
    ) {
      console.log(`User is a Admin Or Booth Helper: ${userRole}`);
      accessToken = localStorage.getItem("adminAccessToken");
    } else {
      console.log(`User is a ${userRole}`);
      accessToken = localStorage.getItem("accessToken");
    }

    // let accessToken = localStorage.getItem("accessToken");
    // console.log(`Access token: ${accessToken}`);
    // If the access token exists, add it to the Authorization header
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    // Return the updated config to proceed with the request
    return config;
  },
  function (error) {
    // Handle any errors that occur while setting up the request
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle responses globally
instance.interceptors.response.use(
  function (response) {
    // If the response status is in the range of 2xx,
    // simply return the response data
    return response;
  },
  // function (error) {
  //   // Handle responses with status codes outside the range of 2xx
  //   if (error.response.status === 401 || error.response.status === 403) {
  //     // If the status is 401 (Unauthorized) or 403 (Forbidden),
  //     // clear local storage and redirect the user to the login page
  //     localStorage.clear();
  //     window.location = "/";
  //   } else {
  //     // For other errors, log the error response
  //     console.log(error.response);
  //   }
  //   // Reject the promise to propagate the error
  //   return Promise.reject(error);
  // }
);

export default instance;
