import { React, useEffect, useState } from 'react'
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Card } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import http from '../../http'
import { tokenValue } from "../../../constants"
import AlertDialog from '../../utilities/DialogComponent';
import { useToastify } from '../../../contexts/ToastifyContext';
import { useLoader } from '../../../contexts/LoaderContext';
import { format, parseISO } from 'date-fns';

const otherButtonStyles = {
  width: 'auto',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}

const rejectButtonStyles = {
  width: 'auto',
  backgroundColor: '#ff475d',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#f0003c',
    color: '#fff',
  }
}

function RenderButton(props) { // Button to view loan request details
  const { element, fetchData } = props;
  const { setStatus, setText, statusList } = useToastify();
  const { setLoading } = useLoader();

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState("");
  const [openDialog, setOpenDialog] = useState(false)
  const [returnMessage, setReturnMessage] = useState("-"); // return reason message
  const [availableItems, setAvailableItems] = useState([]);
  const [reservedItems, setReservedItems] = useState([]);

  const [reason, setReason] = useState("");

  const handleOpen = () => {
    console.log("Element: ", element);
    setLoading(true)
    element.loanRequestDetails.forEach(element => {
      http
        .get(`/AssetItemSearch?CatId=${element.categoryId}&ModelId=${element.modelId}&AssetItemLoanable=1`)
        .then((res) => {
          console.log("List of items: ", res.data);
          setAvailableItems(prevItems => [...prevItems, ...res.data])
          console.log('Items available', availableItems.length)
        });
    });
    setLoading(false);
    setOpen(true);
  };

  const handleClose = () => {
    setPage(1)
    setAvailableItems([]);
    setReservedItems([]);
    setOpen(false);
  };

  const handleReserve = (itemSelected) => { // Reserve items selected
    element.loanRequestDetails.forEach(item => {
      if (itemSelected.catId === item.categoryId && itemSelected.modelId === item.modelId) {
        console.log(item.quantity)
        const checker = reservedItems.filter(i => i.catId === itemSelected.catId && i.modelId === itemSelected.modelId);
        console.log("Checker:", checker.length)
        if (checker.length >= item.quantity) {
          setStatus(statusList[2]);
          setText("Maximum items loanable");
        } else {
          setReservedItems(prevItems => [...prevItems, itemSelected]);

          setAvailableItems(prevItems =>
            prevItems.filter(availableItem => availableItem.itemId !== itemSelected.itemId)
          );
        }
      }
    });
  };

  const handleRemove = (item) => {
    setAvailableItems(prevItems => [...prevItems, item])

    setReservedItems(prevItems =>
      prevItems.filter(availableItem => availableItem.itemId !== item.itemId));
  };

  const handleCheck = () => {
    let hasIssues = false;

    element.loanRequestDetails.forEach(loanItem => {
      const reservedCount = reservedItems.filter(
        i => i.categoryId === loanItem.catId && i.modelId === loanItem.modelId
      ).length;

      if (reservedCount !== loanItem.quantity) {
        setText("Select items first");
        setStatus(statusList[2]);
        hasIssues = true;
      }
    });

    if (!hasIssues) {
      setPage(3);
    }
  };

  const handleRouteTSOMgr = () => {
    const loanRequestId = element.loanRequestId
    const assetIds = reservedItems.map(item => item.itemId)
    const reqBody = {
      loanRequestId: loanRequestId,
      assetItemsId: assetIds,
    }
    console.log(reqBody)
    http.post(`/LoanRequestApprove`,
      reqBody)
      .then(res => {
        console.log(res);
        handleClose();
        setText("Successfully routed to TSO Manager")
        setStatus(statusList[0])
        fetchData();
      })
      .catch(err => {
        console.log(err.response.data);
        setText("Something went wrong");
        setStatus(statusList[2]);
      })
  };

  const handleReject = () => {
    const loanReqId = element.loanRequestId
    const returnMsg = returnMessage ? returnMessage : "None";
    http.post(`/LoanRequestReject`,
      {
        loanRequestId: loanReqId,
        respondMessage: returnMsg
      })
      .then(res => {
        handleClose();
        setOpenDialog(false);
        setReturnMessage("");
        setReason("");
        setStatus(statusList[0])
        setText("Succesfully returned")
        fetchData();
      })
      .catch(err => {
        console.log(err);
        setReturnMessage("");
        setReason('')
        setStatus(statusList[2])
        setText("Something went wrong");
      })
  };

  return (
    <>
      <AlertDialog titleMessage={"Reject request for Loan ID: " + element.loanRequestId} open={openDialog} setOpen={setOpenDialog} setReturnMessage={setReturnMessage} handleReject={handleReject} reason={reason} setReason={setReason}></AlertDialog>
      <Button
        variant="contained"
        size="small"
        style={{ backgroundColor: '#6CA0DC' }}
        onClick={() => handleOpen()}
      >
        View Request
      </Button>
      {/* Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Grid container>
            <Grid item xs={4}>
              <Typography>Loan Request ID: {element.loanRequestId}</Typography>
            </Grid>
            <Grid item xs={8} align={'right'}>
              {(page === 2 || page === 3) && (
                <Button variant="contained" sx={{ backgroundColor: 'gray' }} onClick={() => setPage(1)}>
                  Previous
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogTitle>
        {/* Page 1 */}
        {(page === 1) && (
          <>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography
                    sx={{ border: '1px solid gray', padding: '8px', cursor: 'pointer', backgroundColor: '#5D7B9D', color: 'white' }}
                    textAlign='center'
                    onClick={() => setPage(1)}>
                    Loan Request Details
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    sx={{ border: '1px solid gray', padding: '8px', cursor: 'pointer' }}
                    textAlign='center'
                    onClick={() => setPage(2)}>
                    Item reservation page
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    sx={{ border: '1px solid gray', padding: '8px', cursor: 'pointer' }}
                    textAlign="center"
                    onClick={() => handleCheck()}
                  >
                    Loan request finalization
                  </Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ marginTop: '10px' }}>
                <Grid item xs={4}>
                  <Typography fontWeight="bold" justifyContent={'center'} >List of items: </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Box
                    sx={{
                    }}>
                    {element.loanRequestDetails.map((item, index) => {
                      return (
                        <Card key={index} sx={{ padding: '10px', marginBottom: "10px", border: '1px solid #D3D3D3' }}>
                          <Typography><span style={{ fontWeight: 'bold' }}>Brand: </span>{item.brandName}</Typography>
                          <Typography><span style={{ fontWeight: 'bold' }}>Model: </span>{item.modelName}</Typography>
                          <Typography><span style={{ fontWeight: 'bold' }}>Quantity: </span> {item.quantity}</Typography>
                          <Typography><span style={{ fontWeight: 'bold' }}>Purpose: </span>{item.comments}</Typography>
                        </Card>
                      );
                    })}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <hr style={{ border: '1px solid', color: '#D3D3D3' }}></hr>
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight='bold'>Requested By: </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{element.requestStaffName}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <hr style={{ border: '1px solid', color: '#D3D3D3' }}></hr>
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight='bold'>Requested From: </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{element.requestFromDate}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <hr style={{ border: '1px solid', color: '#D3D3D3' }}></hr>
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight='bold'>Requested To: </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{element.requestToDate}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <hr style={{ border: '1px solid', color: '#D3D3D3' }}></hr>
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight='bold'>Date of the request submitted:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{format(parseISO(element.dateRequest), "yyyy-MM-dd, hh:mm a")}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions style={{ justifyContent: "space-between" }}>
              <Button varient='contained' sx={{ ...rejectButtonStyles }} onClick={() => setOpenDialog(true)}>
                Reject Request
              </Button>
              <Button variant="contained" sx={{ backgroundColor: 'gray' }} onClick={() => setPage(2)}>
                Proceed to item reservation
              </Button>
            </DialogActions>
          </>
        )};
        {/* Page 2 */}
        {(page === 2) && (
          <>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography
                    sx={{ border: '1px solid black', padding: '8px', cursor: 'pointer' }}
                    textAlign='center'
                    onClick={() => setPage(1)}>
                    Loan Request Details
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    sx={{ border: '1px solid black', padding: '8px', cursor: 'pointer', backgroundColor: '#5D7B9D', color: 'white' }}
                    textAlign='center'
                    onClick={() => setPage(2)}>
                    Item reservation page
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    sx={{ border: '1px solid black', padding: '8px', cursor: 'pointer' }}
                    textAlign="center"
                    onClick={() => handleCheck()}
                  >
                    Loan request finalization
                  </Typography>
                </Grid>
              </Grid>
              <Typography sx={{ marginTop: '10px' }}><b>Available Items: {availableItems.length}</b></Typography>
              <TableContainer sx={{ maxHeight: 215 }} component={Paper} >
                <Table stickyHeader aria-label="simple table">
                  <TableHead sx={{ whiteSpace: 'nowrap' }} >
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>S/N</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Category</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Brand</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Model</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>RFID</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Serial No</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Asset No</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Description</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableItems.length > 0 ? (
                      availableItems.map((element, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: '#fff' }}
                        >
                          <TableCell size="small" component="th" scope="row">
                            {index + 1} {/* Use itemIndex instead of undefined index */}
                          </TableCell>
                          <TableCell size="small" align="left" padding="normal">{element.categoryName || '-'}</TableCell>
                          <TableCell size="small" align="left" padding="normal">{element.modelName || '-'}</TableCell>
                          <TableCell size="small" align="left" padding="normal">{element.brandName || '-'}</TableCell>
                          <TableCell size="small" align="left" padding="normal">{element.rfid || '-'}</TableCell>
                          <TableCell size="small" align="left" padding="normal">{element.serialNumber || '-'}</TableCell>
                          <TableCell size="small" align="left" padding="normal">{element.assetNumber || '-'}</TableCell>
                          <TableCell size="small" align="left" padding="normal">{element.itemDescription || '-'}</TableCell>
                          <TableCell sx={{ '&:hover': { color: '#d3d3d3', cursor: 'pointer' } }} onClick={() => handleReserve(element)} size="small" align="left" padding="normal">
                            <Typography variant='h8'><b>Reserve</b></Typography>
                          </TableCell>
                        </TableRow>)
                      )
                    ) : (
                      <TableRow>
                        <TableCell align="center" colSpan={9}>No data available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography sx={{ marginTop: '10px' }}><b>Items Selected: {reservedItems.length}</b></Typography>
              <TableContainer sx={{ maxHeight: 215 }} component={Paper} >
                <Table stickyHeader aria-label="simple table">
                  <TableHead sx={{ whiteSpace: 'nowrap' }} >
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>S/N</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Category</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Brand</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Model</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>RFID</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Serial No</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Asset No</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Description</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reservedItems.length != 0 ? (reservedItems.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: '#fff', }}
                      >
                        <TableCell size="small" component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell size="small" align="left" padding="normal">{item.categoryName || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{item.modelName || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{item.brandName || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{item.rfid || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{item.serialNumber || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{item.assetNumber || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{item.itemDescription || '-'}</TableCell>
                        <TableCell sx={{ '&:hover': { color: '#57000a', cursor: 'pointer' } }} onClick={() => handleRemove(item)} size="small" align="left" padding="normal">
                          <Typography variant='h8' color='#910112'><b>Remove</b></Typography>
                        </TableCell>
                      </TableRow>
                    ))
                    ) : (
                      <TableRow>
                        <TableCell align="center" colSpan={9}>Select Items to reserve</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions style={{ justifyContent: "space-between" }}>
              <Button varient='contained' sx={{ ...rejectButtonStyles }} onClick={() => setOpenDialog(true)}>
                Reject Request
              </Button>
              <Button variant="contained" sx={{ backgroundColor: 'gray' }} onClick={handleCheck}>
                Next
              </Button>
            </DialogActions>
          </>
        )}
        {/* Page 3 */}
        {(page === 3) && (
          <>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography
                    sx={{ border: '1px solid black', padding: '8px', cursor: 'pointer' }}
                    textAlign='center'
                    onClick={() => setPage(1)}>
                    Loan Request Details
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    sx={{ border: '1px solid black', padding: '8px', cursor: 'pointer' }}
                    textAlign='center'
                    onClick={() => setPage(2)}>
                    Item reservation page
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    sx={{ border: '1px solid black', padding: '8px', cursor: 'pointer', backgroundColor: '#5D7B9D', color: 'white' }}
                    textAlign="center"
                    onClick={() => handleCheck()}
                  >
                    Loan request finalization
                  </Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ marginTop: '10px' }}>
                <Grid item xs={4}>
                  <Typography fontWeight='bold'>Requested By: </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{element.requestStaffName}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <hr style={{ border: '1px solid', color: '#D3D3D3' }}></hr>
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight='bold'>Loan Request ID: </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{element.loanRequestId}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <hr style={{ border: '1px solid', color: '#D3D3D3' }}></hr>
                </Grid>
              </Grid>
              <TableContainer sx={{ maxHeight: 215 }} component={Paper} >
                <Table stickyHeader sx={{ backgroundColor: '#5D7B9D' }} aria-label="simple table">
                  <TableHead sx={{ whiteSpace: 'nowrap' }} >
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>S/N</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Category</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Brand</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Model</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>RFID</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Serial No</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Asset No</b></TableCell>
                      <TableCell sx={{ backgroundColor: '#5D7B9D', color: 'white' }}><b>Description</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ backgroundColor: '#fff', }}>
                    {reservedItems.length != 0 ? (reservedItems.map((itemrow, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: '#fff', }}
                      >
                        <TableCell size="small" component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell size="small" align="left" padding="normal">{itemrow.categoryName || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{itemrow.modelName || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{itemrow.brandName || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{itemrow.rfid || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{itemrow.serialNumber || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{itemrow.assetNumber || '-'}</TableCell>
                        <TableCell size="small" align="left" padding="normal">{itemrow.itemDescription || '-'}</TableCell>
                      </TableRow>
                    ))
                    ) : (
                      <TableRow>
                        <TableCell align="center" colSpan={9}>Select items to reserve</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions style={{ justifyContent: "space-between" }}>
              <Button varient='contained' sx={{ ...rejectButtonStyles }} onClick={() => setOpenDialog(true)}>
                Reject Request
              </Button>
              <Button varient='contained' sx={{ ...otherButtonStyles, marginRight: '10px' }} onClick={handleRouteTSOMgr}>
                Route to TSO Manager
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog >
    </>
  );
}

function NewIncomingReq() {
  const { loading, setLoading } = useLoader();
  const [loanReqs, setLoanReqs] = useState([]);
  const token = tokenValue

  const [categroyList, setCategoryList] = useState([]);
  const [modelList, setModelList] = useState([]);

  const filteredNewExtList = [];

  const fetchData = async () => {
    setLoading(true);
    const [loanRes] = await Promise.all([
      http.get(`/LoanRequestByLoanStatus?loanRequestStatus=0`),
    ]);
    setLoanReqs(loanRes.data);
    console.log("Loan Request: ", loanRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchItemData = async () => {
    setLoading(true);
    const [catRes, modelRes] = await Promise.all([
      http.get(`/ItemCategory`),
      http.get("/ItemModel"),
    ]);
    setCategoryList(catRes.data);
    setModelList(modelRes.data);
    setLoading(false);
  }

  //data grid for new incoming requests
  const columnsIncomingRequests = [
    { field: 'id', headerName: 'S/N', width: 90, headerAlign: 'center', align: "center" },
    { field: 'requestId', headerName: 'Loan Request ID', width: 150 },
    { field: 'date', headerName: 'Date', width: 250 },
    { field: 'staff', headerName: 'By Who', width: 250 },
    {
      field: 'action',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <RenderButton
          element={params.row.element}
          categroyList={categroyList}
          modelList={modelList}
          fetchData={fetchData}
        />
      ),
    },
  ];

  const rowsIncomingRequests = loanReqs.map((element, index) => ({
    id: index + 1,
    requestId: element.loanRequestId,
    date: element.requestFromDate,
    staff: element.requestStaffName,
    element: element
  }));

  //data grid for new incoming extension requests
  const columnsIncomingRequestsExt = [
    { field: 'id', headerName: 'S/N', width: 90, headerAlign: 'center', align: "center" },
    { field: 'requestId', headerName: 'Loan Request ID', width: 150 },
    { field: 'date', headerName: 'Date', width: 250 },
    { field: 'staff', headerName: 'By Who', width: 250 },
    {
      field: 'action',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <RenderButton
          element={params.row.element}
        />
      ),
    },
  ];

  const rowsIncomingRequestsExt = filteredNewExtList.map((element, index) => ({
    id: index + 1,
    requestId: element.loanRequestId,
    date: element.requestFromDate,
    staff: element.requestStaffName,
    element: element
  }));

  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid' }}></hr>
      <h3 style={{ marginTop: '30px' }}>Manage new loan requests</h3>
      <h5 style={{ margin: '0px 0px 10px 0px' }} >Total new loan requests: {loanReqs.length}</h5>

      <div style={{ width: '100%', backgroundColor: 'white' }}>
        <DataGrid
          rows={rowsIncomingRequests}
          columns={columnsIncomingRequests}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          sx={{ height: 371 }}
        />
      </div>

      <h5 style={{ margin: '20px 0px 10px 0px' }} >Total new loan extension requests: {filteredNewExtList.length}</h5>
      <div style={{ width: '100%', backgroundColor: 'white', marginBottom: '50px' }}>
        <DataGrid
          rows={rowsIncomingRequestsExt}
          columns={columnsIncomingRequestsExt}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          sx={{ height: 371 }}
        />
      </div>
    </div>
  )
}


export default NewIncomingReq