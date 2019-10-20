import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import grey from '@material-ui/core/colors/grey';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import MailDialog from './Mail';

const useStyles = makeStyles({
    icon: {
        color: grey[100],
    },
});

const UnreadMessages = () => {
    const unreadMessages = useSelector(state => state.teams.unreadMessages || 0);
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <Tooltip id="tooltip-print" title="Ungelesene Nachrichten" disableTouchListener disableFocusListener>
                <IconButton onClick={() => setDialogOpen(true)}>
                    <Badge badgeContent={unreadMessages} invisible={!unreadMessages} color="secondary">
                        <MailIcon className={classes.icon} />
                    </Badge>
                </IconButton>
            </Tooltip>
            <MailDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
    );
};

export default UnreadMessages;
