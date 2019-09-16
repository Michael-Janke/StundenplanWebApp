import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
        height: '100%',
        width: '100%',

    }
}), { name: "HeaderBackground" });

export default function HeaderBackground({ row }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>

        </div>
    );
}