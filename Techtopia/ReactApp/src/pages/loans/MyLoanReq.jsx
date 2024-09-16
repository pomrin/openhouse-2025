import { React, useState, useEffect } from 'react';
import { Typography, Stack, Pagination, } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { tokenValue, decodedToken } from '../../constants'
import http from '../http'
import global from '../../global';
import dayjs from 'dayjs';

// contexts and components
import { useLoader } from '../../contexts/LoaderContext'

function MyLoanReq() {
  const { setLoading } = useLoader();
  const [loanReqList, setLoanReqList] = useState([]); // list of loan requests 
  const [modelList, setModelList] = useState([]); // list of model 
  const [catList, setCatList] = useState([]); // list of categories  
  const [brandList, setBrandList] = useState([]); // list of brands

  // pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [page2, setPage2] = useState(1);
  const [perPage2, setPerPage2] = useState(8);

  const handleChangePage = (newPage) => { setPage(newPage); };
  const handleChangePage2 = (newPage2) => { setPage2(newPage2); };

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const startIndex2 = (page2 - 1) * perPage2;
  const endIndex2 = startIndex2 + perPage2;

  // get list of request using staff loginName
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [loanListRes, modelListRes, catListRes, brandListRes] = await Promise.all([
        http.get(`/StaffLoanRequest?userName=${decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]}`),
        http.get(`/ItemModel`),
        http.get(`/ItemCategory`),
        http.get(`/ItemBrand`),
      ]);

      setLoanReqList(loanListRes.data);
      setModelList(modelListRes.data);
      setCatList(catListRes.data);
      setBrandList(brandListRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // find brand name, model name, cat name
  console.log(brandList, modelList, catList)
  const findModel = (Id) => { if (!modelList) return '-'; const model = modelList.find((m) => m.modelId === Id); return model ? model.modelName : '-'; }
  const findCat = (Id) => { if (!catList) return '-'; const cat = catList.find((c) => c.catId === Id); return cat ? cat.catName : '-'; }
  const findBrand = (Id) => { if (!brandList) return '-'; const brand = brandList.find((b) => b.brandId === Id); return brand ? brand.brandName : '-'; }

  //filtering 
  const pendingReq = loanReqList.filter((data) => data.status === 0)
  const otherReq = loanReqList.filter((data) => data.status !== 0)

  return (
    <div>
      <h2>SIT Asset Management System</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3 mb={2}>My loan requests</h3>
      <Typography mb={1}>Below are your pending loan request(s), Total : {pendingReq.length}</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ whiteSpace: 'nowrap' }}>
            <TableRow sx={{ backgroundColor: '#5D7B9D' }}>
              <TableCell sx={{ color: 'white' }}><b>Loan request ID</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Category</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Brand</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Model</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Quantity Requested</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Date Requested</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Status</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingReq.length != 0 ? (pendingReq.slice(startIndex, endIndex).map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell size="small" component="th" scope="row">
                  {global.addZeros(row.loanRequestId)}
                </TableCell>
                <TableCell size="small" align="left" padding="normal">{findCat(row.catId) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{findBrand(row.brandId) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{findModel(row.modelId) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.quantity || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{dayjs(row.dateRequest).format(global.datetimeFormat) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{global.statusChecker(row.status) || '-'}</TableCell>
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
      {/* Pagination */}
      <Stack direction='row' justifyContent='center' mt={3}>
        <Pagination
          count={Math.ceil(pendingReq.length / perPage)}
          page={page}
          onChange={(event, newPage) => handleChangePage(newPage)}
          color="primary"
          variant="outlined"
          shape="rounded"
        />
      </Stack>
      <br></br>
      <Typography mb={1}>Below are your previous loan request(s), Total : {otherReq.length}</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ whiteSpace: 'nowrap' }}>
            <TableRow sx={{ backgroundColor: '#5D7B9D' }}>
              <TableCell sx={{ color: 'white' }}><b>Loan request ID</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Category</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Brand</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Model</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Quantity Requested</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Date Requested</b></TableCell>
              <TableCell sx={{ color: 'white' }}><b>Status</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {otherReq.length != 0 ? (otherReq.slice(startIndex2, endIndex2).map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell size="small" component="th" scope="row">
                  {global.addZeros(row.loanRequestId)}
                </TableCell>
                <TableCell size="small" align="left" padding="normal">{findCat(row.catId) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{findBrand(row.brandId) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{findModel(row.modelId) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.quantity || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{dayjs(row.dateRequest).format(global.datetimeFormat) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{global.statusChecker(row.status)}</TableCell>
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
      {/* Pagination */}
      <Stack direction='row' justifyContent='center' mt={3}>
        <Pagination
          count={Math.ceil(otherReq.length / perPage2)}
          page={page2}
          onChange={(event, newPage2) => handleChangePage2(newPage2)}
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

export default MyLoanReq