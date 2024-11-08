import './App.css';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// variables and context
import { USER_TYPES_NAV, decodedToken } from './constants';
import CombinedProvider from './contexts/CombinedContext';

// pages
import CustomSidebar from './sidebar/CustomSidebar';
import UserLanding from './pages/UserLanding'
import UserLandingDemo from './pages/UserLandingDemo'
import BoothRedemptionPage from './pages/BoothRedemption'
import MasterAdminPage from './pages/MasterAdmin'

import AdminLogin from './pages/AdminLogin';
import Selectbooth from './pages/Selectbooth';
import Qrcodescanner from './pages/Qrcodescanner';
import AdminQueue from "./pages/AdminQueue"
import EngravingSelection from './pages/EngravingSelection';

import Cybersecurity from './pages/Cybersecurity';
import Fintech from './pages/Fintech';
import AI from './pages/AI';
import SE from './pages/SE';
import RD from './pages/RD';
import Museum from './pages/Museum';
import Workshop from './pages/Workshop';
import LE from './pages/LE';
import Level3CA from './pages/Level3CA';
import Level5CA from './pages/Level5CA';

import { useSelector } from 'react-redux';







function App() {

  // let CURRENT_USER_TYPE = useSelector((state) => state.user.userRole);
  let CURRENT_USER_TYPE = USER_TYPES_NAV.BOOTH_HELPER;

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <CombinedProvider>

          {/* NAV BAR */}
          {CURRENT_USER_TYPE && <CustomSidebar />}
          <Container style={{ flexGrow: 1, maxWidth: "100%" }}>
            <Routes>
              <Route path={"/"} element={<UserLanding />} />
              <Route path={"/Home"} element={<UserLanding />} />
              <Route path={"/Demo"} element={<UserLandingDemo />} />

              <Route path={"/CybersecurityMap"} element={<Cybersecurity />} />
              <Route path={"/FintechMap"} element={<Fintech />} />
              <Route path={"/AIMap"} element={<AI />} />
              <Route path={"/SEMap"} element={<SE />} />
              <Route path={"/RedemptionMap"} element={<RD />} />
              <Route path={"/MuseumMap"} element={<Museum />} />
              <Route path={"/WorkshopMap"} element={<Workshop />} />
              <Route path={"/LEMap"} element={<LE />} />
              <Route path={"/Level3CA"} element={<Level3CA />} />
              <Route path={"/Level5CA"} element={<Level5CA />} />







              {/* Testing of Admin login - commented out by default */}
              {/* <Route path={"/"} element={<AdminLogin />} /> */}

              <Route path="/adminlogin" element={<AdminLogin />} />

              {/* To ensure these pages can only be accessible to Admin and Booth Helper Only! */}
              {(CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN || CURRENT_USER_TYPE === USER_TYPES_NAV.BOOTH_HELPER) ? (
                <>
                  <Route path="/selectbooth" element={<Selectbooth />} />
                  <Route path="/qrcodescanner" element={<Qrcodescanner />} />
                  <Route path="/adminqueue" element={<AdminQueue />} />
                  <Route path="/engravingselection/:uuid" element={<EngravingSelection />} />
                  <Route path="/Redemption" element={<BoothRedemptionPage />} />
                  <Route path="/masteradmin" element={<MasterAdminPage />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/" />} /> // Redirect to Home for any unmatched route
              )}

            </Routes>
          </Container>
        </CombinedProvider>
      </div>
      <ToastContainer position="top-center" />
    </Router>
  );
}


export default App;