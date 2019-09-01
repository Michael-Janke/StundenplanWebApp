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
        gridTemplateColumns: props => `70px repeat(${props.columns},1fr)`,
        gridTemplateRows: props => `repeat(${props.rows},auto)`,
        gridAutoFlow: 'column',
    }
}), { name: "GridComponent" });

export default function GridComponent({ timetable, periods, type, children, GridCellComponent }) {

    const weekDays = [0, 1, 2, 3, 4];
    const periodArray = Object.values(periods);
    const classes = useStyles({
        rows: periodArray.length || 10,
        columns: weekDays.length || 5
    });
    if (!timetable) {
        return null;
    }
    return (
        <div className={classes.root}>
            {children}
            {weekDays.map((day) => {
                const dayObject = timetable && timetable[day];
                return (
                    <React.Fragment key={day}>
                        {periodArray.map((period, i) => {
                            const periodNumber = period.PERIOD_TIME_ID - 1;
                            if (!dayObject) {
                                return (
                                    <GridCellComponent>
                                        {periodNumber >= 1 && periodNumber < (9 - (day * 2) % 3) &&
                                            <Lesson></Lesson>
                                        }
                                    </GridCellComponent>
                                )
                            }
                            const periodObject = dayObject.periods[periodNumber];
                            if (!periodObject) {
                                // empty cell
                                return (
                                    null
                                )
                            }
                            return (
                                <LessonCell
                                    GridCellComponent={GridCellComponent}
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

        </div>
    )
}