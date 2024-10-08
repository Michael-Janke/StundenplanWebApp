import React, { useState, useRef } from 'react';
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
    CircularProgress,
} from '@material-ui/core';
import { UserIcon } from '../../Main/components/Avatars';
import { setTimeTable } from '../../Main/actions';
import { closeStudentList } from '../actions';
import Page from '../Print/page';

export default function ListDialog({ tv = false }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const ref = useRef(null);

    const dispatch = useDispatch();
    const [print, setPrint] = useState(false);

    const { list = [], timetableId, loading, reference } = useSelector(({ studentList }) => studentList);
    const {
        Student: students,
        Class: classes,
        Subject: subjects,
    } = useSelector(({ timetable }) => timetable.masterdata);

    if (!reference) return null;

    const handleClose = () => dispatch(closeStudentList());
    const onClick = (id) => () => {
        dispatch(setTimeTable('student', id));
        handleClose();
    };
    const printClose = () => setPrint(false);

    const studentList =
        list && list.map((o) => students[o.STUDENT_ID]).sort((a, b) => a.LASTNAME.localeCompare(b.LASTNAME));

    const className =
        reference.CLASS_IDS && reference.CLASS_IDS.map((classId) => (classes[classId] || {}).NAME).join(', ');
    const subjectName = (subjects[reference.SUBJECT_ID] || {}).NAME;

    const exportExcel = () => {
        if (!ref.current) return;
        //code splitting
        import(/* webpackChunkName: "table-to-excel" */ '@linways/table-to-excel/dist/tableToExcel')
            .then(({ default: TableToExcel }) => {
                TableToExcel.convert(ref.current, {
                    name: `Kursliste-${className.replace(', ', '')}-${subjectName}.xlsx`,
                    sheet: {
                        name: 'Blatt 1',
                    },
                });
            })
            .catch();
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            onClose={handleClose}
            aria-labelledby="course-list-dialog"
            open={timetableId !== null}
            scroll="paper"
        >
            <DialogTitle id="course-list-dialog">
                Kursliste {className} {subjectName}
            </DialogTitle>
            <DialogContent dividers={true}>
                {loading && <CircularProgress />}
                {!loading && (
                    <StudentList students={students} list={studentList} fullScreen={fullScreen} onClick={onClick} />
                )}
                <Page open={'hidden'} openPrint={print} onPrintClose={printClose} exact={true} horizontal={false}>
                    <table ref={ref}>
                        <tbody>
                            <tr>
                                <th colSpan={4}>
                                    Kursliste {className} {subjectName}
                                </th>
                            </tr>
                            <tr>
                                <th>Nachname</th>
                                <th>Vorname</th>
                                <th>Klasse</th>
                            </tr>
                            {list &&
                                list
                                    .map((o) => ({ ...o, ...students[o.STUDENT_ID] }))
                                    .sort((a, b) => (a.GROUP + a.LASTNAME).localeCompare(b.GROUP + b.LASTNAME))
                                    .map((student) => (
                                        <tr key={student.STUDENT_ID}>
                                            <td>{student.LASTNAME}</td>
                                            <td>{student.FIRSTNAME}</td>
                                            <td>{classes[student.CLASS_ID].NAME}</td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </Page>
            </DialogContent>
            <DialogActions>
                {!fullScreen && !tv && (
                    <>
                        <Button onClick={() => setPrint(true)} color="primary">
                            Drucken
                        </Button>
                        <Button onClick={exportExcel} color="primary">
                            Excel exportieren
                        </Button>
                    </>
                )}
                <Button autoFocus onClick={handleClose} color="secondary">
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
