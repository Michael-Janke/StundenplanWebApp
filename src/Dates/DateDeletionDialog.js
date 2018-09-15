import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import Date from './Date';

export default ({ date, open, handleClose, handleDelete }) => (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
    >
        <DialogTitle id="alert-dialog-title">Wirklich löschen?</DialogTitle>
        <DialogContent style={{fontSize: '100%'}}>
            <Date date={date} />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Nein
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
                Ja
            </Button>
        </DialogActions>
    </Dialog>
);