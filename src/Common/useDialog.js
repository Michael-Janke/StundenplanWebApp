import React from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Paper,
    Popover,
} from '@material-ui/core';

export default function useDialogPopper(options) {
    const { title = 'Titel', text = 'Text', textAccept = 'Akzeptieren', textDecline = 'Ablehnen' } = options || {};

    const callback = React.useRef();
    const [anchorRef, setAnchorRef] = React.useState();

    const set = (anchorRef, cb) => {
        setAnchorRef(anchorRef);
        callback.current = cb;
    };

    const handleClose = status => {
        setAnchorRef(null);
        callback.current && callback.current(status);
    };
    return [
        <Popover
            id={anchorRef ? 'use-dialog-popper' : null}
            open={!!anchorRef}
            anchorEl={anchorRef}
            onClose={() => handleClose(undefined)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Paper>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{text}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)} color="primary">
                        {textDecline}
                    </Button>
                    <Button onClick={() => handleClose(true)} color="primary">
                        {textAccept}
                    </Button>
                </DialogActions>
            </Paper>
        </Popover>,
        set,
    ];
}
