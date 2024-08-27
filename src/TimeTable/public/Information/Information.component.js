import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import BackIcon from '@material-ui/icons/ArrowBack';
import NextIcon from '@material-ui/icons/ArrowForward';
import ResetIcon from '@material-ui/icons/ArrowDownward';
import {
    Typography,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
} from '@material-ui/core';
import ApartmentIcon from '@material-ui/icons/Apartment';
import grey from '@material-ui/core/colors/grey';

import StructureSnapshot from './StructureSnapshot';
const useStyles = makeStyles((theme) => ({
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
    1: 'Frühaufsicht',
    3: 'Frühstückspause',
    5: '1. Mittagspause',
    6: '2. Mittagspause',
    7: '1. Busaufsicht',
    9: '2. Busaufsicht',
};

function InformationComponent({
    substitutions = {},
    currentPeriod,
    getAllTimetable,
    loadSupervisions,
    date,
    supervisions = {},
    counter,
}) {
    const classes = useStyles();
    const [period, setPeriod] = useState((currentPeriod || {}).PERIOD_TIME_ID || 0);
    const { lessons, absentClasses, studentsInSchool, teachersInSchool } = substitutions[period] || {};
    const currentPeriodNumber = (currentPeriod || {}).PERIOD_TIME_ID - 1 || 1;

    useEffect(() => {
        getAllTimetable(date);
    }, [getAllTimetable, date, counter]);

    useEffect(() => {
        loadSupervisions();
    }, [counter, date, loadSupervisions]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPeriod(currentPeriodNumber);
        }, 10000);
        return () => clearTimeout(timer);
    }, [period, currentPeriodNumber]);

    return (
        <div className={classes.root}>
            <ListItem className={classes.header} ContainerComponent="div">
                <ListItemIcon>
                    <ApartmentIcon />
                </ListItemIcon>
                <ListItemText>Raumübersicht {period + 1}. Stunde</ListItemText>
                <ListItemSecondaryAction>
                    <IconButton disabled={period <= 0} onClick={() => setPeriod((period) => period - 1)}>
                        <BackIcon />
                    </IconButton>
                    <IconButton
                        disabled={!currentPeriod || !currentPeriod.PERIOD_TIME_ID}
                        onClick={() => setPeriod(currentPeriodNumber)}
                    >
                        <ResetIcon />
                    </IconButton>
                    <IconButton
                        disabled={period >= Math.max(...Object.keys(substitutions))}
                        onClick={() => setPeriod((period) => period + 1)}
                    >
                        <NextIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <div className={classes.padding}>
                <Typography variant="body2" component="div">
                    <b>{studentsInSchool}</b> Schüler werden von <b>{teachersInSchool}</b> Lehrern unterrichtet.
                </Typography>
                {absentClasses && !!absentClasses.length && (
                    <Typography variant="body2" component="div">
                        Absente Klassen:{' '}
                        <b>{Array.from(new Set(absentClasses.map((absence) => absence.class.NAME))).join(', ')}</b>
                    </Typography>
                )}
                {Object.values(supervisions).length > 0 && (
                    <Typography variant="body2" component="div">
                        Fehlende Aufsichten heute:{' '}
                        {Object.keys(supervisions).map((period) => (
                            <>
                                <b>{(breakMap[period] || period) + ': '}</b>
                                {supervisions[period].join(', ')}{' '}
                            </>
                        ))}
                    </Typography>
                )}
            </div>
            <div className={classes.content}>
                {lessons && <StructureSnapshot lessons={lessons}></StructureSnapshot>}
            </div>
        </div>
    );
}

export default React.memo(InformationComponent);
