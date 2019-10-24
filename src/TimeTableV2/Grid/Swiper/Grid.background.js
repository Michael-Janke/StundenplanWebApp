import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import ThemedGridCell from '../ThemedGridCell';
import { animated } from 'react-spring'
import { useMeasureCallback } from './helpers';
import GridCell from '../GridCell';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    }
}), { name: "GridPeriods" });

export default function GridPeriods({ rows, periodsCellArray }) {
    const classes = useStyles();
    return (
        <Paper elevation={0} className={classes.root}>
            {rows.map((row, i) => (
                <ThemedGridCell
                    key={-i}
                    Component={animated.div}
                    style={{
                        height: periodsCellArray[i].height,
                        boxSizing: 'border-box',
                    }}
                >
                    <row.swipeComponent
                        row={row}
                        GetHeightComponent={RowComponent}
                        width={periodsCellArray[i].width}
                        GridCellComponent={GridCell}
                    ></row.swipeComponent>
                </ThemedGridCell>
            ))}
        </Paper>
    );
}


function RowComponent({ row, children }) {
    const [bind] = useMeasureCallback(({ height }) => {
        if (row.backgroundHeight !== height) {
            row.backgroundHeight = height + 1;
            if (row.listeners) {
                row.listeners.forEach(c => c())
            }
        }
    });
    return (
        <div {...bind} style={{display: 'flex'}}>
            {children}
        </div>
    )
}