import React from 'react';
import { connect } from 'react-redux';
import AssignmentAddIcon from '@material-ui/icons/NoteAdd';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { openCreateAssignment } from '../actions';

const AddAssignment = ({ isTeacher, team, openCreateAssignment }) =>
    isTeacher ? (
        <MenuItem onClick={() => openCreateAssignment(team)}>
            <ListItemIcon>
                <AssignmentAddIcon />
            </ListItemIcon>
            <ListItemText primary="Hausaufgabe erstellen" />
        </MenuItem>
    ) : null;

const mapStateToProps = ({ user }) => ({ isTeacher: user.type === 'teacher' });

const mapDispatchToProps = dispatch => ({
    openCreateAssignment: team => dispatch(openCreateAssignment(team)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddAssignment);
