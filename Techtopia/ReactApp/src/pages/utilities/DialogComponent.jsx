import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

export default function AlertDialog({ titleMessage, open, setOpen, setReturnMessage, handleReject, reason, setReason }) {
    const handleClose = () => {
        setOpen(false);
        setReason('')
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {titleMessage}
                </DialogTitle>
                <DialogContent>
                    {setReturnMessage != null ?
                        <>
                            <DialogContentText id="alert-dialog-description">
                                Reason:
                            </DialogContentText>
                            <TextField autoFocus
                                margin="dense"
                                label="Reject reason"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </> : null
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>CANCEL</Button>
                    <Button onClick={handleReject} autoFocus>OK</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}