import { React, useState, useEffect } from 'react';
import { Input, IconButton, Typography, Stack, Button, Modal, Box } from '@mui/material';
import { Search } from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import "react-datepicker/dist/react-datepicker.css";
import http from "../../http"
import global from '../../../global';
import dayjs from 'dayjs';
import { tokenValue, decodedToken } from "../../../constants"

const buttonStyles = {
  width: '100px',
  backgroundColor: '#5D7B9D',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#092041',
    color: '#a29be0',
  }
}

const otherButtonStyles = {
  width: '100px',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}

function ManageItems() {
  const token = tokenValue
  //todo export button
  const [activeItemLoan, setActiveItemLoan] = useState('');
  const [activeItemStatusLoan, setActiveItemStatusLoan] = useState('');
  const [activeItemStatusItem, setActiveItemStatusItem] = useState('');
  const [inputField, setInputField] = useState("");

  const [category, setCategory] = useState("None");
  const [catList, setCatList] = useState([]); // list of categories
  const [brand, setBrand] = useState("None");
  const [brandList, setBrandList] = useState([]); // list of brands
  const [model, setModel] = useState("None");
  const [modelList, setModelList] = useState([]); // list of models
  const [location, setLocation] = useState("None");
  const [locationList, setLocationList] = useState([]); // list of locations
  const [staffList, setStaffList] = useState([]); // list of staff

  // for modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //for filtered item list
  const [filteredItemList, setFilteredItemList] = useState([]);

  const [itemList, setItemList] = useState([]);
  const [brandId, setBrandId] = useState(null);
  const [loanToStaff, setLoanToStaff] = useState("None");

  // pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const handleChangePage = (newPage) => { setPage(newPage); };

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  // check url to set data
  useEffect(() => {
    const url = window.location.href
    const urlConcat = url.slice(-9)
    if (urlConcat === 'decommsnd') {
      setActiveItemStatusItem('deCom')
      http.get(`/AssetItemSearch?AssetItemStatus=0`).then((res) => {
        setFilteredItemList(res.data);
      })
    } else if (urlConcat === 'loanableY') {
      setActiveItemLoan('approvedLoan')
      setActiveItemStatusItem('liveL')
      http.get(`/AssetItemSearch?AssetItemStatus=1&AssetItemLoanable=1`).then((res) => {
        setFilteredItemList(res.data);
      })
    } else if (urlConcat === 'loanedout') {
      setActiveItemStatusLoan('loaned')
      http.get(`/AssetItemSearch?ItemLoanStatus=2`).then((res) => {
        setFilteredItemList(res.data);
      })
    } else {
      http.get(`/AssetItemSearch`).then((res) => {
        setFilteredItemList(res.data);
      })
    }
  }, []);

  const handleCategory = (event) => {
    setCategory(event.target.value);
    const catId = findCatByName(event.target.value)
    http.get(`/AssetItemSearch?CatId=${catId}`).then((res) => {
      setFilteredItemList(res.data);
    });
  }

  const handleBrand = (event) => {
    const selectedBrandName = event.target.value;
    if (brandList) {
      const selectedBrand = brandList.find(brand => brand.brandName === selectedBrandName);
      if (selectedBrand) {
        setBrand(selectedBrandName);
        setBrandId(selectedBrand.brandId);
        setModel("None")
      }
    }
  }
  const handleModel = (event) => { setModel(event.target.value); }

  const handleLoanToStaff = (event) => {
    setLoanToStaff(event.target.value);
    const staffId = findStaffByName(event.target.value);
    console.log(staffId);
    http.get(`/AssetItemSearch?LoanedToStaffID=${staffId}`).then((res) => {
      setFilteredItemList(res.data);
    });
  }

  const handleLocation = (event) => {
    setLocation(event.target.value);
    const locId = findLocByName(event.target.value);
    http.get(`/AssetItemSearch?LocationIds=${locId}`).then((res) => {
      setFilteredItemList(res.data);
    });
  }

  const handleClickLoan = (approval) => {
    setActiveItemLoan(approval);
  }

  const handleClickSI = (approval) => {
    setActiveItemStatusItem(approval);
  }

  const handleClickSL = (approval) => {
    setActiveItemStatusLoan(approval);
  }

  const handleIconSearch = () => {
    http.get(`/AssetItemSearch?SearchTerm=${inputField}`).then((res) => {
      setFilteredItemList(res.data);
    });
  }

  const handleSearch = () => {

  }
  // finding
  const findStaff = (id) => { if (!staffList) return '-'; const staff = staffList.find((staff) => staff.staffId === id); return staff ? staff.staffName : '-' };
  const findCatById = (id) => { if (!catList) return '-'; const cat = catList.find((cat) => cat.catId === id); return cat ? cat.catName : '-' };
  const findStaffByName = (name) => { if (!staffList) return ''; const staff = staffList.find((staff) => staff.staffName === name); return staff ? staff.staffId : '-' };
  const findCatByName = (name) => { if (!catList) return ''; const cat = catList.find((cat) => cat.catName === name); return cat ? cat.catId : '' };
  const findLocByName = (name) => { if (!locationList) return ''; const Loc = LocList.find((Loc) => Loc.LocName === name); return Loc ? Loc.locationId : '' };
  // filtering
  const filteredModels = modelList ? modelList.filter(model => model.brandId === brandId) : [];
  // sorting a-z
  const sortedBrandList = brandList ? brandList.sort((a, b) => a.brandName.localeCompare(b.brandName)) : [];
  const sortedFilteredModels = filteredModels.sort((a, b) => a.modelName.localeCompare(b.modelName));
  const sortedCatList = catList ? catList.sort((a, b) => a.catName.localeCompare(b.catName)) : [];
  const sortedItemList = filteredItemList ? filteredItemList.sort((a, b) => findCatById(a.catId).localeCompare(findCatById(b.catId))) : [];
  const sortedLocationList = locationList ? locationList.sort((a, b) => a.locationName.localeCompare(b.locationName)) : [];
  const sortedStaffList = staffList ? staffList.sort((a, b) => a.staffName.localeCompare(b.staffName)) : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelListRes, catListRes, brandListRes, locationListRes, staffListRes] = await Promise.all([
          http.get(`/ItemModel`),
          http.get(`/ItemCategory`),
          http.get(`/ItemBrand`),
          http.get(`/Location`),
          http.get(`/Staff`)
        ]);

        setModelList(modelListRes.data);
        setCatList(catListRes.data);
        setBrandList(brandListRes.data);
        setLocationList(locationListRes.data);
        setStaffList(staffListRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleReset = () => {
    http.get(`/AssetItemSearch`).then((res) => {
      setFilteredItemList(res.data);
    }),
      setInputField('');
    setActiveItemLoan(null);
    setActiveItemStatusItem(null);
    setActiveItemStatusLoan(null);
    setCategory('None');
    setBrand('None');
    setModel('None');
    setLoanToStaff('None');
    setLocation('None');
    setBrandId('None');
  }

  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3 mb={2}>Manage items</h3>

      <Stack direction='row' alignItems='center' overflow='auto' mb={1}>
        <Stack direction='row' alignItems='flex-start' overflow='auto' mb={4}>
          <Stack>
            <Typography mb={0.5}>Filter by</Typography>
            <Stack mb={2} direction='row' style={{ marginRight: '30px', }}>
              <Input fontSize='1' placeholder='Search' style={{ width: '200px' }} value={inputField} onChange={(e) => setInputField(e.target.value)}></Input>
              <IconButton color="primary" onClick={handleIconSearch}> <Search /> </IconButton>
            </Stack>
            <Typography mb={0.5}>Location</Typography>
            <FormControl sx={{ minWidth: 240, minHeight: 40, marginRight: '30px' }} size="small">
              <Select id="demo-select-small" value={location} onChange={handleLocation} >
                <MenuItem value="None">
                  <div style={{ color: 'grey', opacity: '70%' }}>Select location</div>
                </MenuItem>
                {sortedLocationList.map((location, index) => (
                  <MenuItem key={index} value={location.locationName}>{location.locationName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack>
            <Typography mb={0.5}>Category</Typography>
            <FormControl sx={{ minWidth: 240, minHeight: 40, mb: 2, marginRight: '30px' }} size="small">
              <Select id="demo-select-small" value={category} onChange={handleCategory} >
                <MenuItem value="None">
                  <div style={{ color: 'grey', opacity: '70%' }}>Select category</div>
                </MenuItem>
                {sortedCatList.map((catList, index) => (
                  <MenuItem key={index} value={catList.catName}>{catList.catName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography mb={0.5}>Loaned to staff</Typography>
            <FormControl sx={{ minWidth: 240, minHeight: 40, marginRight: '30px' }} size="small">
              <Select id="demo-select-small" value={loanToStaff} onChange={handleLoanToStaff} >
                <MenuItem value="None">
                  <div style={{ color: 'grey', opacity: '70%' }}>Select staff</div>
                </MenuItem>
                {sortedStaffList.map((staffList, index) => (
                  <MenuItem key={index} value={staffList.staffName}>{staffList.staffName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack>
            <Typography mb={0.5}>Brand</Typography>
            <FormControl sx={{ minWidth: 240, minHeight: 40, mb: 2 }} size="small">
              <Select id="demo-select-small" value={brand} onChange={handleBrand} >
                <MenuItem value="None">
                  <div style={{ color: 'grey', opacity: '70%' }}>Select brand</div>
                </MenuItem>
                {sortedBrandList.map((brandList, index) => (
                  <MenuItem key={index} value={brandList.brandName}>{brandList.brandName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography mb={0.5}>Model</Typography>
            <FormControl sx={{ minWidth: 240, minHeight: 40 }} size="small">
              <Select id="demo-select-small" value={model} onChange={handleModel} >
                <MenuItem value="None">
                  <div style={{ color: 'grey', opacity: '70%' }}>Select model</div>
                </MenuItem>
                {sortedFilteredModels.map((modelItem, index) => (
                  <MenuItem key={index} value={modelItem.modelName}>{modelItem.modelName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction='row' mb={3}>
        <Stack mr={3}>
          <Typography mb={0.5}>Loanable</Typography>
          <Button sx={{ ...buttonStyles, fontSize: '12px', marginBottom: '5px', width: '150px', backgroundColor: activeItemLoan === 'approvedLoan' ? '#092041' : '#5D7B9D', color: activeItemLoan === 'approvedLoan' ? '#a29be0' : '#fff' }} onClick={() => handleClickLoan('approvedLoan')}>LOANABLE</Button>
          <Button sx={{ ...buttonStyles, fontSize: '12px', width: '150px', backgroundColor: activeItemLoan === 'rejectedLoan' ? '#092041' : '#5D7B9D', color: activeItemLoan === 'rejectedLoan' ? '#a29be0' : '#fff' }} onClick={() => handleClickLoan('rejectedLoan')}>NOT LOANABLE</Button>
        </Stack>
        <Stack mr={3}>
          <Typography mb={0.5}>Item status</Typography>
          <Button sx={{ ...buttonStyles, fontSize: '12px', marginBottom: '5px', width: '150px', backgroundColor: activeItemStatusItem === 'liveL' ? '#092041' : '#5D7B9D', color: activeItemStatusItem === 'liveL' ? '#a29be0' : '#fff' }} onClick={() => handleClickSI('liveL')}>LIVE</Button>
          <Button sx={{ ...buttonStyles, fontSize: '12px', width: '150px', backgroundColor: activeItemStatusItem === 'deCom' ? '#092041' : '#5D7B9D', color: activeItemStatusItem === 'deCom' ? '#a29be0' : '#fff' }} onClick={() => handleClickSI('deCom')}>DECOMMISSIONED</Button>
        </Stack>
        <Stack>
          <Typography mb={0.5}>Item loan status</Typography>
          <Button sx={{ ...buttonStyles, fontSize: '12px', marginBottom: '5px', width: '150px', backgroundColor: activeItemStatusLoan === 'NoLoan' ? '#092041' : '#5D7B9D', color: activeItemStatusLoan === 'NoLoan' ? '#a29be0' : '#fff' }} onClick={() => handleClickSL('NoLoan')}>Not loaned</Button>
          <Button sx={{ ...buttonStyles, fontSize: '12px', marginBottom: '5px', width: '150px', backgroundColor: activeItemStatusLoan === 'LoanRS' ? '#092041' : '#5D7B9D', color: activeItemStatusLoan === 'LoanRS' ? '#a29be0' : '#fff' }} onClick={() => handleClickSL('LoanRS')}>Reserved</Button>
          <Button sx={{ ...buttonStyles, fontSize: '12px', width: '150px', backgroundColor: activeItemStatusLoan === 'loaned' ? '#092041' : '#5D7B9D', color: activeItemStatusLoan === 'loaned' ? '#a29be0' : '#fff' }} onClick={() => handleClickSL('loaned')}>Assigned</Button>
        </Stack>
      </Stack>
      <Stack direction={'row'} mb={3}>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '10px' }} onClick={handleReset}>Reset</Button>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px' }}>Search</Button>
      </Stack>

      <h5>Total items found: {filteredItemList.length}/725</h5>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ whiteSpace: 'nowrap', }}>
            <TableRow sx={{ backgroundColor: '#5D7B9D' }}>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>S/N</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Item ID</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Category</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Brand</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Model</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Serial #</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Asset #</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Description</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>RFID</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Loaned to</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Last updated by</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Last updated</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Loan req ID</b></TableCell>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>Due date</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItemList.length != 0 ? (sortedItemList.slice(startIndex, endIndex).map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell size="small" component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell size="small" align="left" padding="normal">{findCatById(row.catId) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.itemId || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.brandName || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.modelName || '-'}</TableCell>
                <TableCell className="stubbornRow" size="small" align="left" padding="normal">{row.serialNumber || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.assetNumber || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.itemDescription || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.rfid || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.assignedTo || '-'}{console.log(row)}</TableCell>
                <TableCell size="small" align="left" padding="normal">{findStaff(row.lastUpdatedBy) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{dayjs(row.lastUpdatedDateTime).format(global.datetimeFormat) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.loanRequestId || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.itemLoanDueDate || '-'}</TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={13}>No data available</TableCell>
              </TableRow>
            )
            }
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <Stack direction='row' justifyContent='center' mt={3}>
        <Pagination
          count={Math.ceil(sortedItemList.length / perPage)}
          page={page}
          onChange={(event, newPage) => handleChangePage(newPage)}
          color="primary"
          variant="outlined"
          shape="rounded"
        />
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
      <br></br>
      <br></br>
    </div>
  )
}

export default ManageItems