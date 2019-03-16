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
        <DialogTitle id="alert-dialog-title">{date && date.TEXT} löschen?</DialogTitle>
        <DialogContent style={{ fontSize: '100%' }}>
            <Date date={date} />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="secondary">
                Abbrechen
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
                Löschen
            </Button>
        </DialogActions>
    </Dialog>
);
