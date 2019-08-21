import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { grey, indigo } from '@material-ui/core/colors';
import { darken } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height: '100%',
        backgroundColor: darken(indigo[50], theme.palette.type === 'dark' ? 0.6 : 0),
    },
    colorBar: {
        width: '3%',
        marginRight: 5,
        backgroundColor: grey[400],
    }
}), { name: "Lesson" });

export default function Lesson({ children }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.colorBar}></div>
            {children}
        </div>
    );
}