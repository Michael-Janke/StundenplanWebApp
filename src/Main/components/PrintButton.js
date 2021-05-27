import React, { useState, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import grey from '@material-ui/core/colors/grey';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import PrintDialog from '../../TimeTable/Print';
import useKeyDown from '../../Common/hooks/useKeyDown';

const useStyles = makeStyles({
    icon: {
        color: grey[100],
    },
});

const UnreadMessages = () => {
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleKeyDown = useCallback((event) => {
        if (event.ctrlKey && event.keyCode === 80) {
            event.preventDefault();
            setDialogOpen(true);
        }
    }, []);

    useKeyDown(handleKeyDown);

    return (
        <>
            <Tooltip id="tooltip-print" title="Stundenplan drucken" disableTouchListener disableFocusListener>
                <IconButton onClick={() => setDialogOpen(true)}>
                    <PrintIcon className={classes.icon} />
                </IconButton>
            </Tooltip>
            <PrintDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
    );
};

export default UnreadMessages;
