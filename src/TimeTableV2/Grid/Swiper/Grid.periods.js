import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import PeriodCell from '../PeriodCell';
import ThemedGridCell from '../ThemedGridCell';
import { animated } from 'react-spring'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: props => `70px 1fr`,
        gridTemplateRows: props => `repeat(${props.rows},auto)`,
        gridAutoFlow: 'column',
    }
}), { name: "GridPeriods" });

export default function GridPeriods({ periods, periodsCellArray }) {

    const weekDays = [0, 1, 2, 3, 4];
    const periodArray = Object.values(periods);
    const classes = useStyles({
        rows: periodArray.length || 10,
        columns: weekDays.length || 5
    });
    return (
        <Paper elevation={0} className={classes.root}>
            {periodArray.map((period, i) => <PeriodCell period={period} key={i}></PeriodCell>)}
            {periodArray.map((period, i) => <ThemedGridCell
                key={-i}
                Component={animated.div}
                style={{
                    height: periodsCellArray[i].height
                }}></ThemedGridCell>)}
        </Paper>
    )
}