import React from 'react';
import ListIcon from '@material-ui/icons/FormatListNumbered';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useDispatch } from 'react-redux';
import { loadStudentList } from '../actions';

const ShowStudentList = ({ reference = {} }) => {
    const dispatch = useDispatch();
    const open = () => dispatch(loadStudentList(reference));

    if (!reference.TIMETABLE_ID) return null;

    return (
        <MenuItem onClick={open}>
            <ListItemIcon>
                <ListIcon />
            </ListItemIcon>
            <ListItemText primary={'Kursliste ' + (reference.STUDENT_COUNT ? `(${reference.STUDENT_COUNT})` : '')} />
        </MenuItem>
    );
};

export default ShowStudentList;
