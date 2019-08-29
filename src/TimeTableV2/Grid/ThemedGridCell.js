import React from 'react';
import { makeStyles } from '@material-ui/core';
import GridCell from './GridCell';
import { classNames } from '../../Common/const';

const useStyles = makeStyles(theme => ({
    root: {
        borderBottom: '1px solid rgb(224,224,224)',
        padding: theme.spacing(.5),
    }
}), { name: "ThemedGridCell" });

export default function ThemedGridCell({ children, className, ...other }) {
    const classes = useStyles();
    return (
        <GridCell {...other} className={classNames(classes.root, className)}>
            {children}
        </GridCell>
    )
}