import React from 'react';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import { classNames } from '../../Common/const';

const useStyles = makeStyles(theme => ({
    root: {
        color: 'white',
    },
}));

function CurrentDate({ className }) {
    const classes = useStyles();
    const date = moment().format('DD.MM.YYYY');

    return (
        <Typography variant="h4" className={classNames(classes.root, className)}>
            {date}
        </Typography>
    );
}

export default CurrentDate;
