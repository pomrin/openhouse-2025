import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { USER_TYPES_NAV } from "../../constants";
import { jwtDecode } from "jwt-decode";

const DEFAULT_USER_ROLE = USER_TYPES_NAV.VISITOR;

const initialState = {
  ticketId: localStorage.getItem("ticket_id")
    ? localStorage.getItem("ticket_id")
    : -1,
  userRole: localStorage.getItem("userRole")
    ? localStorage.getItem("userRole")
    : DEFAULT_USER_ROLE,
  visitorJWT: localStorage.getItem("accessToken")
    ? localStorage.getItem("accessToken")
    : null,
  adminJWT: localStorage.getItem("adminAccessToken")
    ? localStorage.getItem("adminAccessToken")
    : null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    visitorLogin: (state, action) => {
      console.log(`Visitor Login Payload - ${JSON.stringify(action.payload)}`);
      state.ticketId = action.payload["ticketId"];
      state.userRole = USER_TYPES_NAV.VISITOR;
      state.visitorJWT = action.payload["token"];

      localStorage.setItem("ticket_id", state.ticketId);
      localStorage.setItem("userRole", state.userRole);
      localStorage.setItem("accessToken", state.visitorJWT);
    },
    boothHelperLogin: (state, action) => {
    //   console.log(
    //     `boothHelperLogin Login Payload - ${JSON.stringify(action.payload)}`
    //   );
      state.userRole = USER_TYPES_NAV.BOOTH_HELPER;
      state.adminJWT = action.payload;

      localStorage.setItem("userRole", state.userRole);
      localStorage.setItem("adminAccessToken", state.adminJWT);

      if (action.payload) {
        // console.log(`Setting TicketId`);
        var decodedToken = jwtDecode(action.payload);
        const staffData = JSON.parse(decodedToken.Staff);
        // console.log(`staffData: ${staffData}`);
        const newTicketId = staffData.TicketId;
        // console.log(`newTicketId: ${newTicketId}`);
        state.ticketId = newTicketId;
        localStorage.setItem("ticket_id", state.ticketId);
      }
    },
    adminLogin: (state, action) => {
    //   console.log(
    //     `adminLogin Login Payload - ${JSON.stringify(action.payload)}`
    //   );
      state.userRole = USER_TYPES_NAV.ADMIN;
      state.adminJWT = action.payload;

      localStorage.setItem("userRole", state.userRole);
      localStorage.setItem("adminAccessToken", state.adminJWT);

      if (action.payload) {
        // console.log(`Setting TicketId`);
        var decodedToken = jwtDecode(action.payload);
        const staffData = JSON.parse(decodedToken.Staff);
        // console.log(`staffData: ${staffData}`);
        const newTicketId = staffData.TicketId;
        state.ticketId = newTicketId;
        localStorage.setItem("ticket_id", state.ticketId);
      }
    },
    boothadminlogout: (state) => {
      state.userRole = DEFAULT_USER_ROLE;
      state.adminJWT = null;

      localStorage.setItem("userRole", state.userRole);
      localStorage.removeItem("adminAccessToken");
    },
    updateUserRole: (state, action) => {
      state.userRole = action.payload;
      localStorage.setItem("userRole", state.userRole);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  boothadminlogout,
  updateUserRole,
  visitorLogin,
  boothHelperLogin,
  adminLogin,
} = userSlice.actions;

export default userSlice.reducer;
