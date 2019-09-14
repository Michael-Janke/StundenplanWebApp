import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import StructureFragment from './StructureFragment';
import { classNames } from '../../../Common/const';
import green from '@material-ui/core/colors/green';
import { getRoomFields, styles } from '../../Fields';


const buildingStructure = [
    {
        name: "E",
        rooms: [
            "E01",
            "stairs",
            "E02",
            "E03",
            null,
            null,
            null,
            null,
            "E06",
            "E07",
            "stairs",
            "E08",
        ],
    },
    {
        name: "D",
        rooms: [
            "D01",
            "stairs",
            "D02",
            "D03",
            "D09",
            "stairs",
            "D12",
            "D10",
            "D06",
            "D07",
            "stairs",
            "D08",
        ],
    },
    {
        name: "C",
        rooms: [
            "C01",
            "stairs",
            null,
            null,
            "C10",
            "stairs",
            null,
            "C11",
            null,
            null,
            "stairs",
            "C08",
        ],
    },
    {
        name: "B",
        rooms: [
            "B01",
            "stairs",
            "B02",
            "B03",
            "B10",
            "stairs",
            null,
            "B11",
            "B06",
            "B07",
            "stairs",
            "B08",
        ],
    },
    {
        name: "A",
        rooms: [
            "TH1",
            "TH2",
            null,
            null,
            "A09",
            "stairs",
            "A07",
            null,
            null,
            null,
            null,
            null,
        ],
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
    ...styles(theme)
}));

export default function StructureSnapshot({ lessons }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {buildingStructure.map((etage, i) => {
                return (
                    <div className={classes.etage} key={i}>
                        {etage.rooms.map((room, i) => {
                            if (room === 'stairs') {
                                return (
                                    <StructureFragment key={i}>
                                    </StructureFragment>
                                );
                            }
                            if (!room) {
                                return (
                                    <StructureFragment key={i} />
                                )
                            }
                            let lesson = lessons.find(lesson => lesson.room ?
                                (lesson.room.new ? lesson.room.new.NAME === room
                                    : lesson.room.NAME === room) : false);
                            const fields = (!lesson || lesson.ABSENCE_ID) ? null : getRoomFields(lesson).fields;
                            if (fields) {
                                var [Field1, Field2, Field3] = fields.new;
                            }
                            return (
                                <StructureFragment
                                    className={classNames(lesson ? classes.occupied : classes.free)}
                                    key={i}>
                                    <Typography variant="h6" className={classes.title} component="p">
                                        {room}
                                    </Typography>
                                    {lesson && fields &&
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Field1 themeClasses={classes} />
                                                <Field2 themeClasses={classes} />
                                            </div>
                                            <Field3 themeClasses={classes} />


                                        </>
                                    }
                                    {lesson && lesson.ABSENCE_ID &&
                                        <Typography variant="caption" className={classes.text} component="p">
                                            {lesson.TEXT}
                                        </Typography>}
                                </StructureFragment>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}