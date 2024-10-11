import { React, useState, useRef } from 'react';
import { Input, IconButton, Typography, Stack, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const otherButtonStyles = {
  width: '100px',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}

function CreateLoanApprovalStaff() {
  const [inputField, setInputField] = useState("");
  const [category, setCategory] = useState("None");
  const [brand, setBrand] = useState("None");
  const [model, setModel] = useState("None");

  const handleCategory = (event) => {
    setCategory(event.target.value);
  }

  const handleBrand = (event) => {
    setBrand(event.target.value);
  }

  const handleModel = (event) => {
    setModel(event.target.value);
  }

  const handleReset = () => {
    setInputField('');
    setCategory("None");
    setModel("None");
    setBrand("None");
  }

  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3>Create approval loan request for a selected staff</h3>
      <p style={{ color: 'red' }}>
        * Note: <br />
        1) This will <b>bypass</b> the normal approval process. <br />
        2) Ensure that the staff have a <b>valid documentation/email</b> before creating this Loan Request for the staff. <br />
        3) Ensure that the documentation contains the <b>required approvals</b> (AD/DD) before creating this Loan Request for the staff. <br />
        4) Items in this Loan Request are automatically set to <b>"Loaned Out"</b>. <br />

      </p>
      <Stack direction='row' alignItems='flex-start' overflow='auto' mb={4}>
        <Stack>
          <Typography mb={1}>Filter by</Typography>
          <Stack direction='row' style={{ marginRight: '30px' }}>
            <Input fontSize='1' placeholder='Search' style={{ width: '200px' }} value={inputField} onChange={(e) => setInputField(e.target.value)}></Input>
            <IconButton color="primary"> <Search /> </IconButton>
          </Stack>
        </Stack>
        <Stack>
          <Typography mb={1}>Category</Typography>
          <FormControl sx={{ minWidth: 240, minHeight: 40, mb: 1, marginRight: '30px' }} size="small">
            <Select id="demo-select-small" value={category} onChange={handleCategory} >
              <MenuItem value="None">
                <div style={{ color: 'grey', opacity: '70%' }}>Select category</div>
              </MenuItem>
              <MenuItem value={1}>3 Tier Push Cart</MenuItem>
              <MenuItem value={2}>Adapter</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack>
          <Typography mb={1}>Brand</Typography>
          <FormControl sx={{ minWidth: 240, minHeight: 40, mb: 1 }} size="small">
            <Select id="demo-select-small" value={brand} onChange={handleBrand} >
              <MenuItem value="None">
                <div style={{ color: 'grey', opacity: '70%' }}>Select brand</div>
              </MenuItem>
              <MenuItem value={1}>Brand 1</MenuItem>
            </Select>
          </FormControl>
          <Typography mb={1}>Model</Typography>
          <FormControl sx={{ minWidth: 240, minHeight: 40 }} size="small">
            <Select id="demo-select-small" value={model} onChange={handleModel} >
              <MenuItem value="None">
                <div style={{ color: 'grey', opacity: '70%' }}>Select brand</div>
              </MenuItem>
              <MenuItem value={1}>Model 1</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      <Stack direction='row' mb={10}>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px', marginRight: '10px' }} onClick={handleReset}>Reset</Button>
        <Button sx={{ ...otherButtonStyles, fontSize: '12px' }}>Search</Button>
      </Stack>


    </div>

  )
}

export default CreateLoanApprovalStaff