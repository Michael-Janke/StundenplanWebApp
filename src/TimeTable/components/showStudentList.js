import React from 'react';
import ListIcon from '@material-ui/icons/FormatListNumbered';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useDispatch } from 'react-redux';
import { loadStudentList } from '../actions';

const ShowStudentList = ({ list, reference = {} }) => {
    const dispatch = useDispatch();
    const open = () => dispatch(loadStudentList(reference));

    return (
        <MenuItem onClick={open}>
            <ListItemIcon>
                <ListIcon />
            </ListItemIcon>
            <ListItemText primary={`Kursliste (${list.length})`} />
        </MenuItem>
    );
};

export default ShowStudentList;
