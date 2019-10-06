import React from 'react';
import { makeStyles } from '@material-ui/core';
import { classNames } from '../../../Common/const';

const useStyles = makeStyles(theme => ({
    root: {
        padding: 4,
        flexGrow: 1,
        flexBasis: 0,
        margin: 2,
        textAlign: 'left',
        overflow: 'hidden',
    },
}));

export default function StructureFragment({ children, className }) {
    const classes = useStyles();
    return <div className={classNames(classes.root, className)}>{children}</div>;
}
