import React, { useState } from 'react';
import ListIcon from '@material-ui/icons/FormatListNumbered';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useSelector, useDispatch } from 'react-redux';
import {
    Dialog,
    List,
    DialogTitle,
    ListItem,
    DialogActions,
    Button,
    DialogContent,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import { UserIcon } from '../../Main/components/Avatars';
import { setTimeTable } from '../../Main/actions';

const ShowStudentList = ({ list = [], name }) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <MenuItem onClick={() => setOpen(true)}>
                <ListItemIcon>
                    <ListIcon />
                </ListItemIcon>
                <ListItemText primary={`Kursliste (${list.length})`} />
            </MenuItem>
            {open && (
                <ListDialog
                    fullScreen={fullScreen}
                    name={name}
                    list={list}
                    open={true}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
};

export default ShowStudentList;

function ListDialog({ onClose, list, open, fullScreen, name }) {
    const handleClose = () => {
        onClose();
    };
    const students = useSelector(({ timetable }) => timetable.masterdata.Student);
    const dispatch = useDispatch();
    const onClick = (id) => () => {
        dispatch(setTimeTable('student', id));
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={open}
            scroll="paper"
        >
            <DialogTitle id="simple-dialog-title">Kursliste {name}</DialogTitle>
            <DialogContent dividers={true}>
                <List
                    style={{
                        minWidth: fullScreen ? 'unset' : 400,
                    }}
                >
                    {list
                        .filter((id) => students[id])
                        .map((id) => students[id])
                        .map((student) => (
                            <ListItem button key={student.STUDENT_ID} onClick={onClick(student.STUDENT_ID)}>
                                <ListItemIcon>
                                    <UserIcon upn={student.UPN} outline={true} size={40} />
                                </ListItemIcon>
                                <ListItemText primary={`${student.LASTNAME}, ${student.FIRSTNAME}`} />
                            </ListItem>
                        ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                    Schließen
                </Button>
            </DialogActions>
        </Dialog>
    );
}
