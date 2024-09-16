import { React, useState, useEffect } from 'react'
import { Stack, Typography, TextField, Button, Pagination, Modal, Fade, Box, Backdrop } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import http from '../http'
import { tokenValue, decodedToken } from "../../constants"
import global from '../../global';
import dayjs from 'dayjs';
import SnackbarComponent from '../utilities/SnackbarComponent';

const otherButtonStyles = {
  width: '100px',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}

function ManageLocation() {
  const token = tokenValue

  const [location, setLocation] = useState("");
  const [locationNew, setLocationNew] = useState("");
  const [locationList, setLocationList] = useState([]); // list of locations

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [dataForModal, setDataForModal] = useState([]);

  const handleOpenModal = (data) => {
    setDataForModal(data);
    setModalOpen(true);
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setDataForModal([]);
    setLocationNew("");
  }

  // snackbar notifs
  const [showSnackbarError, setShowSnackbarError] = useState(false);
  const [showSnackbarSuccess, setShowSnackbarSuccess] = useState(false);
  const [showSnackbarEmpty, setShowSnackbarEmpty] = useState(false);
  const [showChangeError, setShowChangeError] = useState(false);
  const [showChangeSuccess, setShowChangeSuccess] = useState(false);
  const [showChangeEmpty, setShowChangeEmpty] = useState(false);

  //pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const handleChangePage = (newPage) => { setPage(newPage); };

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  const handleReset = () => {
    setLocation('');
  }

  const handleAdd = () => {
    const date = new Date();
    if (location) {
      http.post(`Location`,
        {
          locationId: 0,
          locationName: location.trim(),
          lastUpdatedBy: JSON.parse(decodedToken['Staff']).StaffId,
          lastUpdatedDateTime: date.toISOString(),
        }).then((res => {
          setShowSnackbarSuccess(true);
          handleReset();
          fetchData();
        })).catch((err => {
          console.log(err);
          setShowSnackbarError(true);
        }))
    } else {
      setShowSnackbarEmpty(true);
    }
  }

  // handle update of location name
  const handleChange = () => {
    const date = new Date();
    if (locationNew) {
      http.put(`/Location`,
        {
          locationId: dataForModal.locationId,
          locationName: locationNew.trim(),
          lastUpdatedBy: JSON.parse(decodedToken['Staff']).StaffId,
          lastUpdatedDateTime: date.toISOString(),
        }).then((res => {
          setShowChangeSuccess(true);
          handleCloseModal();
          fetchData();
        })).catch((err => {
          console.log(err);
          setShowChangeError(true);
        }))
    } else {
      setShowChangeEmpty(true);
    }
  }

  const sortedLocationList = locationList.sort((a, b) => a.locationName.localeCompare(b.locationName));

  // fetchdata 
  const fetchData = () => {
    http.get(`/Location`).then((res) => { setLocationList(res.data); });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <SnackbarComponent type="error" message="Location must not be empty" showSnackbar={showSnackbarEmpty} setShowSnackbar={setShowSnackbarEmpty} />
      <SnackbarComponent type="error" message="New location must not be empty" showSnackbar={showChangeEmpty} setShowSnackbar={setShowChangeEmpty} />
      <SnackbarComponent type="error" message="Something went wrong" showSnackbar={showSnackbarError} setShowSnackbar={setShowSnackbarError} />
      <SnackbarComponent type="error" message="Something went wrong" showSnackbar={showChangeError} setShowSnackbar={setShowChangeError} />
      <SnackbarComponent type="success" message="Success" showSnackbar={showSnackbarSuccess} setShowSnackbar={setShowSnackbarSuccess} />
      <SnackbarComponent type="success" message="Success" showSnackbar={showChangeSuccess} setShowSnackbar={setShowChangeSuccess} />

      <h2>SIT Asset Management System</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3 mb={2}>Manage location</h3>
      <h5> Add new location</h5>
      <Stack mb={4} direction='row' alignItems='center'>
        <Typography mr={2}>Location:</Typography>
        <TextField size='small' placeholder='Input location' sx={{ minWidth: '240px' }} value={location} onChange={(e) => setLocation(e.target.value)}></TextField>
      </Stack>
      <Stack direction={'row'} mb={4} maxWidth={400} float='right'>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '10px' }} onClick={handleReset}>Reset</Button>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px' }} onClick={handleAdd}>Add</Button>
      </Stack>
      <h5 mb={2}>Existing Locations</h5>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ whiteSpace: 'nowrap' }}>
            <TableRow sx={{ backgroundColor: '#5D7B9D' }}>
              <TableCell sx={{ color: 'white' }}><b>S/N</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Location</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Last Updated By</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Last Updated</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody mb={4} >
            {sortedLocationList.length != 0 ? (sortedLocationList.slice(startIndex, endIndex).map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#a3a3a3', cursor: 'pointer' } }}
                onClick={() => { handleOpenModal(row); }}
              >
                <TableCell size="small" component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell size="small" align="left" padding="normal">{row.locationName}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.lastUpdatedBy}</TableCell>
                <TableCell size="small" align="left" padding="normal">{dayjs(row.lastUpdatedDateTime).format(global.datetimeFormat)}</TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={4}>No data available</TableCell>
              </TableRow>
            )
            }
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <Stack direction='row' justifyContent='center' mt={3}>
        <Pagination
          count={Math.ceil(sortedLocationList.length / perPage)}
          page={page}
          onChange={(event, newPage) => handleChangePage(newPage)}
          color="primary"
          variant="outlined"
          shape="rounded"
        />
      </Stack>
      <Modal
        aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description"
        open={modalOpen} onClose={handleCloseModal} closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500, }, }}
        sx={{ overflow: 'auto' }}
      >
        <Fade in={modalOpen}>
          <Box className="modalBox" sx={{ overflow: 'auto', width: '400px' }}>
            <h4>Change location for location ID : {dataForModal.locationId}</h4>
            <Stack direction='row'>
              <Typography>Old name :</Typography>
              <Typography ml={3} mb={2} color={'darkGreen'} fontWeight='bold'>{dataForModal.locationName}</Typography>
            </Stack>
            <Stack direction='row' mb={4} alignItems='center'>
              <Typography mr={3}>New name :</Typography>
              <TextField size='small' placeholder='Input new location' sx={{ minWidth: '200px' }} value={locationNew} onChange={(e) => setLocationNew(e.target.value)}></TextField>
            </Stack>
            <Stack direction='row' justifyContent='center'>
              <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '24px' }} onClick={handleCloseModal}>Cancel</Button>
              <Button sx={{ ...otherButtonStyles, fontSize: '12px' }} onClick={handleChange}>Update</Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <br />
      <br />
    </div>
  )
}

export default ManageLocation