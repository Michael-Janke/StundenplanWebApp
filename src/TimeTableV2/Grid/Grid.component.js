import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { WEEKDAY_NAMES } from '../../Common/const';
import LessonCell from './LessonCell';
import PeriodCell from './PeriodCell';
import ThemedGridCell from './ThemedGridCell';
import Lesson from '../Lesson/Lesson';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '70px repeat(5,1fr)',
        gridTemplateRows: 'repeat(10,auto)',
    }
}));

export default function GridComponent({ timetable, periods, type }) {
    const classes = useStyles();
    return (
        <Paper elevation={0} className={classes.root}>
            {Object.values(periods).map((period, i) => {
                const periodNumber = period.PERIOD_TIME_ID - 1;
                return (
                    <React.Fragment key={i}>
                        <PeriodCell period={period}></PeriodCell>
                        {WEEKDAY_NAMES.map((name, i) => {
                            const day = i;
                            if (!timetable) {
                                return (
                                    <ThemedGridCell>
                                        {periodNumber >= 1 && periodNumber < (9 - (day * 2) % 3) &&
                                            <Lesson></Lesson>
                                        }
                                    </ThemedGridCell>
                                )
                            }
                            const dayObject = timetable[day];
                            const periodObject = dayObject.periods[periodNumber];
                            if (!periodObject) {
                                // empty cell
                                return (
                                    null
                                )
                            }
                            return (
                                <LessonCell
                                    key={i}
                                    rowspan={(periodObject.skip || 0) + 1}
                                    lessons={periodObject.lessons}
                                    type={type}
                                />
                            )
                        })}
                    </React.Fragment>
                )
            })}
        </Paper>
    )
}