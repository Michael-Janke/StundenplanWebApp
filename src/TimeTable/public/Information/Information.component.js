import React from 'react';
import { makeStyles } from '@material-ui/styles';
import StructureSnapshot from './StructureSnapshot';
import { Typography } from '@material-ui/core';

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
        padding: `0 ${theme.spacing(1)}px`,
    },
    content: {
        padding: theme.spacing(1),
        flex: 1,
    },
}));

function InformationComponent({
    lessons,
    absentClasses,
    studentsInSchool,
    teachersInSchool,
    period,
    getAllTimetable,
    date,
}) {
    const classes = useStyles();
    React.useEffect(() => {
        if (!lessons) {
            getAllTimetable(date);
        }
    }, [lessons, getAllTimetable, date]);
    if (!lessons || !period) {
        return null;
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h5">Raumübersicht</Typography>
                <Typography variant="caption">{period.PERIOD_TIME_ID - 1 || 0}. Stunde</Typography>
            </div>
            <div className={classes.padding}>
                <Typography variant="body2" component="div">
                    <b>{studentsInSchool}</b> Schüler werden von <b>{teachersInSchool}</b> Lehrern unterrichtet, absente
                    Klassen: <b>{Array.from(new Set(absentClasses.map(absence => absence.class.NAME))).join(', ')}</b>
                </Typography>
            </div>
            <div className={classes.content}>
                <StructureSnapshot lessons={lessons}></StructureSnapshot>
            </div>
        </div>
    );
}

export default React.memo(InformationComponent);
