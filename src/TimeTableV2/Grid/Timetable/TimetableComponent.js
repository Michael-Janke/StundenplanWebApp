import React from 'react';
import { makeStyles } from '@material-ui/core';
import Lesson from '../../Lesson/Lesson';
import LessonCell from '../LessonCell';
import HeaderCell from '../HeaderCell';

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'grid',
            gridTemplateRows: props => `repeat(${props.rows},auto)`,
            gridAutoFlow: 'column',
            [theme.breakpoints.down('sm')]: {
                gridTemplateColumns: props => `20px repeat(${props.columns},1fr)`,
            },
            [theme.breakpoints.up('sm')]: {
                gridTemplateColumns: props => `70px repeat(${props.columns},1fr)`,
            },
        },
    }),
    { name: 'GridComponent' }
);

export default function GridComponent({ children, rows, timetable, type, GridCellComponent, index }) {
    function Period(row, dayObject, day) {
        const period = row.period;
        const periodNumber = period.PERIOD_TIME_ID - 1;
        if (!dayObject || !dayObject.periods) {
            return (
                <LessonCell key={row.key} GridCellComponent={GridCellComponent}>
                    {periodNumber >= 1 && periodNumber < 9 - ((day * 2) % 3) && <Lesson></Lesson>}
                </LessonCell>
            );
        }
        const periodObject = dayObject.periods[periodNumber];
        if (!periodObject) {
            // empty cell
            return null;
        }
        return (
            <LessonCell
                GridCellComponent={GridCellComponent}
                rowspan={(periodObject.skip || 0) + 1}
                lessons={periodObject.lessons}
                type={type}
                key={row.key}
            />
        );
    }

    function Header(row, dayObject, day) {
        if (!dayObject) {
            return <GridCellComponent key={row.key}></GridCellComponent>;
        }
        return <HeaderCell key={row.key} date={dayObject.date} GridCellComponent={GridCellComponent}></HeaderCell>;
    }

    console.log(timetable);
    const weekDays = [0, 1, 2, 3, 4];
    const classes = useStyles({
        rows: rows.length || 10,
        columns: weekDays.length || 5,
    });
    return (
        <div className={classes.root}>
            {children}
            {weekDays.map(day => {
                const dayObject = timetable && timetable[day];
                return (
                    <React.Fragment key={day}>
                        {rows.map((row, i) => {
                            switch (row.type) {
                                case 'header':
                                    return Header(row, dayObject, day);
                                case 'main':
                                    return Period(row, dayObject, day);
                                default:
                            }
                            return <GridCellComponent key={row.key}></GridCellComponent>;
                        })}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
