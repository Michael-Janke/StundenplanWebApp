import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import TimeTableContainer from '../components/container';
import indigo from '@material-ui/core/colors/indigo';
import { Paper, Grid, Grow } from '@material-ui/core';
import Dates from '../../Dates';
import ErrorBoundary from '../../Common/ErrorBoundary';
import Substitutions from './Substitutions';
import { makeStyles } from '@material-ui/styles';
import Search from '../../Main/components/Search';
import Keyboard from '../../Main/components/Keyboard';
import classNames from 'classnames';
import ClearTimetable from './ClearTimetable';
import InformationView from './Information';
import { useIntervalCheck } from '../../Common/intervalCheck';
import FastSelect from './FastSelect';

const useStyles = makeStyles(
    theme => ({
        root: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: theme.palette.background.default,
            maxHeight: 1080,
            minHeight: 1080,
            overflow: 'hidden',
        },
        appBar: {
            backgroundColor: indigo[600],
            boxShadow: 'none',
        },
        extendedAppBar: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            height: 208,
            position: 'absolute',
            backgroundColor: indigo[600],
        },
        toolbar: {
            display: 'flex',
            ...theme.mixins.toolbar,
        },
        panel: {
            padding: theme.spacing(1),
            zIndex: 1,
            height: '100%',
        },
        gridItem: {
            height: '100%',
            paddingTop: 0,
            display: 'flex',
            flexDirection: 'column',
        },
        grid: {
            height: '100%',
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
        },
        timetable: {
            maxWidth: 800,
        },
        timetableScroll: {
            flex: 1,
            overflow: 'auto',
        },
        dates: {
            maxWidth: 340,
            width: '100%',
        },
        substitutions: {
            flexGrow: 1,
        },
        growContainer: {
            position: 'relative',
            flex: 1,
            '& > *': {
                position: 'absolute',
                top: 0,
                height: '100%',
                width: '100%',
            },
        },
    }),
    { name: 'PublicDisplay' }
);

function PublicDisplay({ open }) {
    const classes = useStyles();

    const isAdmin = useSelector(state => state.user.scope === 'admin');
    useIntervalCheck();

    useEffect(() => {
        const setZoom = () => (document.body.style['zoom'] = document.body.parentElement.clientWidth / 1920);
        window.addEventListener('resize', setZoom);
        setZoom();
        return () => window.removeEventListener('resize', setZoom);
    }, []);

    if (!window.params.token && !isAdmin) {
        return 'Leider bin ich noch nicht vollständig eingerichtet';
    }

    window.open = () => {};

    return (
        <div className={classes.root}>
            <ClearTimetable />

            <div className={classes.extendedAppBar} />
            <div className={classes.panel}>
                <Grid container className={classes.grid} spacing={1}>
                    <Grid item container xs={2}>
                        <Paper className={classNames(classes.dates, classes.paper)} square>
                            <ErrorBoundary>
                                <Dates filterDate={false} />
                            </ErrorBoundary>
                        </Paper>
                    </Grid>
                    <Grid item xs={5} className={classes.gridItem}>
                        <Search style={{ paddingBottom: 8, flex: 'none' }} alwaysOpen tv={true} Keyboard={Keyboard} />
                        <div className={classes.growContainer}>
                            <FastSelect open={!open} />
                            <Grow in={open}>
                                <div className={classes.timetableScroll}>
                                    <Paper className={classNames(classes.timetable, classes.paper)} square>
                                        <ErrorBoundary>
                                            <TimeTableContainer tv={true} />
                                        </ErrorBoundary>
                                    </Paper>
                                </div>
                            </Grow>
                        </div>
                    </Grid>
                    <Grid item xs={5} container direction="column" spacing={1}>
                        <Grid item xs container>
                            <Paper className={classNames(classes.substitutions, classes.paper)} square>
                                <ErrorBoundary>
                                    <InformationView />
                                </ErrorBoundary>
                            </Paper>
                        </Grid>
                        <Grid item xs container>
                            <Grid item container>
                                <Paper className={classNames(classes.substitutions, classes.paper)} square>
                                    <ErrorBoundary>
                                        <Substitutions addDays={0} />
                                    </ErrorBoundary>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        open: state.timetable.currentTimeTableId,
    };
};

export default connect(mapStateToProps)(PublicDisplay);
