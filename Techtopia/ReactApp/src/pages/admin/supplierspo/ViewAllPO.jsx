import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Input, Card, IconButton, Typography, Stack, Button } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const SupplierCo = ['A', 'B', 'C', 'D'];

function populateRows(reqID, cat, brand, model, reqQty, reqDate, reqStaff, status, procDate) {
  return { reqID, cat, brand, model, reqQty, reqDate, reqStaff, status, procDate };
}

const rowsLoan = [
  populateRows('000029', 'Cable', 'N/A', 'N/A', '1', '01/11/2023 9:40AM', 'CAI RONNIE', 'New', '01/11/2023 9:40AM	'),
  populateRows('000030', 'Cable', 'N/A', 'N/A', '1', '11/10/2023 9:40AM', 'CAI RONNIE', 'New', '01/11/2023 9:40AM	'),
  populateRows('000031', 'Cable', 'N/A', 'N/A', '1', '3/11/2023 9:40AM', 'CAI RONNIE', 'New', '01/11/2023 9:40AM	'),
  populateRows('000032', 'Cable', 'N/A', 'N/A', '1', '01/11/2023 9:40AM', 'CAI RONNIE', 'New', '01/11/2023 9:40AM	'),
];

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

function ViewAllPO() {
  const [requestDate, setRequestDate] = useState('');
  const [processedDate, setProcessedDate] = useState('');
  const [inputField, setInputField] = useState("");

  const [co, setCo] = useState("None");
  const handleCo = (event) => { setCo(event.target.value); }

  const handleReset = () => {
    setInputField('');
    setActiveItem(null);
    setRequestDate(null);
    setProcessedDate(null);
  }

  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
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
          <Typography mb={1}>PO Date From</Typography>
          <DatePicker selected={requestDate} default={''} onChange={(date) => setRequestDate(date)} />
        </Stack>
        <Stack style={{ marginLeft: '10px', marginRight: '30px' }}>
          <Typography mb={1}>PO Date To</Typography>
          <DatePicker selected={processedDate} onChange={(date) => setProcessedDate(date)} />
        </Stack>
      </Stack>
      <Stack direction='row' mb={6}>
        <Stack>
          <Typography mb={0.5}>Supplier company</Typography>
          <FormControl sx={{ minWidth: 240, minHeight: 40, marginRight: '30px' }} size="small">
            <Select id="demo-select-small" value={co} onChange={handleCo} >
              <MenuItem value="None">
                <div style={{ color: 'grey', opacity: '70%' }}>Select company</div>
              </MenuItem>
              {SupplierCo.map((co, index) => (
                <MenuItem key={index} value={co}>{co}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack mt={3} direction={'row'}>
            <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '10px' }} onClick={handleReset}>Reset</Button>
            <Button sx={{ ...otherButtonStyles, fontSize: '12px' }}>Search</Button>
          </Stack>
        </Stack>
      </Stack>

      <h5>Total POs : 4</h5>
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

export default ViewAllPO