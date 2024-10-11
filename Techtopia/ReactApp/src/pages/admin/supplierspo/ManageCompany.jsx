import { React, useState } from 'react'
import { Stack, Typography, TextField, Button, Input, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const otherButtonStyles = {
  width: '100px',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}
function ManageCompany() {
  const [coName, setCoName] = useState('');
  const [coAdd, setCoAdd] = useState('');
  const [coPostal, setCoPostal] = useState('');
  const [inputField, setInputField] = useState('');

  const handleReset = () => {
    setCoName('');
    setCoAdd('');
    setCoPostal('');
  }

  const handleAdd = () => {
    handleReset();
  }

  const handleSearch = () => {
    console.log('to do')
  }

  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3>Manage company</h3>
      <h5 mb={2}>Add new company</h5>
      <Stack mb={4}>
        <Typography mr={2}>*New company name:</Typography>
        <TextField size='small' placeholder='Company name (required)' sx={{ minWidth: '240px', maxWidth: '240px' }} value={coName} onChange={(e) => setCoName(e.target.value)}></TextField>
      </Stack>
      <Stack direction='row' mb={2}>
        <Stack mr={4}>
          <Typography mr={2}>Company address:</Typography>
          <TextField size='small' multiline minRows={2} placeholder='Company address' sx={{ minWidth: '300px' }} value={coAdd} onChange={(e) => setCoAdd(e.target.value)}></TextField>
        </Stack>
        <Stack>
          <Typography mr={2}>Company postal code:</Typography>
          <TextField size='small' placeholder='Company postal code' sx={{ minWidth: '200px' }} value={coPostal} onChange={(e) => setCoPostal(e.target.value)}></TextField>
        </Stack>
      </Stack>
      <Stack direction={'row'} mb={4} maxWidth={400} float='right'>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '10px' }} onClick={handleReset}>Reset</Button>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px' }} onClick={handleAdd}>Add</Button>
      </Stack>
      <h5 mb={2}>Existing companies</h5>
      <Stack mb={8} direction='row' style={{ marginRight: '30px' }}>
        <Input fontSize='1' placeholder='Search' style={{ width: '300px' }} value={inputField} onChange={(e) => setInputField(e.target.value)}></Input>
        <IconButton color="primary"> <Search /> </IconButton>
      </Stack>
    </div>
  )
}

export default ManageCompany