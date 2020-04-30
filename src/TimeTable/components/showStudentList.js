import React, { useState, useEffect } from 'react';
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
    AppBar,
    Tabs,
    Tab,
    makeStyles,
} from '@material-ui/core';
import { UserIcon } from '../../Main/components/Avatars';
import { setTimeTable } from '../../Main/actions';
import { loadStudentList } from '../actions';

const ShowStudentList = ({ list, timetableId, date }) => {
    const [open, setOpen] = useState(false);

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
                    list={list}
                    open={true}
                    timetableId={timetableId}
                    date={date}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
};

export default ShowStudentList;

const useStyles = makeStyles({
    absent: {
        color: '#CCCCCC',
        textDecoration: 'line-through',
    },
});

function ListDialog({ onClose, list, timetableId, date, open }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();

    const dispatch = useDispatch();
    const [view, setView] = useState(1);

    useEffect(() => {
        dispatch(loadStudentList(timetableId, date));
    }, [date, dispatch, timetableId]);

    const { list: listCurrent, loading, error } = useSelector(({ studentList }) => studentList);
    const students = useSelector(({ timetable }) => timetable.masterdata.Student);

    const handleClose = () => {
        onClose();
    };
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
            <DialogTitle id="simple-dialog-title">Kursliste</DialogTitle>{' '}
            <AppBar position="static" color="default">
                <Tabs
                    value={view}
                    onChange={(e, view) => setView(view)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Ohne Vertretung" />
                    <Tab label="Mit Vertretung" />
                    <Tab label="Integriert" />
                </Tabs>
            </AppBar>
            <DialogContent dividers={true}>
                {!loading && !error && (
                    <List
                        style={{
                            minWidth: fullScreen ? 'unset' : 400,
                        }}
                    >
                        {[list, listCurrent, list][view]
                            .filter((id) => students[id])
                            .map((id) => students[id])
                            .sort((a, b) => a.LASTNAME.localeCompare(b.LASTNAME))
                            .map((student) => (
                                <ListItem button key={student.STUDENT_ID} onClick={onClick(student.STUDENT_ID)} dense>
                                    <ListItemIcon>
                                        <UserIcon upn={student.UPN} outline={true} size={32} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`${student.LASTNAME}, ${student.FIRSTNAME}`}
                                        classes={{
                                            primary:
                                                view === 2 && listCurrent.indexOf(student.STUDENT_ID) === -1
                                                    ? classes.absent
                                                    : undefined,
                                        }}
                                    />
                                </ListItem>
                            ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                    Schließen
                </Button>
            </DialogActions>
        </Dialog>
    );
}
