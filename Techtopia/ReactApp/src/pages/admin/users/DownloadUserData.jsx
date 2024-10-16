import React from 'react'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Stack } from '@mui/material';
import { Link } from 'react-router-dom';

function DownloadUserData() {
  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3>Update users' data from SIT System</h3>
      <Stack direction={'row'} alignItems={'center'}>
        <CloudDownloadIcon sx={{ fontSize: '30px', marginRight: '20px' }}></CloudDownloadIcon>
        <Link>Update</Link>
      </Stack>

      <h3>Users updated</h3>
      <h5>Users enabled</h5>
      <h5>Users disabled</h5>
    </div>
  )
}

export default DownloadUserData