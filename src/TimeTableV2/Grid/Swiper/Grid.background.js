import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import ThemedGridCell from '../ThemedGridCell';
import { animated } from 'react-spring'
import { useMeasureCallback } from './helpers';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: props => `70px 1fr`,
        gridTemplateRows: props => `repeat(${props.rows},auto)`,
        gridAutoFlow: 'column',
    }
}), { name: "GridPeriods" });

export default function GridPeriods({ rows, periodsCellArray }) {
    const classes = useStyles({
        rows: rows.length,
    });
    return (
        <Paper elevation={0} className={classes.root}>
            {rows.map((row, i) => <RowComponent row={row}></RowComponent>)}
            {rows.map((row, i) => <ThemedGridCell
                key={-i}
                Component={animated.div}
                style={{
                    minHeight: periodsCellArray[i].height,
                    willChange: 'height',
                    boxSizing: 'border-box',
                }}></ThemedGridCell>)}
        </Paper>
    )
}

function RowComponent({ row }) {
    const [bind] = useMeasureCallback(({ height }) => {
        if (row.backgroundHeight !== height) {
            row.backgroundHeight = height + 1;
            row.listeners.forEach(c => c())
        }
    });
    return (
        <ThemedGridCell>
            <div {...bind}>
                <row.component {...row}></row.component>
            </div>
        </ThemedGridCell>
    )
}