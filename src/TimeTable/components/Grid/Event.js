import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { indigo } from '@material-ui/core/colors';
import { darken } from '@material-ui/core/styles';
import moment from 'moment';
import classnames from 'classnames';

const useStyle = makeStyles((theme) => ({
    event: {
        overflow: 'hidden',
        backgroundColor: darken(indigo[50], theme.palette.type === 'dark' ? 0.6 : 0),
        display: 'flex',
        flex: 1,
        height: 'auto',
    },
    clickable: {
        cursor: 'pointer',
    },
    text: {
        flex: 1,
        fontSize: '70%',
        overflow: 'hidden',
        wordBreak: 'break-word',
        padding: 2,
    },
    name: {
        fontWeight: 600,
    },
    time: {
        fontSize: '80%',
    },
    subject: {
        fontSize: '80%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    colorBar: {
        width: 3,
        marginRight: 5,
        backgroundColor: indigo[100],
    },
    active: {
        backgroundColor: indigo[200],
        animationName: '$color',
        animationDuration: '2s',
        animationIterationCount: 'infinite',
    },

    '@keyframes color': {
        '0%': {
            backgroundColor: indigo[100],
        },
        '50%': {
            backgroundColor: indigo[50],
        },
        '100%': {
            backgroundColor: indigo[100],
        },
    },
}));

const Event = ({ event }) => {
    const classes = useStyle();
    const time =
        moment.utc(event.start.dateTime).local().format('HH:mm') +
        ' - ' +
        moment.utc(event.end.dateTime).local().format('HH:mm');

    const now = moment().isBetween(moment.utc(event.start.dateTime), moment.utc(event.end.dateTime));

    return (
        <div
            className={classnames({
                [classes.event]: true,
                [classes.active]: now,
                [classes.clickable]: event.onlineMeeting,
            })}
            onClick={() => event.onlineMeeting && window.open(event.onlineMeeting.joinUrl, '_blank')}
        >
            <div className={classes.colorBar} />
            <div className={classes.text}>
                <div className={classes.name}>{event.organizer ? event.organizer.emailAddress.name : event.name}</div>
                <div className={classes.time}>{time}</div>
                <div className={classes.subject}>{event.subject}</div>
            </div>
        </div>
    );
};

export default Event;
