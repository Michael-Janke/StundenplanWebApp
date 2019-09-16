import React from 'react';
import { makeStyles } from '@material-ui/core';
import Lesson from '../../Lesson/Lesson';
import LessonCell from '../LessonCell';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: props => `70px repeat(${props.columns},1fr)`,
        gridTemplateRows: props => `repeat(${props.rows},auto)`,
        gridAutoFlow: 'column',
    }
}), { name: "GridComponent" });

export default function GridComponent({ children, rows, timetable, type, GridCellComponent, index, renderRow }) {


    const weekDays = [0, 1, 2, 3, 4];
    const classes = useStyles({
        rows: rows.length || 10,
        columns: weekDays.length || 5
    });
    return (
        <div className={classes.root}>
            {children}
            {weekDays.map((day) => {
                const dayObject = timetable && timetable[day];
                return (
                    <React.Fragment key={day}>
                        {rows.map((row, i) => {
                            const period = row.period;
                            const periodNumber = period.PERIOD_TIME_ID - 1;
                            if (!dayObject || !dayObject.periods) {
                                return (
                                    <GridCellComponent key={i}>
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
