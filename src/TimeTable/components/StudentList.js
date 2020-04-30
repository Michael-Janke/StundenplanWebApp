import React, { useState, useEffect } from 'react';
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
    CircularProgress,
} from '@material-ui/core';
import { UserIcon } from '../../Main/components/Avatars';
import { setTimeTable } from '../../Main/actions';
import { closeStudentList } from '../actions';
import Page from '../Print/page';

export default function ListDialog() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const dispatch = useDispatch();
    const [view, setView] = useState(null);
    const [print, setPrint] = useState(false);

    const { list, timetableId, currenGroup, loading } = useSelector(({ studentList }) => studentList);
    const students = useSelector(({ timetable }) => timetable.masterdata.Student);

    const handleClose = () => dispatch(closeStudentList());
    const onClick = (id) => () => {
        dispatch(setTimeTable('student', id));
        handleClose();
    };
    const printClose = () => setPrint(false);

    const groups = list ? [...new Set(list.map((o) => o.GROUP))].filter((group) => group !== null).sort() : [];

    const studentList =
        list &&
        list
            .filter((o) => students[o.STUDENT_ID])
            .filter((o) => view === null || o.GROUP === view)
            .map((o) => students[o.STUDENT_ID])
            .sort((a, b) => a.LASTNAME.localeCompare(b.LASTNAME));

    return (
        <Dialog
            fullScreen={fullScreen}
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={timetableId !== null}
            scroll="paper"
        >
            <DialogTitle id="simple-dialog-title">Kursliste</DialogTitle>
            <AppBar position="static" color="default">
                <Tabs
                    value={view}
                    onChange={(e, view) => setView(view)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Alle" value={null} />
                    {groups.map((group) => (
                        <Tab label={`Gruppe ${group}`} value={group} />
                    ))}
                </Tabs>
            </AppBar>
            <DialogContent dividers={true}>
                {loading && <CircularProgress />}
                {!loading && (
                    <StudentList
                        students={students}
                        list={studentList}
                        view={view}
                        fullScreen={fullScreen}
                        onClick={onClick}
                    />
                )}
                <Page open={false} openPrint={print} onPrintClose={printClose} exact={true} horizontal={false}>
                    <div>
                        Kursliste {view && 'Gruppe'} {view}
                    </div>
                    <table>
                        <tr>
                            <th>Nachname</th>
                            <th>Vorname</th>
                        </tr>
                        {studentList &&
                            studentList.map((student) => (
                                <tr>
                                    <td>{student.LASTNAME}</td>
                                    <td>{student.FIRSTNAME}</td>
                                </tr>
                            ))}
                    </table>
                </Page>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setPrint(true)} color="primary">
                    Drucken
                </Button>
                <Button autoFocus onClick={handleClose} color="primary">
                    Schließen
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function StudentList({ list, fullScreen, onClick }) {
    if (!list) return null;
    return (
        <List
            style={{
                minWidth: fullScreen ? 'unset' : 400,
            }}
        >
            {list &&
                list.map((student) => (
                    <ListItem button key={student.STUDENT_ID} onClick={onClick(student.STUDENT_ID)} dense>
                        <ListItemIcon>
                            <UserIcon upn={student.UPN} outline={true} size={32} />
                        </ListItemIcon>
                        <ListItemText primary={`${student.LASTNAME}, ${student.FIRSTNAME}`} />
                    </ListItem>
                ))}
        </List>
    );
}
