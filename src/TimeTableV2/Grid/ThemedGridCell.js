import React from 'react';
import { makeStyles } from '@material-ui/core';
import GridCell from './GridCell';

const useStyles = makeStyles(theme => ({
    root: {
        borderBottom: '1px solid rgb(224,224,224)',
        padding: theme.spacing(.5),
    }
}), { name: "ThemedGridCell" });

export default function ThemedGridCell({ children, ...other }) {
    const classes = useStyles();
    return (
        <GridCell {...other} className={classes.root}>
            {children}
        </GridCell>
    )
}