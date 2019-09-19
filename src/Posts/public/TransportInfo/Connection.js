import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Paper, Typography } from '@material-ui/core';
import DirectionsBus from '@material-ui/icons/DirectionsBus';
import DirectionsTransit from '@material-ui/icons/DirectionsTransit';
import DirectionsRailway from '@material-ui/icons/DirectionsRailway';

const ICON_MAP = {
    '(Bus)\\w*(.*)': DirectionsBus,
    '(RB)\\w*(.*)': DirectionsTransit,
    '(RE)\\w*(.*)': DirectionsRailway,
    '(.*)': DirectionsBus,
};

const ICON_ARRAY = Object.entries(ICON_MAP);

const useStyles = makeStyles(
    theme => ({
        root: {
            margin: theme.spacing(1),
            minWidth: 0,
            flex: '1 0 0',
            display: 'flex',
        },
        headerContent: {
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            oveflow: 'hidden',
        },
        icon: {
            marginRight: theme.spacing(1),
            color: theme.palette.text.secondary,
        },
        header: {
            borderRight: `2px solid ${theme.palette.divider}`,
            padding: `0 ${theme.spacing(1)}px`,
            margin: `${theme.spacing(1)}px 0`,
            display: 'flex',
            overflow: 'hidden',
        },
        content: {
            padding: `0 ${theme.spacing(1)}px`,
            margin: `${theme.spacing(1)}px 0`,
            overflow: 'hidden',
            flexGrow: 1,
        },
    }),
    { name: 'Connection' }
);

export default function Connection({ connection }) {
    const classes = useStyles();
    let name = connection.name;
    name = name.replace(/\([0-9]+\)/g, '');
    let Icon;
    let type;
    for (let i = 0; i < ICON_ARRAY.length; i++) {
        let entry = ICON_ARRAY[i];
        const reg = entry[0];
        const match = new RegExp(reg, 'i').exec(name);
        if (match) {
            name = match[2];
            type = match[1];
            Icon = entry[1];
            break;
        }
    }
    const rt_info = connection.rt_info;
    const time = rt_info.time || connection.time;
    const nextStation = connection.route && connection.route[1];
    return (
        <Paper className={classes.root}>
            <div className={classes.header}>
                <div className={classes.headerContent}>
                    <Icon className={classes.icon} fontSize="small" />
                    <div>
                        <Typography variant="subtitle2">
                            <Typography variant="caption">{type}</Typography>
                            {name}
                        </Typography>
                        <Typography variant="body2" color={rt_info.time ? 'secondary' : 'textSecondary'}>
                            {time}
                        </Typography>
                    </div>
                </div>
            </div>
            <div className={classes.content}>
                <Typography variant="caption" component="p" gutterBottom>
                    via {nextStation && nextStation.name}
                </Typography>
                <Typography variant="body2">{connection.direction}</Typography>
                <Typography variant="overline" component="p">
                    {connection.platform ? 'Gl. ' + connection.platform : ''}
                </Typography>
            </div>
        </Paper>
    );
}
