import { React, useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Stack, Typography, TextField, Button, Input, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const brandList = [];

const otherButtonStyles = {
  width: '100px',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}

function ManageModels() {
  const [brand, setBrand] = useState("None");
  const [modelField, setModelField] = useState("");
  const [descField, setDescField] = useState("");
  const [inputField, setInputField] = useState("");

  const handleBrand = (event) => { setBrand(event.target.value); }

  const handleReset = () => {
    setBrand('None');
    setModelField('');
    setDescField('');
  }
  
  const handleAdd = () => {
    console.log(brand + modelField + descField)
    handleReset();
  }

  const handleSearch = () => {
    console.log('to do')
  }

  return (
    <div>
      <h2>SIT Asset Management System</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3 mb={2}>Manage models</h3>
      <h5> Add new models</h5>
      <Stack direction='row'>
        <Stack mb={2} display='flex'>
          <Typography mb={1}>Brand:</Typography>
          <FormControl sx={{ minWidth: 240, minHeight: 40, marginRight: '30px' }} size="small">
            <Select id="demo-select-small" value={brand} onChange={handleBrand} >
              <MenuItem value="None">
                <div style={{ color: 'grey', opacity: '70%' }}>Select brand</div>
              </MenuItem>
              {brandList.map((brand, index) => (
                <MenuItem key={index} value={brand}>{brand}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack mb={2} display='flex'>
          <Typography mb={1}>Model:</Typography>
          <TextField size='small' placeholder='Input model' sx={{ minWidth: '240px' }} value={modelField} onChange={(e) => setModelField(e.target.value)}></TextField>
        </Stack>
      </Stack>
      <Stack mb={4} display='flex'>
        <Typography mb={1}>Model description:</Typography>
        <TextField multiline minRows={2} sx={{ maxWidth: '400px' }} placeholder='Input model description' value={descField} onChange={(e) => setDescField(e.target.value)}></TextField>
      </Stack>
      <Stack direction={'row'} mb={4} maxWidth={400} float='right'>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '10px' }} onClick={handleReset}>Reset</Button>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px' }} onClick={handleAdd}>Add</Button>
      </Stack>
      <h5 mb={2}> Existing models</h5>
      <Stack direction='row' style={{ marginRight: '30px', marginBottom:'50px'}}>
        <Input fontSize='1' placeholder='Search' style={{ width: '300px' }} value={inputField} onChange={(e) => setInputField(e.target.value)}></Input>
        <IconButton color="primary"> <Search /> </IconButton>
      </Stack>
      <br />
    </div>
  )
}

export default ManageModels