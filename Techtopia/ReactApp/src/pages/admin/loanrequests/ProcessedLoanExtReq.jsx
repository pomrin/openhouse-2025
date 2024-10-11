import { React, useState } from 'react';
import { Input, IconButton, Typography, Stack, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import "react-datepicker/dist/react-datepicker.css";

function populateRows(reqID, cat, brand, model, reqQty, reqDate, reqStaff, status, procDate) {
  return { reqID, cat, brand, model, reqQty, reqDate, reqStaff, status, procDate };
}

const rowsLoan = [
  populateRows('000029', 'Cable', 'N/A', 'N/A', '1', '01/11/2023 9:40AM', 'CAI RONNIE', 'New', '01/11/2023 9:40AM	'),
  populateRows('000030', 'Cable', 'N/A', 'N/A', '1', '01/11/2023 9:40AM', 'CAI RONNIE', 'New', '01/11/2023 9:40AM	'),
  populateRows('000031', 'Cable', 'N/A', 'N/A', '1', '01/11/2023 9:40AM', 'CAI RONNIE', 'New', '01/11/2023 9:40AM	'),
  populateRows('000032', 'Cable', 'N/A', 'N/A', '1', '01/11/2023 9:40AM', 'CAI RONNIE', 'New', '01/11/2023 9:40AM	'),
];

const otherButtonStyles = {
  width: '100px',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}

function ProcessedLoanExtReq() {
  const [inputField, setInputField] = useState("");
  const [status, setStatus] = useState("None");

  const handleClick = (approval) => {
    setActiveItem(approval);
  }

  const handleStatus = (event) => {
    setStatus(event.target.value);
  }

  const handleReset = () => {
    setInputField('');
    setStatus("None");
  }

  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3 mb={2}>Manage processed loan extension requests</h3>

      <Stack direction='row' alignItems='center' overflow='auto' mb={4}>
        <Stack>
          <Typography mb={1}>Filter by</Typography>
          <Stack direction='row' style={{ marginRight: '30px' }}>
            <Input fontSize='1' placeholder='Search' style={{ width: '200px' }} value={inputField} onChange={(e) => setInputField(e.target.value)}></Input>
            <IconButton color="primary"> <Search /> </IconButton>
          </Stack>
        </Stack>
        <Stack>
          <Typography mb={1}>Request status</Typography>
          <FormControl sx={{ minWidth: 240, minHeight: 40 }} size="small">
            <Select id="demo-select-small" value={status} onChange={handleStatus} >
              <MenuItem value="None">
                <div style={{ color: 'grey', opacity: '70%' }}>Please select a value</div>
              </MenuItem>
              <MenuItem value={10}>Rejected by AD or DD</MenuItem>
              <MenuItem value={20}>Rejected by TSO Mgr</MenuItem>
              <MenuItem value={30}>Rejected by TSO</MenuItem>
              <MenuItem value={40}>New request</MenuItem>
              <MenuItem value={50}>Pending approval by TSO Mgr</MenuItem>
              <MenuItem value={60}>Approval by TSO Mgr</MenuItem>
              <MenuItem value={70}>Approved by TSO Mgr and Pending approval by AD or DD</MenuItem>
              <MenuItem value={80}>Approved by AD or DD</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      <Stack direction='row' mb={10}>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '10px' }} onClick={handleReset}>Reset</Button>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px' }}>Search</Button>
      </Stack>

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
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsLoan.length != 0 ? (rowsLoan.map((row) => (
              <TableRow
                key={row.reqID}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell size="small" component="th" scope="row">
                  {row.reqID}
                </TableCell>
                <TableCell size="small" align="left" padding="normal">{row.cat}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.brand}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.model}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.reqQty}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.reqDate}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.reqStaff}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.status}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.procDate}</TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={9}>No data available</TableCell>

              </TableRow>
            )
            }
          </TableBody>
        </Table>
      </TableContainer>
      <br></br>
      <br></br>
    </div>

  )
}

export default ProcessedLoanExtReq