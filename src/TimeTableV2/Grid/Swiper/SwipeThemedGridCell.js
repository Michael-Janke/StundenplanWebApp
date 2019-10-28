import React from 'react';
import { makeStyles } from '@material-ui/core';
import GridCell from '../GridCell';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        marginBottom: 1,
        overflow: 'hidden',
    }
}), { name: "SwipeThemedGridCell" });

export default function SwipeThemedGridCell({ children, className, ...other }) {
    const classes = useStyles();
    return (
        <GridCell {...other} className={classNames(classes.root, className)}>
            {children}
        </GridCell>
    );
}