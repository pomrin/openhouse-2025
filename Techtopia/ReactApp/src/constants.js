import { jwtDecode } from "jwt-decode";

const USER_TYPES_NAV = {
    VISITOR: 'Visitor',
    ADMIN: 'Admin',
    BOOTH_HELPER: 'Booth_Helper',
    UNDEFINED: 'Unspecified'
    // USER: 'User',
    // TSO: 'TSO',
    // TSO_MANAGER: 'TSO Manager',
    // ADDD: "AD/DD",
    // ADMIN: 'Admin',
    // STORE_USER: 'Store User',
    // STORE_ADMIN: 'Store Admin',
    // STUDENT: 'Student',
};

let token = localStorage.getItem("accessToken");
let tokenDecoded = null;
let role = null;
let CURRENT_USER_TYPE = USER_TYPES_NAV.UNDEFINED;

const roleChecker = () => {
    if (role) {
        switch (role.toUpperCase()) {
            case "ADMIN":
                return USER_TYPES_NAV.ADMIN;
            case "BOOTH_HELPER":
                return USER_TYPES_NAV.BOOTH_HELPER;
            case "VISITOR":
                return USER_TYPES_NAV.VISITOR;
            // case "TSO":
            //     return USER_TYPES_NAV.TSO;
            // case "TSO_MANAGER":
            //     return USER_TYPES_NAV.TSO_MANAGER
            // case "ADDD":
            //     return USER_TYPES_NAV.ADDD;
            // case "STOREUSER":
            //     return USER_TYPES_NAV.STORE_USER;
            // case "STOREADMIN":
            //     return USER_TYPES_NAV.STORE_ADMIN;
            // case "STUDENT":
            //     return USER_TYPES_NAV.STUDENT;
            // case "USER":
            //     return USER_TYPES_NAV.USER;
            default:
                return USER_TYPES_NAV.UNDEFINED;
        }
    }
};

if (token) {
    console.log('token:', token);
    tokenDecoded = jwtDecode(token);
    role = tokenDecoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log('role:',role)
    //role = 'ADMIN'
    CURRENT_USER_TYPE = roleChecker();
}

function updateToken(newToken) { // Update token to get user role
    if (newToken) {
        token = newToken;
        tokenDecoded = jwtDecode(token);
        role = tokenDecoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        CURRENT_USER_TYPE = roleChecker();
    }
}

function removeToken() {
    if (localStorage.getItem("accessToken")) {
        localStorage.removeItem("accessToken");
        token = null;
    }
}

export { USER_TYPES_NAV, token as tokenValue, tokenDecoded as decodedToken, CURRENT_USER_TYPE, updateToken, removeToken };