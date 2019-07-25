import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import indigo from '@material-ui/core/colors/indigo';
import moment from 'moment';
import { classNames } from '../../Common/const';
import pink from '@material-ui/core/colors/pink';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        borderRadius: '50%',
        borderWidth: theme.spacing(1),
        borderColor: 'white',
        borderStyle: 'solid',
        boxShadow: theme.shadows[1],
        backgroundColor: indigo[600],
        height: 128,
        width: 128,
        margin: 20,
    },
    pointer: {
        transformOrigin: '0 50%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        borderRadius: theme.spacing(0.5),
        borderWidth: theme.spacing(0.25),
        borderStyle: 'solid',
        backgroundColor: 'white',
    },
    hours: {
        right: '15%',
    },
    minutes: {
        right: '5%',
    },
    seconds: {
        right: '-5%',
        color: pink[600],
        backgroundColor: 'currentColor',
        borderColor: 'currentColor',
        transformOrigin: '16px 50%',
        '&:before': {
            content: '""',

            borderRadius: '50%',
            borderStyle: 'solid',
            borderWidth: 6,
            borderColor: 'currentColor',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            top: '50%',
            left: 14,
        },
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
    const minute = t.minutes();
    const hours = t.hours();
    const seconds = t.seconds();

    var secAngle = 360 * (seconds / 60);
    // first workout the minute angle
    var minAngle = 360 * (minute / 60) + (360 / 60) * (seconds / 60);
    // then work out hour angle
    // first the hour then the hour + mins
    var hourAngle = 360 * (hours / 12) + (360 / 12) * (minute / 60);

    const secondsStyle = {
        transform: `translate(-16px, -50%) rotate(${secAngle - 90}deg)`,
    };
    const hoursStyle = {
        transform: `translate(0, -50%) rotate(${hourAngle - 90}deg)`,
    };
    const minutesStyle = {
        transform: `translate(0, -50%) rotate(${minAngle - 90}deg)`,
    };
    return (
        <div className={classNames(className, classes.root)}>
            <div className={classNames(classes.pointer, classes.hours)} style={hoursStyle} />
            <div className={classNames(classes.pointer, classes.minutes)} style={minutesStyle} />
            <div className={classNames(classes.pointer, classes.seconds)} style={secondsStyle} />
        </div>
    );
}

export default Clock;
