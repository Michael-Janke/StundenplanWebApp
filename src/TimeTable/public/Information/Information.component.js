import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import StructureSnapshot from './StructureSnapshot';
import { Typography, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
    },
    padding: {
        padding: `0 ${theme.spacing(1)}px`,
    },
    content: {
        padding: theme.spacing(1),
        flex: 1,
    },
}));

const breakMap = {
    '2': 'Frühaufsicht',
    '4': 'Frühstückspause',
    '6': '1. Mittagspause',
    '7': '2. Mittagspause',
    '8': '1. Busaufsicht',
    '10': '2. Busaufsicht',
};

function InformationComponent({
    lessons,
    absentClasses,
    studentsInSchool,
    teachersInSchool,
    period,
    getAllTimetable,
    loadSupervisions,
    date,
    supervisions = {},
    counter,
}) {
    const classes = useStyles();
    useEffect(() => {
        if (!lessons) {
            getAllTimetable(date);
        }
    }, [lessons, getAllTimetable, date, counter]);

    useEffect(() => {
        loadSupervisions();
    }, [counter, date, loadSupervisions]);

    if (!lessons || !period) {
        return null;
    }
    const periodNumber = period.PERIOD_TIME_ID || 1;

    return (
        <div className={classes.root}>
            <ListItem className={classes.header}>
                <ListItemIcon>
                    <ApartmentIcon />
                </ListItemIcon>
                <ListItemText>Raumübersicht {periodNumber - 1}. Stunde</ListItemText>
            </ListItem>
            <div className={classes.padding}>
                <Typography variant="body2" component="div">
                    <b>{studentsInSchool}</b> Schüler werden von <b>{teachersInSchool}</b> Lehrern unterrichtet.
                </Typography>
                {!!absentClasses.length && (
                    <Typography variant="body2" component="div">
                        Absente Klassen:{' '}
                        <b>{Array.from(new Set(absentClasses.map(absence => absence.class.NAME))).join(', ')}</b>
                    </Typography>
                )}
                {Object.values(supervisions).length > 0 && (
                    <Typography variant="body2" component="div">
                        Fehlende Aufsichten heute:{' '}
                        {Object.keys(supervisions).map(period => (
                            <>
                                <b>{(breakMap[period] || period) + ': '}</b>
                                {supervisions[period].join(', ')}{' '}
                            </>
                        ))}
                    </Typography>
                )}
            </div>
            <div className={classes.content}>
                <StructureSnapshot lessons={lessons}></StructureSnapshot>
            </div>
        </div>
    );
}

export default React.memo(InformationComponent);
