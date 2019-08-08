import React from 'react';
import { makeStyles } from '@material-ui/styles';
import StructureSnapshot from './StructureSnapshot';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import InfoIcon from '@material-ui/icons/Info';


const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
    padding: {
        padding: theme.spacing(1),
    },
    content: {
        padding: theme.spacing(1),
        flex: 1,
    }
}));


function InformationComponent({ timetable, period, getAllTimetable, date }) {
    const classes = useStyles();
    React.useEffect(() => {
        if (!timetable) {
            getAllTimetable(date);
        }
    }, [timetable, getAllTimetable, date])
    if (!timetable || !period) {
        return null;
    }
    let periods = timetable[moment(date).weekday()];
    let lessons = periods.periods[period.PERIOD_TIME_ID - 1].lessons;
    const studentsInSchool = lessons.reduce((prev, current) => {
        return prev + (current ? ((current.reference && current.reference.STUDENT_COUNT) || 0) : 0);
    }, 0)
    const teachersInSchool = lessons.reduce((prev, current) => {
        return prev + (current ? ((current.teachers && current.teachers.new.length) || 0) : 0);
    }, 0);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h5">Raumübersicht</Typography>
                <Typography variant="caption">{period.PERIOD_TIME_ID - 1}. Stunde</Typography>
            </div>
            <div className={classes.content}>
                <StructureSnapshot lessons={lessons}></StructureSnapshot>
            </div>
            <div className={classes.padding}>
                <Typography variant="body2">
                    <InfoIcon fontSize="inherit"/> Momentan werden <b>{studentsInSchool}</b> Schüler von <b>{teachersInSchool}</b> Lehrern unterrichtet.
                </Typography>
            </div>
        </div>
    );
}

export default React.memo(InformationComponent);