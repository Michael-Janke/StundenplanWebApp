import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import { classNames } from '../../Common/const';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.unit,
    },
    time: {
        color: 'white',
        fontWeight: 200,
    },
    seconds: {
        padding: theme.spacing.unit * 2,
        color: 'rgba(255,255,255,0.7)',
    },
}));

function Clock({ className }) {
    const classes = useStyles();
    const [time, setTime] = useState(() => +new Date());
    useEffect(() => {
        const interval = setInterval(() => setTime(+new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const t = moment(time);
    const minute = t.format('mm');
    const hours = t.format('HH');
    const seconds = t.format('ss');

    return (
        <div className={classNames(className, classes.root)}>
            <Typography component="span" variant="h3" className={classes.time}>
                {hours}:{minute}
            </Typography>
            <Typography component="span" variant="h5" className={classes.seconds}>
                {seconds}
            </Typography>
        </div>
    );
}

export default Clock;
