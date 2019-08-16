import React from 'react';
import { makeStyles, Typography, Paper } from '@material-ui/core';
import { classNames } from '../../../Common/const';
import DepartureBoard from '@material-ui/icons/DepartureBoard';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        padding: theme.spacing(.5),
        margin: theme.spacing(.5),
        flex: '1 0 0',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        flexGrow: 1,
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flex: 1,
    }
}), { name: 'Station' });

export default function Station({ name, children, className }) {
    const classes = useStyles();
    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length % 2 === 0) {
        childrenArray.splice(childrenArray.length - 1, 1);
    }
    const moreArray = [];
    for (let i = 1; i < childrenArray.length; i += 2) {
        moreArray.push(
            <div className={classes.column}>
                {childrenArray[i]}
                {childrenArray[i + 1]}
            </div>
        );
    }

    return (
        <Paper elevation={0} className={classNames(classes.root, className)} square>
            <div className={classes.header}>
                <Typography variant="h6" color="textPrimary" gutterBottom align="center" display="inline">
                    <DepartureBoard /> 
                    {" " + name}
                </Typography>
                <div className={classes.column}>
                    {childrenArray[0]}
                </div>
            </div>
            <div className={classes.content}>
                {moreArray}
            </div>
        </Paper>
    )
}