import './App.css';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// variables and context
import { CURRENT_USER_TYPE, USER_TYPES_NAV, decodedToken } from './constants';
import CombinedProvider from './contexts/CombinedContext';
import NoAcess from './components/noaccess';

// pages
import Error from './pages/Error';
import Dashboard from './pages/Dashboard';
import MyAssets from './pages/MyAssets';
import ManageLocation from './pages/configuration/ManageLocation';
import ManageBrands from './pages/admin/items/ManageBrands';
import ManageItems from './pages/admin/items/ManageItems';
import ManageCategories from './pages/admin/items/ManageCategories';
import ManageModels from './pages/admin/items/ManageModels';
import ManageCompany from './pages/admin/supplierspo/ManageCompany';
import ManageSuppliers from './pages/admin/supplierspo/ManageSuppliers';
import ItemsDueForReturn from './pages/admin/items/ItemsDueForReturn';
import ItemsPendingCollection from './pages/admin/items/ItemsPendingCollection';
import ReturnItems from './pages/admin/items/ReturnItems';
import MyLoanReq from './pages/loans/MyLoanReq';
import MyLoanReqExt from './pages/loans/MyLoanReqExt';
import ReqLoan from './pages/loans/ReqLoan';
import CustomSidebar from './sidebar/CustomSidebar';
import CreateLoanApprovalStaff from './pages/admin/loanrequests/CreateLoanApprovalStaff';
import LoanReqPendingADDD from './pages/admin/loanrequests/LoanReqPendingADDD';
import LoanReqPendingTSOMGR from './pages/admin/loanrequests/LoanReqPendingTSOMGR';
import NewIncomingReq from './pages/admin/loanrequests/NewIncomingReq';
import ProcessedLoanExtReq from './pages/admin/loanrequests/ProcessedLoanExtReq';
import ProcessedLoanReq from './pages/admin/loanrequests/ProcessedLoanReq';
import DecommissionedByMonth from './pages/admin/reports/DecommissionedByMonth';
import MonthlyItemsOverdue from './pages/admin/reports/MonthlyItemsOverdue';
import NewItemsByMonth from './pages/admin/reports/NewItemsByMonth';
import OutstandingStudentLoans from './pages/admin/reports/OutstandingStudentLoans';
import StaffLoanReq from './pages/admin/reports/StaffLoanReq';
import StaffWithApprovedLoans from './pages/admin/reports/StaffWithApprovedLoans';
import AddPO from './pages/admin/supplierspo/AddPO';
import ViewAllPO from './pages/admin/supplierspo/ViewAllPO';
import DownloadUserData from './pages/admin/users/DownloadUserData';
import StoreItemsHome from './pages/StoreItemsHome';
import ManagePendingReq from './pages/admin/loanrequests/ManagePendingReq';
import ManageUsersPage from "./pages/admin/users/manage-users-view";
import AppView from "./pages/admin/reports/app-view";
import ThemeProvider from "./theme";
import ReportsTest from "./pages/admin/reports/Reports";
import EditStaffPage from "./pages/admin/users/EditStaffPage";
import AddUserPage from './pages/admin/users/AddUserPage';
import SignInPage from './pages/SignInPage';
import LoanReceipt from './pages/loans/LoanReceipt';
import UserLanding from './pages/UserLanding'
import UserLandingDemo from './pages/UserLandingDemo'
import BoothRedemptionPage from './pages/BoothRedemption'

import AdminLogin from './pages/AdminLogin';
import Selectbooth from './pages/Selectbooth';
import Qrcodescanner from './pages/Qrcodescanner';

import Cybersecurity from './pages/Cybersecurity';
import Fintech from './pages/Fintech';
import AI from './pages/AI';
import SE from './pages/SE';
import RD from './pages/RD';
import Museum from './pages/Museum';





function App() {
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



              {/* Testing of Admin login - commented out by default */}
              {/* <Route path={"/"} element={<AdminLogin />} /> */}

              {/* Admin Login for the 3 rows below this comment */}
              <Route path="/adminlogin" element={<AdminLogin />} />
              <Route path="/selectbooth" element={<Selectbooth />} />
              <Route path="/qrcodescanner" element={<Qrcodescanner />} />

              <Route path={"/Redemption"} element={<BoothRedemptionPage />} />
            </Routes>
          </Container>
        </CombinedProvider>
      </div>
      <ToastContainer position="top-center" />
    </Router>
  );
}


export default App;