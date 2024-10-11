import React, { useEffect, useState } from 'react';
import { Button, Typography, Step, Stepper, StepLabel, Box, Stack, TextField } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import http from '../http';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { tokenValue } from "../../constants";
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { format } from 'date-fns';

// context and compoments
import { useLoader } from '../../contexts/LoaderContext';
import { useUtil } from '../../contexts/UtilContext';
import { useToastify } from '../../contexts/ToastifyContext';
import Loader from '../../components/Loader';

//icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


function RenderButton(props) {
    const { itemCategory, itemModel, comment, modelList, categoryList, fetchData, loanReceipt } = props;
    const { statusList } = useToastify();
    const [loanReceiptItem] = loanReceipt;
    const [modelData, setModalData] = useState(0);
    const token = tokenValue;

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleDeleteOpen = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleEditOpen = () => {
        http
            .get('/AssetItemSearch', {
                params: {
                    ModelId: loanReceiptItem.modelId,
                    AssetItemLoanable: 1
                }
            })
            .then((res) => {
                setModalData(res.data.length);
                console.log("Model List:", modelData);
            })
            .catch((err) => { console.error(err) })
        setEditDialogOpen(true);
        console.log("Item: ", loanReceiptItem)
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
    };

    const handleDelete = () => {
        let updatedComment;
        const itemCategoryId = categoryList.find(c => c.catName === itemCategory).catId;
        const itemModelID = modelList.find(m => m.modelName === itemModel || m.modelId === itemModel).modelId;
        if (comment === "No comment") {
            updatedComment = null;
        }
        http
            .put(`/LoanRequestCart?itemCategoryId=${itemCategoryId}&itemModelID=${itemModelID}&quantity=0&comment=${updatedComment}`)
            .then((res) => {
                console.log(res.data);
                handleDeleteClose();
                fetchData(statusList[0], "Successfully Deleted Item");
            })
            .catch((err) => console.error(err));
    };

    const handleEdit = () => {
        formik.handleSubmit();
    }

    const formik = useFormik({
        initialValues: {
            itemCategoryId: loanReceiptItem.categoryId,
            itemModelID: loanReceiptItem.modelId,
            quantity: loanReceiptItem.quantity,
            comment: loanReceiptItem.comment,
        },
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            quantity: yup.number("Quantity must be a number.").min(1, "Quantity cannot be less than 1").max(modelData.toString(), `Quantity cannot be more than ${modelData.toString()}`).required(),
            comment: yup.string().required(),
        }),
        onSubmit: (data) => {
            console.log(data);

            http
                .put(`/LoanRequestCart?itemCategoryId=${data.itemCategoryId}&itemModelID=${data.itemModelID}&quantity=${data.quantity}&comment=${data.comment}`)
                .then((res) => {
                    console.log(res.data);
                    handleEditClose();
                    fetchData(statusList[0], "Successfully Edited Item");
                })
                .catch((err) => console.error(err));
        }
    })

    return (
        <>
            <Button
                variant="contained"
                size="small"
                style={{ backgroundColor: '#6CA0DC' }}
                onClick={handleEditOpen}
            >
                <EditIcon />
            </Button>

            <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 15, backgroundColor: '#C70000' }}
                onClick={handleDeleteOpen}
            >
                <DeleteIcon />
            </Button>

            <Dialog open={editDialogOpen} onClose={handleEditClose} component="form" onSubmit={formik.handleSubmit}>
                <DialogTitle>Editing Item</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Stack spacing={1}>
                            <Typography>
                                Edit Quantity:
                            </Typography>
                            <TextField
                                type="number"
                                name="quantity"
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                                helperText={formik.touched.quantity && formik.errors.quantity}
                                inputProps={{ min: 1, max: modelData }}
                            />
                        </Stack>
                        <Stack spacing={1} sx={{ marginTop: "5px" }}>
                            <Typography>
                                Edit Comment:
                            </Typography>
                            <TextField
                                type="text"
                                name="comment"
                                value={formik.values.comment}
                                onChange={formik.handleChange}
                                error={formik.touched.comment && Boolean(formik.errors.comment)}
                                helperText={formik.touched.comment && formik.errors.comment}
                            />
                        </Stack>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleEditClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="success" onClick={handleEdit}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
                <DialogTitle>Delete Item</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleDeleteClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const CustomLoadingOverlay = () => (
    <GridOverlay>
        <CircularProgress sx={{}} />
    </GridOverlay>
);

function LoanReceipt() {
    const navigate = useNavigate();
    const { setStatus, setText, statusList } = useToastify();
    const { loading, setLoading } = useLoader();
    const { steps } = useUtil();

    const [loanReceipt, setLoanReceipt] = useState([]);
    const [modelList, setModelList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    const token = tokenValue;

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // get cart, model, and category
    const fetchData = async () => {
        try {
            setLoading(true);
            const [loanRes, modelRes, categoryRes] = await Promise.all([
                http.get("/LoanRequestCart"),
                http.get("/ItemModel"),
                http.get("/ItemCategory")
            ]);
            setLoanReceipt(loanRes.data);
            setModelList(modelRes.data);
            setCategoryList(categoryRes.data);

            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    // cart data for later
    const fetchCartData = async (status, text) => {
        http
            .get("/LoanRequestCart")
            .then((res) => setLoanReceipt(res.data))
            .catch((err) => console.log(err));

        if (status && text) {
            setStatus(status);
            setText(text);
            setTimeout(() => {
                setText("");
                setStatus("");
            }, 100);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center', align: "center" },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'model', headerName: 'Model', width: 150 },
        { field: 'quantity', headerName: 'Quantity', width: 100 },
        { field: 'comment', headerName: 'Comments', width: 350 },
        {
            field: 'action',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <RenderButton
                    itemCategory={params.row.category}
                    itemModel={params.row.model}
                    comment={params.row.comment}
                    modelList={modelList}
                    categoryList={categoryList}
                    loanReceipt={loanReceipt}
                    fetchData={fetchCartData}
                />
            ),
        },
    ];

    const rows = loanReceipt.map((element, index) => ({
        id: index + 1,
        category: categoryList.find(c => c.catId === element.categoryId).catName,
        model: modelList.find(m => m.modelId === element.modelId).modelName || element.modelId,
        quantity: element.quantity,
        comment: element.comment || "No comment"
    }));

    const todayDate = new Date();
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);

    const formik = useFormik({
        initialValues: {
            startDate: "",
            endDate: "",
        },
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            startDate: yup.date().min(yesterdayDate, "Start Date cannot be before today").required("Start Date cannot be empty"),
            endDate: yup.date().min(yup.ref('startDate'), "End Date cannot be before Start Date.").required("End Date cannot be empty")
        }),
        onSubmit: (data) => {
            const listLoanRequestDetail = loanReceipt.map(item => {
                return {
                    catId: item.categoryId,
                    modelId: item.modelId,
                    quantity: item.quantity,
                    purpose: item.comment,
                }
            })

            const formattedStartDate = format(new Date(data.startDate), 'yyyy-MM-dd');
            const formattedEndDate = format(new Date(data.endDate), 'yyyy-MM-dd');

            const values = {
                listLoanRequestDetail: listLoanRequestDetail,
                requestFromDate: formattedStartDate,
                requestToDate: formattedEndDate
            }
            console.log(values);

            http
                .post("/StaffLoanRequest", values)
                .then(() => {
                    loanReceipt.forEach(item => {
                        http
                            .put(`/LoanRequestCart?itemCategoryId=${item.categoryId}&itemModelID=${item.modelId}&quantity=0&comment=${item.comment}`)
                    })
                    setStatus(statusList[0]);
                    setText("Loan Request has been submitted")
                    navigate("/MyLoanReq");
                    setTimeout(() => {
                        setText("");
                        setStatus("");
                    }, 100);
                })
                .catch((err) => {
                    console.error('Error:', err.response ? err.response.data : err.message);
                });

        }
    });

    return (
        <>
            <h2>NYP-SIT OH2025</h2>
            <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
            {/* Stepper */}
            <Stepper activeStep={1} alternativeLabel style={{ display: 'flex', flexDirection: 'row', marginBottom: "50px" }} >
                {steps.map((step) => (
                    <Step key={step}>
                        <StepLabel>{step}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Typography variant="h5">Your Loan Request</Typography>
            <div style={{ width: '100%', backgroundColor: 'white' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    sx={{ height: 500 }}
                    components={{
                        LoadingOverlay: CustomLoadingOverlay,
                    }}
                />
            </div>
            <br />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button
                    variant="contained"
                    color="inherit"
                    LinkComponent={Link} to='/ReqLoan'
                    endIcon={<ArrowBackIcon />}
                    sx={{
                        alignItems: 'center',
                        marginRight: '15px',
                        color: 'white',
                        backgroundColor: '#636361',
                        '&:hover': {
                            backgroundColor: '#383836'
                        },
                    }}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="inherit"
                    sx={{
                        alignItems: 'center',
                        color: 'white',
                        backgroundColor: '#288a35',
                        '&:hover': {
                            backgroundColor: '#29a339'
                        },
                    }}
                    onClick={handleOpen}
                >
                    Enter Your Loan Dates
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose} component="form" onSubmit={formik.handleSubmit}>
                <DialogTitle>How long are you loaning for?</DialogTitle>
                <DialogContent>
                    <DialogContentText marginBottom={2}>
                        Please key in your start and end dates
                    </DialogContentText>
                    <Stack direction="row" spacing={5} sx={{ justifyContent: 'center' }}>
                        <Stack>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    name='startDate'
                                    label="Start Date"
                                    value={formik.values.startDate ? dayjs(formik.values.startDate) : null}
                                    onChange={(value) => formik.setFieldValue('startDate', value)}
                                    error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                />
                            </LocalizationProvider>
                            {formik.touched.startDate && formik.errors.startDate && (
                                <Typography variant="caption" color="error">
                                    {formik.errors.startDate}
                                </Typography>
                            )}
                        </Stack>
                        <Typography variant='h6' color="#000000" paddingTop={1} marginLeft={5} marginRight={5}>
                            To
                        </Typography>
                        <Stack>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    name='endDate'
                                    label="End Date"
                                    value={formik.values.endDate ? dayjs(formik.values.endDate) : null}
                                    onChange={(value) => formik.setFieldValue('endDate', value)}
                                    error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                />
                            </LocalizationProvider>
                            {formik.touched.endDate && formik.errors.endDate && (
                                <Typography variant="caption" color="error">
                                    {formik.errors.endDate}
                                </Typography>
                            )}
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default LoanReceipt;
