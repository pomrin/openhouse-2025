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
import { USER_TYPES_NAV, decodedToken, removeToken, tokenValue } from '../constants';
import { useToastify } from '../contexts/ToastifyContext';
import { useLoader } from '../contexts/LoaderContext';
import nyp_logo from "./../assets/images/RGB_SIT_1.png";
import { useSelector, useDispatch } from 'react-redux';
import { boothadminlogout } from '../features/user/userslice';

function CustomSidebar() {

  const dispatch = useDispatch();

  const CURRENT_USER_TYPE = useSelector((state) => state.user.userRole);

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

  const handleBoothClick = (boothId, boothName) => {
    setIsExpanded(false); // Close the navbar after selection
    console.log(`${boothName} clicked`);
    // Separate Engraving and Redemption booths from other booths via if else statement
    if (boothName === 'Engraving') {
      // Redirect to the engraving page
      navigate('/adminqueue');
    } else if (boothName === 'Redemption') {
      // Redirect to the redemption page
      navigate('/redemption');
    } else {
      navigate('/qrcodescanner', { state: { boothId, boothName } });
    }
  };

  // display different landing page based on role
  const locationPfp = () => {
    if (CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN) {
      return 'selectbooth'
    }
    else if (CURRENT_USER_TYPE === USER_TYPES_NAV.BOOTH_HELPER) {
      return 'selectbooth'
    }
    else if (CURRENT_USER_TYPE === USER_TYPES_NAV.VISITOR) {
      return 'Home'
    }
  }

  return (
    <div className='sidebar-stick'>
      {true ?
        <>
          {(CURRENT_USER_TYPE === USER_TYPES_NAV.VISITOR || CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN || CURRENT_USER_TYPE === USER_TYPES_NAV.BOOTH_HELPER) ?
            <>
              <Menu >
                <div className='menuBar'><MenuItem style={{ backgroundColor: 'white' }} icon={<MenuIcon style={{ color: 'black' }} />} title="hide/un-hide" onClick={() => { handleToggle(); }}></MenuItem>
                  <a href="/Home"><img src={nyp_logo} style={{ margin: "0 ", maxWidth: '100%', height: 'auto  ' }} alt="NYP Logo" /></a>
                </div>
              </Menu>
              <Sidebar style={{ height: "100vh", overflowY: 'auto' }} collapsed={!isExpanded} collapsedWidth="0px" width="300px" >
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
                                // localStorage.removeItem('accessToken');
                                dispatch(boothadminlogout());
                                // removeToken();
                                navigate("/adminlogin");

                                // Reload the page after performing the above actions
                                window.location.reload();
                              }}
                            >
                              <b>Logout</b>
                            </button>
                            </Typography>
                          </div>
                        </> : null
                      }

                    </div>
                  </div>
                  <MenuItem icon={<MenuIcon />} title="hide/un-hide" onClick={() => { handleToggle(); }}>Hide Navbar</MenuItem>
                  <hr style={{ width: '80%' }} />

                  {(CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN || CURRENT_USER_TYPE === USER_TYPES_NAV.BOOTH_HELPER) ?
                    <>
                      <MenuItem active={location.pathname === "/selectbooth"} title="Overview" onClick={() => handleMenuItemClick("/selectbooth")}> Overview </MenuItem>
                      <SubMenu icon={<ReceiptLongIcon />} label="Scan Booths">
                        {[
                          { boothId: '1', boothName: 'Cyber Security' },
                          { boothId: '2', boothName: 'Data Analytics' },
                          { boothId: '3', boothName: 'FinTech' },
                          { boothId: '4', boothName: 'AI' },
                          { boothId: '5', boothName: 'Redemption' },
                          { boothId: '6', boothName: 'Engraving' }
                        ].map(booth => (
                          <MenuItem
                            key={booth.boothId}
                            onClick={() => handleBoothClick(booth.boothId, booth.boothName)}
                          >
                            {booth.boothName}
                          </MenuItem>

                        ))}
                      </SubMenu>
                      <SubMenu icon={<ReceiptLongIcon />} label="Scan Workshops">
                        {[
                          { workshopId: '1', boothName: 'Software Engineering Workshop' },
                          { workshopId: '2', boothName: 'Fintech Workshop' },
                          { workshopId: '3', boothName: 'Cyber Security Workshop' },
                          { workshopId: '4', boothName: 'Artificial Intelligence Workshop' },
                        ].map(booth => (
                          <MenuItem
                            key={booth.boothId}
                            onClick={() => handleBoothClick(booth.workshopId, booth.boothName)}
                          >
                            {booth.boothName}
                          </MenuItem>
                        ))}
                      </SubMenu>
                      <SubMenu icon={<ReceiptLongIcon />} label="Engraving">
                      <MenuItem active={location.pathname === "/AdminQueue"} title="Admin Queue Management" onClick={() => handleMenuItemClick("/AdminQueue")}> Queue Management </MenuItem>
                      </SubMenu>
                    </> : null
                  }

                  {(CURRENT_USER_TYPE === USER_TYPES_NAV.VISITOR || CURRENT_USER_TYPE === USER_TYPES_NAV.ADMIN || CURRENT_USER_TYPE === USER_TYPES_NAV.BOOTH_HELPER) ?
                    <>
                      <MenuItem active={location.pathname === "/"} title="Home" onClick={() => handleMenuItemClick("/")}> Home </MenuItem>
                      <SubMenu icon={<ReceiptLongIcon />} label="Level 2 Maps">
                        <MenuItem active={location.pathname === "/CybersecurityMap"} title="Cybersecurity Map" onClick={() => handleMenuItemClick("/CybersecurityMap")}> Cybersecurity </MenuItem>
                        <MenuItem active={location.pathname === "/AIMap"} title="AI Map" onClick={() => handleMenuItemClick("/AIMap")}> AI </MenuItem>
                        <MenuItem active={location.pathname === "/SEMap"} title="Software Engineering Map" onClick={() => handleMenuItemClick("/SEMap")}> Software Engineering </MenuItem>
                        <MenuItem active={location.pathname === "/FintechMap"} title="Fintech Map" onClick={() => handleMenuItemClick("/FintechMap")}> FinTech/BlockChain </MenuItem>
                        <MenuItem active={location.pathname === "/RedemptionMap"} title="Redemption Map" onClick={() => handleMenuItemClick("/RedemptionMap")}> Redemption Counter </MenuItem>
                        <MenuItem active={location.pathname === "/MuseumMap"} title="Museum Map" onClick={() => handleMenuItemClick("/MuseumMap")}> Museum </MenuItem>

                      </SubMenu>
                      <SubMenu icon={<ReceiptLongIcon />} label="Level 3 Maps">
                        <MenuItem active={location.pathname === "/Level3CA"} title="Course Advice @ Level 3" onClick={() => handleMenuItemClick("/Level3CA")}> Course Advice </MenuItem>
                        <MenuItem active={location.pathname === "/LEMap"} title="Laser Engraving Map" onClick={() => handleMenuItemClick("/LEMap")}> Laser Engraving Map </MenuItem>
                        <MenuItem active={location.pathname === "/MyLoanReqExt"} title="My loan request extensions" component={<Link to="/MyLoanReqExt" />}> Projects </MenuItem>
                      </SubMenu>
                      <SubMenu icon={<ReceiptLongIcon />} label="Level 5 Maps">
                        <MenuItem active={location.pathname === "/Level5CA"} title="Course Advice @ Level 5" onClick={() => handleMenuItemClick("/Level5CA")}> Course Advice </MenuItem>
                        <MenuItem active={location.pathname === "/WorkshopMap"} title="Workshop Map" onClick={() => handleMenuItemClick("/WorkshopMap")}> Workshop Map </MenuItem>
                      </SubMenu>
                      <hr style={{ width: '80%' }} />


                      {CURRENT_USER_TYPE === USER_TYPES_NAV.VISITOR &&
                              <MenuItem active={location.pathname === "/adminlogin"} title="Admin Login" onClick={() => handleMenuItemClick("/adminlogin")}> Admin Login </MenuItem>
                      }
                    </> : null
                  }
                </Menu>
              </Sidebar>
            </> : null
          }
        </> : null
      }
    </div>
  )
}

export default CustomSidebar