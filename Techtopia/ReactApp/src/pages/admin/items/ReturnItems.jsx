import { Input, Stack, IconButton } from '@mui/material'
import { Search } from '@mui/icons-material';
import React from 'react'

function ReturnItems() {
  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <Stack >
        <h3>Return items</h3>
        <Stack direction='row'>
          <Input placeholder='Loan request ID, Asset ID, Staff name/ID or scan RFID/NFC' sx={{ minWidth: '450px', maxWidth: '450px' }}></Input>
          <IconButton color="primary"><Search></Search></IconButton>
        </Stack>
      </Stack>
    </div>
  )
}

export default ReturnItems