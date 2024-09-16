import { React, useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Stack, Typography, TextField, Button, Input, IconButton, Checkbox } from '@mui/material';
import { Search } from '@mui/icons-material';

const brandList = ['Unknown', 'Blk G', 'E.305', 'E.308', 'E.401', 'E.407', 'E.408', 'E.411', 'E.431', 'E.433', 'G.226', 'P1', 'T-JUNCTION'];

const buttonStyles = {
  width: '100px',
  backgroundColor: '#5D7B9D',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#092041',
    color: '#fff',
  }
}

const otherButtonStyles = {
  width: '100px',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}

function ManageCategories() {
  const [active, setActive] = useState('');
  const [modelField, setModelField] = useState('');
  const [consumable, setConsumable] = useState(false);
  const [inputField, setInputField] = useState("");

  const handleClick = (xa) => {
    setActive(xa);
  }

  const handleReset = () => {
    setActive('');
    setModelField('');
    setConsumable('');
    setInputField("");
  }

  const handleAdd = () => {
    console.log(modelField + active + consumable)
    handleReset();
  }

  const handleSearch = () => {
    console.log('to do')
  }

  return (
    <div>
      <h2>SIT Asset Management System</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3 mb={2}>Manage categories</h3>
      <h5> Add new category</h5>
      <Stack direction={'row'}>
        <Stack mb={2} display='flex'>
          <Typography mb={1}>Category:</Typography>
          <TextField size='small' placeholder='Input model' sx={{ maxWidth: '240px', marginRight: '30px' }} value={modelField} onChange={(e) => setModelField(e.target.value)}></TextField>
        </Stack>
        <Stack>
          <Typography mb={1} display='flex'>Require AD/DD's approval</Typography>
          <Stack mb={0} direction={'row'}>
            <Button sx={{ ...buttonStyles, fontSize: '12px', marginRight: '10px', backgroundColor: active === 'yes' ? '#092041' : '#5D7B9D', color: active === 'yes' ? '#a29be0' : '#fff' }} onClick={() => handleClick('yes')}>YES</Button>
            <Button sx={{ ...buttonStyles, fontSize: '12px', marginRight: '60px', backgroundColor: active === 'no' ? '#092041' : '#5D7B9D', color: active === 'no' ? '#a29be0' : '#fff' }} onClick={() => handleClick('no')}>NO</Button>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction='row' alignItems='center' mb={6}>
          <Typography mr={2} display='flex'>Consumable</Typography> 
          <Checkbox checked={consumable} onChange={(e) => setConsumable(e.target.checked)}></Checkbox>
      </Stack>
      <Stack direction={'row'} mb={4} maxWidth={400} float='right'>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '10px' }} onClick={handleReset}>Reset</Button>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px' }} onClick={handleAdd}>Add</Button>
      </Stack>
      <h5 mb={2}> Existing categories</h5>
      <Stack direction='row' style={{ marginRight: '30px', marginBottom: '50px' }}>
        <Input fontSize='1' placeholder='Search' style={{ width: '300px' }} value={inputField} onChange={(e) => setInputField(e.target.value)}></Input>
        <IconButton color="primary"> <Search /> </IconButton>
      </Stack>
    </div>
  )
}

export default ManageCategories