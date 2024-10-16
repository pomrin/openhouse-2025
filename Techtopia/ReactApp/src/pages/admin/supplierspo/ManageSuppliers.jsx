import { React, useState } from 'react'
import { Typography, FormControl, Stack, MenuItem, TextField, Select, Input, IconButton, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Link } from 'react-router-dom'

const otherButtonStyles = {
  width: '100px',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}

const SupplierCo = ['A', 'B', 'C', 'D'];

function ManageSuppliers() {
  const [co, setCo] = useState("None");
  const [salesPersonNew, setSalesPersonNew] = useState('');
  const [coAdd, setCoAdd] = useState('');
  const [coPostal, setCoPostal] = useState('');
  const [tele1, setTele1] = useState('');
  const [tele2, setTele2] = useState('');
  const [fax, setFax] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [itemSup, setItemSup] = useState('');
  const [remarkSup, setRemarkSup] = useState('');
  const [inputField, setInputField] = useState('');

  const handleReset = () => {
    setCoName('');
    setCoAdd('');
    setCoPostal('');
  }

  const handleAdd = () => {
    handleReset();
  }

  const handleCo = (event) => { setCo(event.target.value); }

  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3>Manage suppliers</h3>
      <h5>Add new supplier</h5>
      <Typography mb={0.5}>*Supplier company</Typography>
      <FormControl sx={{ minWidth: 240, minHeight: 40, marginRight: '30px' }} size="small">
        <Select id="demo-select-small" value={co} onChange={handleCo} >
          <MenuItem value="None">
            <div style={{ color: 'grey', opacity: '70%' }}>Select company</div>
          </MenuItem>
          {SupplierCo.map((x, index) => (
            <MenuItem key={index} value={x}>{x}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack mt={2} direction={'row'}>
        <Stack mb={2} mr={3} display='flex'>
          <Typography mb={0.5}>Company address : </Typography>
          <TextField size='small' placeholder='Company address' disabled sx={{ minWidth: '240px' }} value={coAdd} onChange={(e) => setCoAdd(e.target.value)}></TextField>
        </Stack>
        <Stack mb={2} mr={3} display='flex'>
          <Typography mb={0.5}>Company postal code : </Typography>
          <TextField size='small' placeholder='Company postal code' disabled sx={{ minWidth: '240px' }} value={coPostal} onChange={(e) => setCoPostal(e.target.value)}></TextField>
        </Stack>
      </Stack>
      <Stack direction={'row'}>
        <Stack mb={2} mr={3} display='flex'>
          <Typography mb={0.5}>*Sales person : </Typography>
          <TextField size='small' placeholder='Sales person (required)' sx={{ minWidth: '240px' }} value={salesPersonNew} onChange={(e) => setSalesPersonNew(e.target.value)}></TextField>
        </Stack>
        <Stack mb={2} mr={3} display='flex'>
          <Typography mb={0.5}>Telephone 1 : </Typography>
          <TextField type='tel' size='small' placeholder='Telephone 1' sx={{ minWidth: '240px' }} value={tele1} onChange={(e) => setTele1(e.target.value)}></TextField>
        </Stack>
        <Stack mb={2} mr={3} display='flex'>
          <Typography mb={0.5}>Telephone 2 : </Typography>
          <TextField type='tel' size='small' placeholder='Telephone 2' sx={{ minWidth: '240px' }} value={tele2} onChange={(e) => setTele2(e.target.value)}></TextField>
        </Stack>
      </Stack>
      <Stack direction={'row'}>
        <Stack mb={2} mr={3} display='flex'>
          <Typography mb={0.5}>Fax : </Typography>
          <TextField size='small' placeholder='Fax' sx={{ minWidth: '240px' }} value={fax} onChange={(e) => setFax(e.target.value)}></TextField>
        </Stack>
        <Stack mb={2} mr={3} display='flex'>
          <Typography mb={0.5}>Email : </Typography>
          <TextField type='email' size='small' placeholder='Email' sx={{ minWidth: '240px' }} value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
        </Stack>
        <Stack>
          <Typography mb={0.5}>Designation : </Typography>
          <TextField size='small' placeholder='Designation' sx={{ minWidth: '240px' }} value={designation} onChange={(e) => setDesignation(e.target.value)}></TextField>
        </Stack>
      </Stack>
      <Stack mb={2} direction={'row'}>
        <Stack mb={2} mr={3}>
          <Typography mb={0.5}>Items supplied : </Typography>
          <TextField multiline minRows={2} size='small' placeholder='Items supplied' sx={{ minWidth: '320px' }} value={itemSup} onChange={(e) => setItemSup(e.target.value)}></TextField>
        </Stack>
        <Stack mb={2} mr={3}>
          <Typography mb={0.5}>Remarks : </Typography>
          <TextField multiline minRows={2} size='small' placeholder='Remarks' sx={{ minWidth: '425px' }} value={remarkSup} onChange={(e) => setRemarkSup(e.target.value)}></TextField>
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

export default ManageSuppliers