import { React, useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import CategoryIcon from '@mui/icons-material/Category';
import { Typography } from '@mui/material';
import { CURRENT_USER_TYPE, USER_TYPES_NAV, decodedToken, removeToken, tokenValue } from '../constants';
import { useToastify } from '../contexts/ToastifyContext';
import { useLoader } from '../contexts/LoaderContext';
import nyp_logo from "./../assets/images/RGB_SIT_1.png";

function CustomSidebar() {
  const { setLoading } = useLoader();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  let role = null;
  let name = null;
  // get name and role from decoded token 
  if (decodedToken != null) {
    role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
    
  } else {
    <Navigate to='/Error' />;
  }

  // show and hide nav
  const handleToggle = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }

  const handleMenuItemClick = (path) => {
    setIsExpanded(false); // Close the navbar
    navigate(path); // Navigate to the new path
  };

  // display different landing page based on role
  const locationPfp = () => {
    if (CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN) {
      return 'Dashboard'
    }
    else if (CURRENT_USER_TYPE === USER_TYPES_NAV.BOOTH_HELPER) {
      return 'Dashboard'
    }
    else if (CURRENT_USER_TYPE === USER_TYPES_NAV.VISITOR) {
      return '/'
    }
  }

  return (
    <div className='sidebar-stick'>
      {true ?
        <>
        <Menu >
          <div className='menuBar'><MenuItem style={{backgroundColor: 'white'}} icon={<MenuIcon style={{color: 'black'}}/>} title="hide/un-hide" onClick={() => { handleToggle(); }}></MenuItem>
          <img src={nyp_logo} style={{ margin: "0px 0px 0px 0px", maxWidth: '60%'}} alt="NYP Logo" />
          </div>
        </Menu>
          <Sidebar style={{ height: "150vh"}} collapsed={!isExpanded} collapsedWidth= "0px" width= "300px" >
            <Menu >
              <div style={{ padding: '10px 18px 10px 18px', color: 'white' }}>
                <div style={{ padding: '0px 0px 0px 0px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Link to={`/${locationPfp()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <AccountCircleIcon sx={{ fontSize: "45px" }}></AccountCircleIcon>
                  </Link>
                  <div style={{ marginLeft: '20px' }} >
                    <Typography sx={{ fontSize: '13px' }}><b>{name} </b></Typography>
                    <Typography sx={{ fontSize: '10px' }}>{role}</Typography>
                  </div>

                  {(CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN || CURRENT_USER_TYPE === USER_TYPES_NAV.BOOTH_HELPER) ?
                  <>
                  <div style={{ marginLeft: 'auto' }}>
                    <Typography sx={{ fontSize: "12px" }}>
                      <button
                        style={{
                          background: "none",
                          color: "inherit",
                          border: "none",
                          padding: "0",
                          font: "inherit",
                          cursor: "pointer",
                          outline: "inherit",
                        }}
                        onClick={() => {
                          setLoading(false);
                          removeToken();
                          navigate("/");
                        }}
                      >
                        <b>Logout </b>
                      </button>
                    </Typography>
                  </div>
                  </> : null
                  }

                </div>
              </div>
              <MenuItem icon={<MenuIcon />} title="hide/un-hide" onClick={() => { handleToggle(); }}>Hide Navbar</MenuItem>
              <hr style={{ width: '80%' }} />
              {(CURRENT_USER_TYPE === USER_TYPES_NAV.VISITOR) ?
                <>
                   <MenuItem active={location.pathname === "/"} title="Home" onClick={() => handleMenuItemClick("/")}> Home </MenuItem>
                  <SubMenu icon={<ReceiptLongIcon />} label="Level 2">
                    <MenuItem active={location.pathname === "/CybersecurityMap"} title="Cybersecurity Map" onClick={() => handleMenuItemClick("/CybersecurityMap")}> Cybersecurity </MenuItem>
                    <MenuItem active={location.pathname === "/AIMap"} title="AI Map" onClick={() => handleMenuItemClick("/AIMap")}> AI </MenuItem>
                    <MenuItem active={location.pathname === "/SEMap"} title="Software Engineering Map" onClick={() => handleMenuItemClick("/SEMap")}> Software Engineering </MenuItem>
                    <MenuItem active={location.pathname === "/FintechMap"} title="Fintech Map" onClick={() => handleMenuItemClick("/FintechMap")}> FinTech/BlockChain </MenuItem>
                    <MenuItem active={location.pathname === "/RedemptionMap"} title="Redemption Map" onClick={() => handleMenuItemClick("/RedemptionMap")}> Redemption Counter </MenuItem>
                    <MenuItem active={location.pathname === "/MuseumMap"} title="Museum Map" onClick={() => handleMenuItemClick("/MuseumMap")}> Museum </MenuItem>

                  </SubMenu>
                  <SubMenu icon={<ReceiptLongIcon />} label="Level 3">
                    <MenuItem active={location.pathname === "/ReqLoan"} title="Request loan" component={<Link to="/ReqLoan" />}> Course Advise </MenuItem>
                    <MenuItem active={location.pathname === "/MyLoanReq"} title="My loan requests" component={<Link to="/MyLoanReq" />}> Laser Engraving </MenuItem>
                    <MenuItem active={location.pathname === "/MyLoanReqExt"} title="My loan request extensions" component={<Link to="/MyLoanReqExt" />}> Projects </MenuItem>
                  </SubMenu>
                  <SubMenu icon={<ReceiptLongIcon />} label="Level 5">
                    <MenuItem active={location.pathname === "/ReqLoan"} title="Request loan" component={<Link to="/ReqLoan" />}> Course Advise </MenuItem>
                    <MenuItem active={location.pathname === "/MyLoanReq"} title="My loan requests" component={<Link to="/MyLoanReq" />}> Workshops </MenuItem>
                  </SubMenu>
                </> : null
              }


              {(CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN || CURRENT_USER_TYPE === USER_TYPES_NAV.BOOTH_HELPER) ?
                <>
                <SubMenu icon={<ReceiptLongIcon />} label="Scan Booths">
                    <MenuItem active={location.pathname === "/ReqLoan"} title="Request loan" component={<Link to="/ReqLoan" />}> Cybersecurity </MenuItem>
                    <MenuItem active={location.pathname === "/MyLoanReq"} title="My loan requests" component={<Link to="/MyLoanReq" />}> AI </MenuItem>
                    <MenuItem active={location.pathname === "/MyLoanReqExt"} title="My loan request extensions" component={<Link to="/MyLoanReqExt" />}> Software Engineering </MenuItem>
                    <MenuItem active={location.pathname === "/ReqLoan"} title="Request loan" component={<Link to="/ReqLoan" />}> FinTech/BlockChain </MenuItem>
                    <MenuItem active={location.pathname === "/MyLoanReq"} title="My loan requests" component={<Link to="/MyLoanReq" />}> Redemption </MenuItem>
                    <MenuItem active={location.pathname === "/MyLoanReqExt"} title="My loan request extensions" component={<Link to="/MyLoanReqExt" />}> Museum </MenuItem>
                  </SubMenu>
                  <SubMenu icon={<ReceiptLongIcon />} label="Scan Workshops">
                    <MenuItem active={location.pathname === "/ReqLoan"} title="Request loan" component={<Link to="/ReqLoan" />}> Workshop 1 </MenuItem>
                    <MenuItem active={location.pathname === "/MyLoanReq"} title="My loan requests" component={<Link to="/MyLoanReq" />}> Workshop 2 </MenuItem>
                    <MenuItem active={location.pathname === "/MyLoanReqExt"} title="My loan request extensions" component={<Link to="/MyLoanReqExt" />}> Workshop 3 </MenuItem>
                  </SubMenu>
                  {/* <MenuItem icon={<DashboardIcon />} active={location.pathname === "/Dashboard"} title="Dashboard" component={<Link to="/Dashboard" />}> Dashboard</MenuItem> */}
                </> : null
              }
              {/* <MenuItem icon={<Inventory2Icon />} active={location.pathname === "/MyAssets"} title="My assets" component={<Link to="/MyAssets" />}> My Assets</MenuItem>
              <SubMenu icon={<ReceiptLongIcon />} label="Loan">
                <MenuItem active={location.pathname === "/ReqLoan"} title="Request loan" component={<Link to="/ReqLoan" />}> Request loan </MenuItem>
                <MenuItem active={location.pathname === "/MyLoanReq"} title="My loan requests" component={<Link to="/MyLoanReq" />}> My loan requests </MenuItem>
                <MenuItem active={location.pathname === "/MyLoanReqExt"} title="My loan request extensions" component={<Link to="/MyLoanReqExt" />}> My loan request extensions </MenuItem>
              </SubMenu> */}
              {(CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN || CURRENT_USER_TYPE === USER_TYPES_NAV.TSO || CURRENT_USER_TYPE === USER_TYPES_NAV.TSO_MANAGER || CURRENT_USER_TYPE === USER_TYPES_NAV.ADDD) ?
                <>
                  <SubMenu icon={<AdminPanelSettingsIcon />} label="Admin">
                    <SubMenu className="custom-submenu" label="Loan requests">
                      {(CURRENT_USER_TYPE === USER_TYPES_NAV.TSO || CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN) ?
                        <>
                          <MenuItem active={location.pathname === "/NewIncomingReq"} title="New incoming requests" component={<Link to="/NewIncomingReq" />}> (TSO) New incoming requests </MenuItem>
                        </> : null
                      }
                      {(CURRENT_USER_TYPE === USER_TYPES_NAV.TSO_MANAGER || CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN) ?
                        <>
                          <MenuItem active={location.pathname === "/LoanReqPendingTSOMGR"} title="(TSOMgr) Loan request pending" component={<Link to="/LoanReqPendingTSOMGR" />}> (TSOMgr) Loan request pending </MenuItem>
                        </> : null
                      }
                      {(CURRENT_USER_TYPE === USER_TYPES_NAV.ADDD || CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN) ?
                        <>
                          <MenuItem active={location.pathname === "/LoanReqPendingADDD"} title="(AD/DD) Loan request pending" component={<Link to="/LoanReqPendingADDD" />}> (AD/DD) Loan request pending </MenuItem>
                        </> : null
                      }
                      <MenuItem active={location.pathname === "/ProcessedLoanReq"} title="Processed loan requests" component={<Link to="/ProcessedLoanReq" />}> Processed loan requests </MenuItem>
                      <MenuItem active={location.pathname === "/ProcessedLoanExtReq"} title="Processed loan extension requests" component={<Link to="/ProcessedLoanExtReq" />}> Processed loan extension requests </MenuItem>
                      <MenuItem active={location.pathname === "/CreateLoanApprovalStaff"} title="Create approval loan request for staff" component={<Link to="/CreateLoanApprovalStaff" />}> Create approval loan request for staff </MenuItem>
                    </SubMenu>
                    <SubMenu label="Items">
                      <MenuItem active={location.pathname === "/ItemsPendingCollection"} title="Items pending collection" component={<Link to="/ItemsPendingCollection" />}> Items pending collection </MenuItem>
                      <MenuItem active={location.pathname === "/ItemsDueForReturn"} title="Items due for return" component={<Link to="/ItemsDueForReturn" />}> Items due for return </MenuItem>
                      <MenuItem active={location.pathname === "/ManageItems"} title="Manage items" component={<Link to="/ManageItems" />}> Manage items </MenuItem>
                      <MenuItem active={location.pathname === "/ManageBrands"} title="Manage brands" component={<Link to="/ManageBrands" />}> Manage brands </MenuItem>
                      <MenuItem active={location.pathname === "/ManageCategories"} title="Manage categories" component={<Link to="/ManageCategories" />}> Manage categories </MenuItem>
                      <MenuItem active={location.pathname === "/ManageModels"} title="Manage models" component={<Link to="/ManageModels" />}> Manage models </MenuItem>
                      <MenuItem active={location.pathname === "/ReturnItems"} title="Return items" component={<Link to="/ReturnItems" />}> Return items </MenuItem>
                    </SubMenu>
                    {/* <SubMenu label="Reports">
                      <MenuItem active={location.pathname === "/DecommissionedByMonth"} title="Decommissioned items (by month)" component={<Link to="/DecommissionedByMonth" />}> Decommissioned items (by month) </MenuItem>
                      <MenuItem active={location.pathname === "/NewItemsByMonth"} title="New items (by month)" component={<Link to="/NewItemsByMonth" />}> New items (by month) (by month) </MenuItem>
                      <MenuItem active={location.pathname === "/MonthlyItemsOverdue"} title="Monthly items overdue" component={<Link to="/MonthlyItemsOverdue" />}> Monthly items overdue </MenuItem>
                      <MenuItem active={location.pathname === "/StaffLoanReq"} title="Staff loan records" component={<Link to="/StaffLoanReq" />}> Decommissioned items (by month) </MenuItem>
                      <MenuItem active={location.pathname === "/StaffWithApprovedLoans"} title="Staff with approved loans" component={<Link to="/StaffWithApprovedLoans" />}> Staff with approved loans </MenuItem>
                      <MenuItem active={location.pathname === "/OutstandingStudentLoans"} title="Outstanding loans by students" component={<Link to="/OutstandingStudentLoans" />}> Outstanding loans by students </MenuItem>
                    </SubMenu> */}
                    {/* Reports  */}
                    <MenuItem active={location.pathname === "/Reports"} title="Reports" component={<Link to="/Reports" />}>Reports</MenuItem>
                    <SubMenu label="Suppliers/PO">
                      <MenuItem active={location.pathname === "/AddPO"} title="Add PO" component={<Link to="/AddPO" />}> Add PO </MenuItem>
                      <MenuItem active={location.pathname === "/ViewAllPO"} title="View all POs" component={<Link to="/ViewAllPO" />}> View all POs </MenuItem>
                      <MenuItem active={location.pathname === "/ManageCompany"} title="Manage company" component={<Link to="/ManageCompany" />}> Manage company </MenuItem>
                      <MenuItem active={location.pathname === "/ManageSuppliers"} title="Manage suppliers" component={<Link to="/ManageSuppliers" />}> Manage suppliers </MenuItem>
                    </SubMenu>
                    {/* <SubMenu label="Users">
                      <MenuItem active={location.pathname === "/ManageUsers"} title="Manage users" component={<Link to="/ManageUsers" />}> Manage users </MenuItem>
                      <MenuItem active={location.pathname === "/DownloadUserData"} title="Download users' data" component={<Link to="/DownloadUserData" />}> Download users' data </MenuItem>
                    </SubMenu> */}
                  </SubMenu>
                  {/* If needed, just uncomment and put the MenuiTem back in */}
                  {/* <SubMenu icon={<DisplaySettingsIcon />} label="Configuration"> */}
                  {/* </SubMenu> */}
                </> : null
              }
              {(CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN || CURRENT_USER_TYPE === USER_TYPES_NAV.STORE_USER) ?
                <>
                  <SubMenu icon={<CategoryIcon />} label="Store Items">
                    <MenuItem active={location.pathname === "/ManageItems"} title="Manage items" component={<Link to="/ManageItems" />}> Manage items </MenuItem>
                    <MenuItem active={location.pathname === "/ManageModels"} title="Manage models" component={<Link to="/ManageModels" />}> Manage models </MenuItem>
                    <MenuItem active={location.pathname === "/ManageCategories"} title="Manage categories" component={<Link to="/ManageCategories" />}> Manage categories </MenuItem>
                    <MenuItem active={location.pathname === "/ManageBrands"} title="Manage brands" component={<Link to="/ManageBrands" />}> Manage brands </MenuItem>
                  </SubMenu>
                </> : null
              }
              {(CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN || CURRENT_USER_TYPE === USER_TYPES_NAV.STORE_ADMIN) ?
                <>
                  <SubMenu icon={<AdminPanelSettingsIcon />} label="Administrative">
                    <MenuItem active={location.pathname === "/ManageUsers"} title="Manage users" component={<Link to="/ManageUsers" />}>Manage users</MenuItem>
                    <MenuItem active={location.pathname === "/ManageLocation"} title="Manage location" component={<Link to="/ManageLocation" />}> Manage location </MenuItem>
                  </SubMenu>
                </> : null
              }
            </Menu>
          </Sidebar>
        </> : null
      }
    </div>
  )
}

export default CustomSidebar