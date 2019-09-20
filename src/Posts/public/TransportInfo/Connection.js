import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box, Typography } from '@material-ui/core';
import DirectionsBus from '@material-ui/icons/DirectionsBus';
import DirectionsTransit from '@material-ui/icons/DirectionsTransit';
import DirectionsRailway from '@material-ui/icons/DirectionsRailway';
import { green, red, lightBlue, deepOrange, grey } from '@material-ui/core/colors';
import classNames from 'classnames';
import moment from 'moment';

const ICON_MAP = {
    bus: DirectionsBus,
    rb: DirectionsTransit,
    re: DirectionsRailway,
};

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderColor: grey[200],
            borderWidth: 1,
            borderStyle: 'solid',
        },
        type: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            oveflow: 'hidden',
            color: 'white',
            width: 40,
            padding: theme.spacing(1),
        },
        direction: {
            textAlign: 'left',
            padding: theme.spacing(1),
            flex: 1,
            width: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        time: {
            textAlign: 'right',
            padding: theme.spacing(1),
        },
        re: {
            backgroundColor: red[900],
        },
        rb: {
            backgroundColor: deepOrange[900],
        },
        bus: {
            backgroundColor: lightBlue[900],
        },
        realtime: {
            color: red[700],
        },
    }),
    { name: 'Connection' }
);

export default function Connection({ connection }) {
    const classes = useStyles();
    let [match, type, line] = connection.name.match(/(\w+)\s+(\w+)/);
    let Icon = ICON_MAP[type.toLowerCase()] || ICON_MAP.bus;
    const rt_info = connection.rt_info;
    const time = moment(connection.time, 'HH:mm');
    const rtTime = moment(rt_info.time || connection.time, 'HH:mm');
    const fromNow = Math.max(0, Math.floor(time.diff(moment()) / 1000 / 60)); //minutes
    const rtFromNow = Math.max(0, Math.floor(rtTime.diff(moment()) / 1000 / 60)); //minutes
    const rtDiff = rtFromNow - fromNow;
    const rtDiffText = rtDiffText > 3 ? `(+${rtDiff})` : '';
    return (
        <Box className={classes.root}>
            <div className={classNames(classes.type, classes[type.toLowerCase()])}>
                <Icon />
                <Typography variant="caption">{line}</Typography>
            </div>

            <div className={classes.direction}>
                {connection.direction.split(',').map(line => (
                    <div>{line}</div>
                ))}
            </div>

            <div className={classes.time}>
                <Typography variant="body1">
                    {['jetzt ' + rtDiffText, 'in einer Minute ' + rtDiffText][fromNow] ||
                        `in ${fromNow} ${rtDiffText} Minuten`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {time.format('HH:mm')}
                    {rt_info.time && rt_info.time !== connection.time && (
                        <span className={classes.realtime}> > {rt_info.time}</span>
                    )}
                </Typography>
            </div>
        </Box>
    );
}
