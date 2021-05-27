import React from 'react';
import { makeStyles } from '@material-ui/styles';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles((theme) => ({
    '@keyframes glow': {
        from: { opacity: 0.4 },
        to: { opacity: 0.9 },
    },
    root: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        paddingRight: '1vmin',
        flexDirection: 'row',
        backgroundColor: grey[theme.palette.type === 'dark' ? 800 : 200],
        opacity: 0.4,
        minHeight: 48,
        animation: '$glow 750ms ease infinite alternate',
    },
    colorBar: {
        width: '3%',
        marginRight: 5,
        backgroundColor: grey[400],
    },
}));

export default function OfflineLesson({ day, periodNumber }) {
    const classes = useStyles();
    return (
        <div className={classes.root} style={{ animationDelay: (periodNumber + day / 2) * 100 + 'ms' }}>
            <div className={classes.colorBar} />
        </div>
    );
}
