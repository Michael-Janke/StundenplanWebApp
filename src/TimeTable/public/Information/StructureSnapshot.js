import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import StructureFragment from './StructureFragment';
import classNames from 'classnames';
import green from '@material-ui/core/colors/green';
import { getRoomFields, styles } from '../../Fields';

const buildingStructure = [
    {
        name: 'E',
        rooms: ['E01', 'E02', 'E03', null, null, null, 'E06', 'E07', 'E08'],
    },
    {
        name: 'D',
        rooms: ['D01', 'D02', 'D03', 'D12', 'D09', 'D10', 'D06', 'D07', 'D08'],
    },
    {
        name: 'C',
        rooms: ['C01', null, null, 'C11', null, 'C10', null, null, 'C08'],
    },
    {
        name: 'B',
        rooms: ['B01', 'B02', 'B03', 'B11', null, 'B10', 'B06', 'B07', 'B08'],
    },
    {
        name: 'A',
        rooms: ['TH1', 'TH2', null, 'A07', 'A09', null, null, null, null],
    },
];

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    etage: {
        display: 'flex',
        height: '100%',
    },
    room: {
        boxShadow: theme.shadows[1],
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        fontSize: 14,
    },
    text: {
        fontSize: 10,
    },
    occupied: {
        boxShadow: theme.shadows[1],
        backgroundColor: theme.palette.background.paper,
    },
    free: {
        backgroundColor: green[600],
        boxShadow: theme.shadows[1],
    },
    ...styles(theme),
}));

export default function StructureSnapshot({ lessons }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {buildingStructure.map((etage, i) => {
                return (
                    <div className={classes.etage} key={i}>
                        {etage.rooms.map((room, i) => {
                            if (room === 'stairs' || !room) {
                                return <StructureFragment key={i} />;
                            }
                            let lesson = lessons.find(lesson =>
                                lesson.room
                                    ? lesson.room.new
                                        ? lesson.room.new.NAME === room
                                        : lesson.room.NAME === room
                                    : false
                            );
                            const fields = !lesson || lesson.ABSENCE_ID ? null : getRoomFields(lesson).fields;
                            if (fields) {
                                var [Field1, Field2, Field3] = fields.new;
                            }
                            return (
                                <StructureFragment
                                    className={classNames(lesson ? classes.occupied : classes.free)}
                                    key={i}
                                    room={room}
                                >
                                    <Typography variant="h6" className={classes.title} component="p">
                                        {room}
                                    </Typography>
                                    {lesson && fields && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <Field1 themeClasses={classes} />
                                            <Field2 themeClasses={classes} />
                                            <Field3 themeClasses={classes} />
                                        </div>
                                    )}
                                    {lesson && lesson.ABSENCE_ID && (
                                        <Typography variant="caption" className={classes.text} component="p">
                                            {lesson.TEXT}
                                        </Typography>
                                    )}
                                </StructureFragment>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
