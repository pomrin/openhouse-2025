import { React, useState, useEffect } from 'react';
import { Input, IconButton, Typography, Stack, Button, Pagination } from '@mui/material';
import { Search } from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import http from '../../http'
import dayjs from 'dayjs';
import global from '../../../global';
import { tokenValue } from "../../../constants"

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

function ProcessedLoanReq() {
  const token = tokenValue

  const [activeItem, setActiveItem] = useState(""); // approved/not approved
  const [requestDate, setRequestDate] = useState(''); // daterequested
  const [processedDate, setProcessedDate] = useState(''); // dateprocessed
  const [inputField, setInputField] = useState(""); // search terms

  const [loanAll, setLoanAll] = useState([]); // list of all loan reqs
  const [loanReqs, setLoanReqs] = useState([]); // list of fffiltered loan requests

  //pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8); //change value based on pages needed

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  //find total requests
  const fetchData = () => {
    http.get(`/LoanRequestByLoanStatus?loanRequestStatus=-1&loanRequestStatus=-2&loanRequestStatus=-3&loanRequestStatus=2&loanRequestStatus=1&loanRequestStatus=3`).then((res) => {
      setLoanAll(res.data);
    })
  }
  useEffect(() => {
    fetchData()
  }, [])
  // check url for active item status 
  useEffect(() => {
    const url = window.location.href;
    const urlConcat = url.slice(-8);
    if (urlConcat === 'approved') {
      setActiveItem("approved");
      http.get(`/LoanRequestByLoanStatus?loanRequestStatus=1&loanRequestStatus=2&loanRequestStatus=3`).then((res) => {
        setLoanReqs(res.data);
      })
    } else if (urlConcat === 'rejected') {
      setActiveItem("rejected");
      http.get(`/LoanRequestByLoanStatus?loanRequestStatus=-1&loanRequestStatus=-2&loanRequestStatus=-3`).then((res) => {
        setLoanReqs(res.data);
      })
    } else {
      http.get(`/LoanRequestByLoanStatus?loanRequestStatus=-1&loanRequestStatus=-2&loanRequestStatus=-3&loanRequestStatus=2&loanRequestStatus=1&loanRequestStatus=3`).then((res) => {
        setLoanReqs(res.data);
      })
    }
  }, []);

  const handleClick = (approval) => {
    setActiveItem(approval);
    console.log(activeItem)
    if (approval === 'approved') {
      http.get(`/LoanRequestByLoanStatus?loanRequestStatus=1&loanRequestStatus=2&loanRequestStatus=3`).then((res) => {
        setLoanReqs(res.data);
      })
    }
    else if (approval === 'rejected') {
      http.get(`/LoanRequestByLoanStatus?loanRequestStatus=-1&loanRequestStatus=-2&loanRequestStatus=-3`).then((res) => {
        setLoanReqs(res.data);
      })
    }
  }

  const handleReset = () => {
    setInputField('');
    setActiveItem("");
    setRequestDate(null);
    setProcessedDate(null);
  }

  return (
    <div>
      <h2>SIT Asset Management System</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3 mb={2}>Manage processed loan requests</h3>

      <Stack direction='row' alignItems='center' overflow='auto' mb={4}>
        <Stack>
          <Typography mb={1}>Filter by</Typography>
          <Stack direction='row' style={{ marginRight: '30px' }}>
            <Input fontSize='1' placeholder='Search' style={{ width: '200px' }} value={inputField} onChange={(e) => setInputField(e.target.value)}></Input>
            <IconButton color="primary"> <Search /> </IconButton>
          </Stack>
        </Stack>
        <Stack>
          <Typography mb={1}>Request date</Typography>
          <DatePicker selected={requestDate} default={''} onChange={(date) => setRequestDate(date)} />
        </Stack>
        <Stack style={{ marginLeft: '10px', marginRight: '30px' }}>
          <Typography mb={1}>Processed date</Typography>
          <DatePicker selected={processedDate} onChange={(date) => setProcessedDate(date)} />
        </Stack>
      </Stack>
      <Stack direction='row' mb={5}>
        <Button sx={{ ...buttonStyles, fontSize: '12px', marginRight: '10px', backgroundColor: activeItem === 'approved' ? '#092041' : '#5D7B9D', color: activeItem === 'approved' ? '#a29be0' : '#fff' }} onClick={() => handleClick("approved")}>approved</Button>
        <Button sx={{ ...buttonStyles, fontSize: '12px', marginRight: '60px', backgroundColor: activeItem === 'rejected' ? '#092041' : '#5D7B9D', color: activeItem === 'rejected' ? '#a29be0' : '#fff' }} onClick={() => handleClick("rejected")}>rejected</Button>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '10px' }} onClick={handleReset}>Reset</Button>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px' }}>Search</Button>
      </Stack>
      <h5>Request found : {loanReqs.length}/{loanAll.length}</h5>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ whiteSpace: 'nowrap' }}>
            <TableRow sx={{ backgroundColor: '#5D7B9D' }}>
              <TableCell sx={{ color: 'white' }}><b>Loan request ID</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Category</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Brand</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Model</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Quantity</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Date</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Request staff</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Status</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Processed Date</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loanReqs.length != 0 ? (loanReqs.slice(startIndex, endIndex).map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell size="small" component="th" scope="row">
                  {global.addZeros(row.loanRequestId)}
                </TableCell>
                <TableCell size="small" align="left" padding="normal">{row.loanRequestDetails[0].categoryName || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.loanRequestDetails[0].brandName || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.loanRequestDetails[0].modelName || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.loanRequestDetails[0].quantity || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{dayjs(row.requestFromDate).format(global.dateFormat)}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.requestStaffName}</TableCell>
                <TableCell size="small" align="left" padding="normal">{global.statusChecker(row.status)}</TableCell>
                <TableCell size="small" align="left" padding="normal">{dayjs(row.processedDate).format(global.dateFormat)}</TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={9}>No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <Stack direction='row' justifyContent='center' mt={3}>
        <Pagination
          count={Math.ceil(loanReqs.length / perPage)}
          page={page}
          onChange={(event, newPage) => handleChangePage(newPage)}
          color="primary"
          variant="outlined"
          shape="rounded"
        />
      </Stack>
      <br></br>
      <br></br>
    </div>
  )
}

export default ProcessedLoanReq