import { React, useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Stack, Pagination, Paper } from '@mui/material'
import http from '../../http'
import { tokenValue } from "../../../constants"

function ItemsPendingCollection() {
  const token = tokenValue

  const [itemList, setItemList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  useEffect(() => {
    const fetchData = async () => {
      const [itemListRes, staffListRes, catListRes] = await Promise.all([
        http.get(`/AssetItemSearch?&ItemLoanStatus=0`),
        http.get(`/Staff`),
        http.get(`/ItemCategory`)
      ]);

      setItemList(itemListRes.data);
      setStaffList(staffListRes.data);
      setCatList(catListRes.data);
    };
    fetchData();
  }, []);

  const findStaff = (id) => { const staff = staffList.find((staff) => staff.staffId === id); return staff.staffName };
  const findCat = (id) => { const cat = catList.find((cat) => cat.catId === id); return cat.catName };

  const sortedItemList = itemList.sort((a, b) => findCat(a.catId).localeCompare(findCat(b.catId)));

  return (
    <div>
      <h2>SIT Asset Management System</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3>Items Pending Collection</h3>
      <h5 style={{ opacity: '70%', color: 'grey' }}>The following are item(s) pending collection</h5>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ whiteSpace: 'nowrap', }}>
            <TableRow sx={{ backgroundColor: '#5D7B9D' }}>
              <TableCell sx={{ color: 'white', fontSize: '12px' }}><b>S/N</b></TableCell>
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
                <TableCell size="small" align="left" padding="normal">{findCat(row.catId) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.brandName || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.modelName || '-'}</TableCell>
                <TableCell className="stubbornRow" size="small" align="left" padding="normal">{row.serialNumber || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.assetNumber || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.itemDescription || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.rfid || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.assignedTo || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{findStaff(row.lastUpdatedBy) || '-'}</TableCell>
                <TableCell size="small" align="left" padding="normal">{row.lastUpdatedDateTime || '-'}</TableCell>
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
      <br />
      <br />
    </div>

  )
}

export default ItemsPendingCollection