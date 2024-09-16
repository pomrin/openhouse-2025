import { React, useState } from 'react'
import { Snackbar, Alert } from '@mui/material'

function SnackbarComponent({ type, message, showSnackbar, setShowSnackbar }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  };

  return (
    <div>
      {showSnackbar && (
        <Snackbar
          className={`snackbar${type.charAt(0).toUpperCase() + type.slice(1)}`}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={showSnackbar}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert severity={type} onClose={handleClose} variant="filled" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      )}
    </div>
  )
}

export default SnackbarComponent