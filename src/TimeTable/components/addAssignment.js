import React from 'react';
import { connect } from 'react-redux';
import AssignmentAddIcon from '@material-ui/icons/NoteAdd';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { openCreateAssignment } from '../actions';

const AddAssignment = ({ date, team, openCreateAssignment }) => (
    <MenuItem onClick={() => openCreateAssignment({ date, team })}>
        <ListItemIcon>
            <AssignmentAddIcon />
        </ListItemIcon>
        <ListItemText primary="Aufgabe erstellen" />
    </MenuItem>
);

const mapDispatchToProps = dispatch => ({
    openCreateAssignment: data => dispatch(openCreateAssignment(data)),
});

export default connect(
    null,
    mapDispatchToProps
)(AddAssignment);
