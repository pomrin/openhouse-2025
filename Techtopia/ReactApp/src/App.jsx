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
import BoothRedemptionPage from './pages/BoothRedemption'

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <CombinedProvider>
          {/* NAV BAR */}
          {CURRENT_USER_TYPE && <CustomSidebar />}
          <Container style={{ flexGrow: 1, maxWidth: "100%" }}>
            <Routes>
              <Route path={"/Home"} element={<UserLanding />} />
              <Route path={"/SignInPage"} element={<SignInPage />} />
              <Route path={"/Error"} element={<Error />} />
              <Route path={"/MyAssets"} element={<MyAssets />} />
              <Route path={"/ReqLoan"} element={<ReqLoan />} />
              <Route path={"/MyLoanReq"} element={<MyLoanReq />} />
              <Route path={"/MyLoanReceipt"} element={<LoanReceipt />} />
              <Route path={"/MyLoanReqExt"} element={<MyLoanReqExt />} />
              <Route path={"/BHRedemption"} element={<BoothRedemptionPage />} />

              {/* TSO, TSO Manager, AD/DD */}
              <Route path={"/Dashboard"} element={<StaffElement><Dashboard /></StaffElement>} />
              <Route path={"/NewIncomingReq"} element={<TSOElement><NewIncomingReq /></TSOElement>} />
              <Route path={"/LoanReqPendingADDD"} element={<ADDDElement><LoanReqPendingADDD /></ADDDElement>} />
              <Route path={"/LoanReqPendingTSOMGR"} element={<TSOManagerElement><LoanReqPendingTSOMGR /></TSOManagerElement>} />
              <Route path={"/ProcessedLoanExtReq"} element={<StaffElement><ProcessedLoanExtReq /></StaffElement>} />
              <Route path={"/ProcessedLoanReq"} element={<StaffElement><ProcessedLoanReq /></StaffElement>} />
              <Route path={"/CreateLoanApprovalStaff"} element={<StaffElement><CreateLoanApprovalStaff /></StaffElement>} />
              <Route path={"/ItemsDueForReturn"} element={<StaffElement><ItemsDueForReturn /></StaffElement>} />
              <Route path={"/ItemsPendingCollection"} element={<StaffElement><ItemsPendingCollection /></StaffElement>} />
              <Route path={"/ReturnItems"} element={<StaffElement><ReturnItems /></StaffElement>} />
              <Route path={"/DecommissionedByMonth"} element={<StaffElement><DecommissionedByMonth /></StaffElement>} />
              <Route path={"/MonthlyItemsOverdue"} element={<StaffElement><MonthlyItemsOverdue /></StaffElement>} />
              <Route path={"/NewItemsByMonth"} element={<StaffElement><NewItemsByMonth /></StaffElement>} />
              <Route path={"/OutstandingStudentLoans"} element={<StaffElement><OutstandingStudentLoans /></StaffElement>} />
              <Route path={"/StaffLoanReq"} element={<StaffElement><StaffLoanReq /></StaffElement>} />
              <Route path={"/StaffWithApprovedLoans"} element={<StaffElement><StaffWithApprovedLoans /></StaffElement>} />
              <Route path={"/AddPO"} element={<StaffElement><AddPO /></StaffElement>} />
              <Route path={"/ViewAllPO"} element={<StaffElement><ViewAllPO /></StaffElement>} />
              <Route path={"/ManageCompany"} element={<StaffElement><ManageCompany /></StaffElement>} />
              <Route path={"/ManageSuppliers"} element={<StaffElement><ManageSuppliers /></StaffElement>} />
              <Route path={"/DownloadUserData"} element={<StaffElement><DownloadUserData /></StaffElement>} />
              <Route path={"/Reports"} element={<ThemeProvider><StaffElement><AppView /></StaffElement></ThemeProvider>} />

              {/* Store User/Admin */}
              <Route path={"/ManageLocation"} element={<StoreElement><ManageLocation /></StoreElement>} />
              <Route path={"/ManageBrands"} element={<StoreElement><ManageBrands /></StoreElement>} />
              <Route path={"/ManageItems"} element={<StoreElement><ManageItems /></StoreElement>} />
              <Route path={"/ManageCategories"} element={<StoreElement><ManageCategories /></StoreElement>} />
              <Route path={"/ManageModels"} element={<StoreElement><ManageModels /></StoreElement>} />
              <Route path={"/StoreItemsHome"} element={<StoreElement><StoreItemsHome /></StoreElement>} />

              {/* Admin */}
              <Route path={"/ManagePendingReq"} element={<StaffAdminElement><ManagePendingReq /></StaffAdminElement>} />
              <Route path={"/ManageUsers"} element={<ThemeProvider><StaffAdminElement><ManageUsersPage /></StaffAdminElement></ThemeProvider>} />
              <Route path={"/ManageUsers/:id"} element={<ThemeProvider><StaffAdminElement><EditStaffPage /></StaffAdminElement></ThemeProvider>} />
              <Route path={"/AddUsers"} element={<ThemeProvider><StaffAdminElement><AddUserPage /></StaffAdminElement></ThemeProvider>} />
              <Route path={"/ReportsTest"} element={<ThemeProvider><StaffAdminElement><ReportsTest /></StaffAdminElement></ThemeProvider>} />
            </Routes>
          </Container>
        </CombinedProvider>
      </div>
      <ToastContainer position="top-center" />
    </Router>
  );
}

function TSOElement({ children }) {
  if (CURRENT_USER_TYPE === USER_TYPES_NAV.TSO || CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN) {
    return <>{children}</>
  } else {
    return <NoAcess />
  }
}

function TSOManagerElement({ children }) {
  if (CURRENT_USER_TYPE === USER_TYPES_NAV.TSO_MANAGER || CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN) {
    return <>{children}</>
  } else {
    return <NoAcess />
  }
}

function ADDDElement({ children }) {
  if (CURRENT_USER_TYPE === USER_TYPES_NAV.ADDD || CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN) {
    return <>{children}</>
  } else {
    return <NoAcess />
  }
}

function StaffElement({ children }) {
  if (CURRENT_USER_TYPE != USER_TYPES_NAV.STUDENT && CURRENT_USER_TYPE != USER_TYPES_NAV.USER) {
    return <>{children}</>
  } else {
    return <NoAcess />
  }
}

function StaffAdminElement({ children }) {
  if (CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN) {
    return <>{children}</>
  } else {
    return <NoAcess />
  }
}

function StoreElement({ children }) {
  if (CURRENT_USER_TYPE === USER_TYPES_NAV.STORE_ADMIN || CURRENT_USER_TYPE === USER_TYPES_NAV.STORE_USER || CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN) {
    return <>{children}</>
  } else {
    return <NoAcess />
  }
}


export default App;