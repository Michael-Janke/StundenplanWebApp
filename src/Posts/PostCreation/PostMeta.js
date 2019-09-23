import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import classNames from 'classnames/bind';
import TimeIcon from '@material-ui/icons/AccessTime';
import TvIcon from '@material-ui/icons/Tv';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100%',
    },
    settings: {
        width: '100%',
        maxWidth: 600,
        padding: theme.spacing(2, 0, 6, 0),
    },
    paper: {
        padding: theme.spacing(1, 2),
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
}));

const PostMeta = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.settings}>
                <Typography variant="h6" gutterBottom className={classes.header}>
                    <TvIcon />
                    &nbsp; Anzeigebereiche
                </Typography>
                <Paper className={classNames(classes.paper, classes.list)}>
                    <FormControlLabel control={<Checkbox checked={true} />} label="Infotafeln" />
                    <FormControlLabel control={<Checkbox checked={true} />} label="Stundenplan Lehrer" />
                    <FormControlLabel control={<Checkbox checked={true} />} label="Stundenplan Schüler" />
                </Paper>
            </div>
            <div className={classes.settings}>
                <Typography variant="h6" gutterBottom className={classes.header}>
                    <TimeIcon />
                    &nbsp; Zeitbeschränkung
                </Typography>
                <Paper className={classNames(classes.paper, classes.list)}>Von: (heute) Bis: (morgen)</Paper>
            </div>
        </div>
    );
};

export default PostMeta;
