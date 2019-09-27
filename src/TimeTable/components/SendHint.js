import React from 'react';
import { connect } from 'react-redux';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { openSendHint } from '../actions';

const SendHint = ({ openSendHint }) => (
    <MenuItem onClick={openSendHint}>
        <ListItemIcon>
            <AnnouncementIcon />
        </ListItemIcon>
        <ListItemText primary="Hinweis senden" />
    </MenuItem>
);

const mapDispatchToProps = (dispatch, props) => ({
    openSendHint: () => dispatch(openSendHint(props.collectData())),
});

export default connect(
    null,
    mapDispatchToProps
)(SendHint);
