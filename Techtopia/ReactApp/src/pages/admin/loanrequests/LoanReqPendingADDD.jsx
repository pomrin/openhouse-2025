import { React, useEffect, useState } from 'react'
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import http from '../../http'
import { tokenValue, decodedToken } from "../../../constants"
import AlertDialog from '../../utilities/DialogComponent';
import { useToastify } from '../../../contexts/ToastifyContext';
import { useLoader } from '../../../contexts/LoaderContext';

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
  const { loading } = useLoader();

  const [open, setOpen] = useState("");
  const [openDialog, setOpenDialog] = useState(false)
  const [returnMessage, setReturnMessage] = useState("-"); // return reason message
  const [reservedItems, setReservedItems] = useState([]);

  const [reason, setReason] = useState("");

  const handleOpen = () => {
    console.log("Element: ", element);
    element.loanRequestAssets.forEach(e => {
      http.get(`/AssetItemSearch?ItemId=${e.assetId}`)
        .then((res) => {
          setReservedItems(prevItems => [...prevItems, res.data]);
        })
        .catch((error) => {
          console.error('Error fetching asset item:', error);
        });
    });

    setOpen(true);
  };

  const handleClose = () => {
    setReservedItems([]);
    setOpen(false);
  };

  const handleApprove = () => {
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
        setText("Successfully approved")
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
      <AlertDialog titleMessage={"Reject request for Loan ID: " + ""} open={openDialog} setOpen={setOpenDialog} setReturnMessage={setReturnMessage} handleReject={handleReject} reason={reason} setReason={setReason}></AlertDialog>
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
          <Typography>Loan Request ID: {element.loanRequestId}</Typography>
        </DialogTitle>
        <DialogContent>
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
            <Grid item xs={4}>
              <Typography fontWeight='bold'>Item Requested: </Typography>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align='center'>Loading... </TableCell>
                  </TableRow>
                ) : (reservedItems.map((itemrow, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: '#fff', }}
                  >
                    <TableCell size="small" component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell size="small" align="left" padding="normal">{itemrow[0].categoryName || '-'}</TableCell>
                    <TableCell size="small" align="left" padding="normal">{itemrow[0].modelName || itemrow.modelId}</TableCell>
                    <TableCell size="small" align="left" padding="normal">{itemrow[0].brandName || '-'}</TableCell>
                    <TableCell size="small" align="left" padding="normal">{itemrow[0].rfid || '-'}</TableCell>
                    <TableCell size="small" align="left" padding="normal">{itemrow[0].serialNumber || '-'}</TableCell>
                    <TableCell size="small" align="left" padding="normal">{itemrow[0].assetNumber || '-'}</TableCell>
                    <TableCell size="small" align="left" padding="normal">{itemrow[0].itemDescription || '-'}</TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <Button varient='contained' sx={{ ...rejectButtonStyles }} onClick={() => setOpenDialog(true)}>
            Reject Request
          </Button>
          <Button varient='contained' sx={{ ...otherButtonStyles, marginRight: '10px' }} onClick={handleApprove}>
            Approve Request
          </Button>
        </DialogActions>
      </Dialog >
    </>
  );
}

function LoanReqPendingADDD() {
  const { loading, setLoading } = useLoader();
  const [loanReqs, setLoanReqs] = useState([]);
  const token = tokenValue

  const filteredNewExtList = [];

  const fetchData = async () => {
    setLoading(true);
    const [loanRes] = await Promise.all([
      http.get(`/LoanRequestByLoanStatus?loanRequestStatus=3`),
    ]);
    setLoanReqs(loanRes.data);
    console.log("Loan Request: ", loanRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

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
      <h2>SIT Asset Management System</h2>
      <hr style={{ border: '1px solid' }}></hr>
      <h3 style={{ marginTop: '30px' }}>Manage new loan requests (pending approval by <span style={{ color: 'green' }}>AD/DD</span>)</h3>
      <h5 style={{ margin: '0px 0px 10px 0px' }} >Total new loan requests: {loanReqs.length}</h5>

      <div style={{ width: '100%', backgroundColor: 'white' }} >
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
          sx={{ height: 371 }} // remove white space
        />
      </div>

      <h5 style={{ margin: '20px 0px 10px 0px' }} >Total new loan extension requests: {filteredNewExtList.length}</h5>
      <div style={{ width: '100%', backgroundColor: 'white' }} >
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
          sx={{ height: 371 }} // remove white space
        />
      </div>
    </div>
  )
}


export default LoanReqPendingADDD