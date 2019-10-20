import React from 'react';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
    root: {
        color: 'white',
        fontWeight: 200,
    },
}));

function CurrentDate({ className }) {
    const classes = useStyles();
    const date = moment().format('DD.MM.');
    const weekday = moment().format('dddd');

    return (
        <Typography variant="h3" className={classNames(classes.root, className)}>
            {date} {weekday}
        </Typography>
    );
}

export default CurrentDate;
