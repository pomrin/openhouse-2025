import { React, useState } from 'react'
import { Stack, Typography, TextField, Button, Input, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import http from '../../http'
import { tokenValue } from '../../../constants';
import { useToastify } from '../../../contexts/ToastifyContext';

const otherButtonStyles = {
  width: '100px',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}

function ManageBrands() {
  const token = tokenValue
  const [brand, setBrand] = useState("");
  const [inputField, setInputField] = useState("");
  const { statusList, setStatus, setText } = useToastify();

  const handleReset = () => {
    setBrand('');
  }

  const handleAdd = () => {
    if (brand) {
      const brandTrim = brand.trim()
      http.post(`/ItemBrand`, `"${brandTrim}"`)
        .then((res) => {
          setText("Brand successfully created");
          setStatus(statusList[0]);
          handleReset();
        })
        .catch((err) => {
          console.log(err);
          setText("Something went wrong");
          setStatus(statusList[2]);
        })
    } else {
      setText("Brand name must not be empty");
      setStatus(statusList[2]);
    }
  }

  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3 mb={2}>Manage brands</h3>
      <h5> Add new brands</h5>

      <Stack mb={4} direction='row' alignItems='center'>
        <Typography mr={2}>Brand:</Typography>
        <TextField size='small' placeholder='Input brand' sx={{ minWidth: '240px' }} value={brand} onChange={(e) => setBrand(e.target.value)}></TextField>
      </Stack>
      <Stack direction={'row'} mb={4} maxWidth={400} float='right'>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '10px' }} onClick={handleReset}>Reset</Button>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px' }} onClick={handleAdd}>Add</Button>
      </Stack>
      <h5 mb={2}>Existing Brands</h5>
      <Stack direction='row' style={{ marginRight: '30px' }}>
        <Input fontSize='1' placeholder='Search' style={{ width: '300px' }} value={inputField} onChange={(e) => setInputField(e.target.value)}></Input>
        <IconButton color="primary"> <Search /> </IconButton>
      </Stack>
    </div>
  )
}

export default ManageBrands