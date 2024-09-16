import { React, useState, useEffect } from 'react';
import { Box, Stack, TextField, Typography, Button, Input, IconButton, TableBody, Table, TableContainer, TableRow, TableCell, TableHead, Paper, Backdrop, Modal, Fade, Step, Stepper, StepLabel, CircularProgress, Select, FormControl, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http'
import { tokenValue } from "../../constants"
import { Link } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';

// contexts and components
import { useToastify } from '../../contexts/ToastifyContext';
import { useUtil } from '../../contexts/UtilContext';
import { useLoader } from '../../contexts/LoaderContext';

// icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';

const otherButtonStyles = {
  width: '100px',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}

function RenderButton(props) {
  const { element, cart, categoryList, modelList, fetchCartData, category, setCategory, setItemList } = props;
  const { setStatus, setText, statusList } = useToastify();
  const { setLoading } = useLoader();

  const [open, setOpen] = useState("");
  const handleOpen = () => {
    console.log("Element: ", element);
    console.log("Cart: ", cart);
    setOpen(true);
  };

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  const handleCategory = async (category) => {
    setLoading(true);
    setCategory(category);
    const catItem = categoryList.find(c => c.catName === category);
    const id = catItem ? catItem.catId : null;
    await http
      .get(`/AssetItemSearch`, {
        params: {
          CatId: id,
          AssetItemLoanable: 1
        }
      })
      .then((res) => {
        setItemList(res.data);
        setLoading(false);
      });
  }

  const submitRequest = (categoryId, modelId, quantity, comment) => {
    http
      .put(`/LoanRequestCart?itemCategoryId=${categoryId}&itemModelId=${modelId}&quantity=${quantity}&comment=${comment}`)
      .then((res) => {
        fetchCartData();
        handleCategory(category);
        console.log(res.data);
        // Add status and text to toastify
        setStatus(statusList[0]);
        setText("Successfully Added to the Receipt");
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        setStatus(statusList[2]);
        setText("Something went wrong");
      });
  }

  // Submission of loan request + validation schema
  const formik = useFormik({
    initialValues: {
      quantity: 1,
      purpose: ""
    },
    validationSchema: yup.object().shape({
      quantity: yup.number().min(1, "Quantity cannot be less than 1").max(element.quantity, `Quantity cannot be more than ${element.quantity}`).required('Required'),
      purpose: yup.string().required("Please state a purpose.")
    }),
    onSubmit: (data) => {
      let catId = categoryList.find(c => c.catName === element.category).catId;
      let modelId = modelList.find(m => m.modelName === element.model || m.modelId === element.model).modelId;

      const values = {
        itemCategoryId: catId,
        itemModelId: modelId,
        quantity: data.quantity,
        comment: data.purpose.trim()
      };
      console.log("Values: ", values);

      if (cart.length == 0) {
        submitRequest(values.itemCategoryId, values.itemModelId, values.quantity, values.comment);
      }
      else {
        for (let i = 0; i < cart.length; i++) { // loop instead of foreach in order to stop the loop upon submitting the request 
          const cartItem = cart[i];
          console.log('Cart Item:', cartItem)
          if (cartItem.categoryId == values.itemCategoryId && cartItem.modelId == values.itemModelId) {
            values.quantity = values.quantity + cartItem.quantity;
            if (values.quantity > element.quantity) {
              formik.setErrors({
                quantity: `Quantity cannot be more than ${cartItem.quantity}`
              });
              break;
            } else {
              console.log("New Values", values);
              submitRequest(values.itemCategoryId, values.itemModelId, values.quantity, values.comment);
              break;
            }
          } else {
            submitRequest(values.itemCategoryId, values.itemModelId, values.quantity, values.comment);
          }
        }
      }
    },
  });

  return (
    <>
      <Button
        variant="contained"
        size="small"
        style={{ backgroundColor: '#6CA0DC' }}
        onClick={() => handleOpen(element)}
      >
        Reserve Item
        <AddIcon />
      </Button>
      {/* New Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        component='form'
      >
        <DialogTitle>
          <Stack direction="row" spacing={1}>
            <Stack>You have selected the following item:</Stack>
            <Stack fontWeight="bold">HP EliteBook 840</Stack>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={6}>
              <Typography fontWeight="bold">Category: </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{element.category}</Typography>
            </Grid>
            <Grid item xs={12}>
              <hr style={{ border: '1px solid', color: '#D3D3D3' }}></hr>
            </Grid>
            <Grid item xs={6}>
              <Typography fontWeight="bold">Brand: </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{element.brand}</Typography>
            </Grid>
            <Grid item xs={12}>
              <hr style={{ border: '1px solid', color: '#D3D3D3' }}></hr>
            </Grid>
            <Grid item xs={6}>
              <Typography fontWeight="bold">Model: </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{element.model}</Typography>
            </Grid>
            <Grid item xs={12}>
              <hr style={{ border: '1px solid', color: '#D3D3D3' }}></hr>
            </Grid>
            <Grid item xs={6}>
              <Typography fontWeight="bold">Available Quantity: </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{element.quantity}</Typography>
            </Grid>
            <Grid item xs={12}>
              <hr style={{ border: '1px solid', color: '#D3D3D3' }}></hr>
            </Grid>
            <Grid item xs={6} alignSelf='center'>
              <Typography fontWeight='bold'>Quantity to Loan<span style={{ color: 'red' }}>*</span>:</Typography>
            </Grid>
            <Grid item xs={6} container>
              <TextField
                sx={{ minWidth: '25%', alignSelf: 'center' }}
                id="quantity"
                name="quantity"
                type="number"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                inputProps={{ min: 1, max: element.quantity }}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
              />
            </Grid>
            <Grid item xs={12}>
              <hr style={{ border: '1px solid', color: '#D3D3D3' }}></hr>
            </Grid>
            <Grid item xs={6}>
              <Typography fontWeight='bold'>Purpose<span style={{ color: 'red' }}>*</span>:</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="purpose"
                name="purpose"
                multiline
                minRows={3}
                sx={{ minWidth: '100%' }}
                value={formik.values.purpose}
                onChange={formik.handleChange}
                error={formik.touched.purpose && Boolean(formik.errors.purpose)}
                helperText={formik.touched.purpose && formik.errors.purpose}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={formik.handleSubmit} sx={{ marginX: 'auto' }}>
            Add to loan request cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const CustomLoadingOverlay = () => (
  <GridOverlay>
    <CircularProgress />
  </GridOverlay>
);

function ReqLoan() {
  const token = tokenValue;

  const { steps } = useUtil();
  const { loading, setLoading } = useLoader();
  const { categoryList, setCategoryList } = useUtil();

  const [cart, setCart] = useState([]); // cart to check for the same item
  const [inputField, setInputField] = useState(""); // set search input field
  const [category, setCategory] = useState("PC"); // set active category from menu
  const [modelList, setModelList] = useState([]); // list of model
  const [itemList, setItemList] = useState([]); // list of items

  // find ID of category selected, search using assetitemsearch with id
  const handleCategory = async (event) => {
    if (event.target.value) {
      setLoading(true);
      setCategory(event.target.value);
    }
    const catItem = categoryList.find(c => c.catName === event.target.value);
    const id = catItem ? catItem.catId : null;
    await http
      .get(`/AssetItemSearch`, {
        params: {
          CatId: id,
          AssetItemLoanable: 1
        }
      })
      .then((res) => {
        setItemList(res.data);
        setLoading(false);
      });
  }

  // category list for dropdown
  const filteredCategoryList = categoryList.sort((a, b) => a.catName.localeCompare(b.catName));

  // get categories and model on load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [catRes, modelRes] = await Promise.all([
        http.get(`/ItemCategory`),
        http.get("/ItemModel"),
      ]);
      setCategoryList(catRes.data);
      setModelList(modelRes.data);
    };
    fetchData();
  }, [token]);

  // get items on load
  const fetchItemData = async () => {
    setLoading(true);
    await http
      .get('/AssetItemSearch', {
        params: {
          CatId: 65,
          AssetItemLoanable: 1
        }
      })
      .then((res) => {
        setItemList(res.data);
        console.log(itemList);
      })
      .catch((err) => { console.error(err) })
      .finally(() => setLoading(false))
  };

  // get cart on load to check for duplicate items
  const fetchCartData = async () => {
    setLoading(true);
    await http.get("/LoanRequestCart")
      .then((res) => {
        setCart(res.data);
        console.log("Cart: ", cart)
      })
      .catch((err) => { console.error(err) })
  };

  useEffect(() => {
    fetchCartData();
    fetchItemData();
  }, [token])

  // reset fields
  const handleReset = () => {
    setInputField("");
    setCategory("None")
    setItemList([]);
  }

  // handle search with both queries
  const handleSearch = () => {
    console.log(inputField)
    http
      .get(`/AssetItemSearch`, {
        params: {
          SearchTerm: inputField,
          AssetItemLoanable: 1
        }
      })
      .then((res) => { setItemList(res.data); });
  }

  // combine same items for data grid
  const combinedItemList = [];
  itemList.forEach((element) => {
    let existingItem = [];
    if (element.modelName == '') {
      existingItem = combinedItemList.find(
        item => item.brand === element.brandName && item.model === element.modelId
      );
    } else {
      existingItem = combinedItemList.find(
        item => item.brand === element.brandName && item.model === element.modelName
      );
    }
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      if (element.modelName == '') {
        combinedItemList.push({
          category: element.categoryName,
          brand: element.brandName,
          model: element.modelId,
          description: element.itemDescription,
          quantity: 1
        });
      }
      else {
        combinedItemList.push({
          category: element.categoryName,
          brand: element.brandName,
          model: element.modelName,
          description: element.itemDescription,
          quantity: 1
        });
      }
    }
  });

  // data grid
  const columns = [
    { field: 'id', headerName: 'S/N', width: 90, headerAlign: 'center', align: "center" },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'brand', headerName: 'Brand', width: 150 },
    { field: 'model', headerName: 'Model', width: 150 },
    { field: 'description', headerName: 'Modal Description', width: 300 },
    { field: 'quantity', headerName: 'Quantity available', width: 150 },
    {
      field: 'action',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <RenderButton
          element={params.row}
          cart={cart}
          category={category}
          categoryList={categoryList}
          modelList={modelList}
          itemList={itemList}
          fetchCartData={fetchCartData}
          setItemList={setItemList}
          setCategory={setCategory}
        />
      ),
    },
  ];

  const rows = combinedItemList.map((element, index) => ({
    id: index + 1,
    category: element.category || '-',
    brand: element.brand || '-',
    model: element.model || '-',
    description: element.description || '-',
    quantity: element.quantity || '-'
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h2>SIT Asset Management System</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      {/* Stepper */}
      <Stepper activeStep={0} alternativeLabel style={{ display: 'flex', flexDirection: 'row', marginBottom: "50px" }} >
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography variant="h5">Create a loan request</Typography>
      <h4>Request to loan an item with the filter below</h4>
      <Stack direction={'row'}>
        <Stack>
          <Typography mb={1}>Search term</Typography>
          <Stack direction='row' style={{ marginRight: '30px' }}>
            <Input fontSize='1' placeholder='Search ' style={{ width: '300px' }} value={inputField} onChange={(e) => setInputField(e.target.value)}></Input>
            <IconButton color="primary" onClick={handleSearch}> <Search /> </IconButton>
          </Stack>
        </Stack>
        <Stack display='flex'>
          <Typography mb={0.5}>Category</Typography>
          <FormControl sx={{ minWidth: 240, minHeight: 40, mb: 2, marginRight: '30px' }} size="small">
            <Select id="demo-select-small" value={category} onChange={handleCategory} >
              {filteredCategoryList.map((categoryList, index) => (
                <MenuItem key={index} value={categoryList.catName}>{categoryList.catName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      <Stack direction={'row'} mt={4} mb={4} maxWidth={400} float='right'>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '10px' }} onClick={handleReset}>Reset</Button>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px' }} onClick={handleSearch}>Search</Button>
      </Stack>
      {loading && itemList.length > 0 && <Typography>Updating changes... <CircularProgress size={12} sx={{ color: 'black' }} /></Typography>}
      <Typography><b>Available Items : {itemList.length} </b></Typography>
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
          pageSizeOptions={[5, 10]} s
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
          LinkComponent={Link} to='/MyLoanReceipt'
          endIcon={<ArrowForwardIcon />}
          sx={{
            color: 'white',
            backgroundColor: '#636361',
            '&:hover': {
              backgroundColor: '#383836'
            },
          }}
        >
          View your Loan Receipt
        </Button>
      </Box>
      <br />
      <br />
    </div>
  )
}

export default ReqLoan
