import React from 'react';
import { connect, useSelector } from 'react-redux';
import TimeTableContainer from '../components/container';
import indigo from '@material-ui/core/colors/indigo';
import { Paper, AppBar, Grid, Toolbar } from '@material-ui/core';
import Dates from '../../Dates';
import ErrorBoundary from '../../Common/ErrorBoundary';
import Substitutions from './Substitutions';
import { makeStyles, useTheme } from '@material-ui/styles';
import Search from '../../Main/components/Search';
import Keyboard from '../../Main/components/Keyboard';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { classNames } from '../../Common/const';
import ClearTimetable from './ClearTimetable';
import InformationView from './Information';
import { useIntervalCheck } from '../../Common/intervalCheck';

const smallBreakpoint = 800;

const useStyles = makeStyles(
    theme => ({
        root: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflowY: 'auto',
            backgroundColor: theme.palette.background.default,
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
            height: 104,
            position: 'absolute',
            backgroundColor: indigo[600],
        },
        toolbar: {
            display: 'flex',
            ...theme.mixins.toolbar,
        },
        panel: {
            [theme.breakpoints.up(smallBreakpoint)]: {
                flexGrow: 1,
                display: 'flex',
                paddingLeft: 20,
                paddingRight: 20,
            },
            paddingLeft: 8,
            paddingRight: 8,
            paddingBottom: 8,
            zIndex: 1,
        },
        gridItem: {
            [theme.breakpoints.up(smallBreakpoint)]: {
                height: '100%',
            },
            [theme.breakpoints.down(smallBreakpoint)]: {
                maxWidth: 'initial',
            },
            paddingTop: 0,
        },
        grid: {
            [theme.breakpoints.down(smallBreakpoint)]: {
                display: 'block',
            },
            flexDirection: 'row-reverse',
            justifyContent: 'flex-end',
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.down(smallBreakpoint)]: {
                flexGrow: 1,
            },
            margin: theme.spacing(0.5),
        },
        timetable: {
            maxWidth: 800,
        },
        dates: {
            maxWidth: 340,
            width: '100%',
            [theme.breakpoints.down(smallBreakpoint)]: {
                maxWidth: 'initial',
            },
        },
        substitutions: {
            flexGrow: 1,
        },
    }),
    { name: 'PublicDisplay' }
);

function PublicDisplay({ open }) {
    const classes = useStyles();
    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down(smallBreakpoint));
    const isAdmin = useSelector(state => state.user.scope === 'admin');
    useIntervalCheck();

    if (!window.params.token && !isAdmin) {
        return 'Leider bin ich noch nicht vollständig eingerichtet';
    }

    return (
        <div className={classes.root}>
            <ClearTimetable />
            <AppBar position="relative" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Grid item xs />
                    <Grid item xs>
                        <Search
                            style={{ paddingLeft: 4, paddingRight: 4 }}
                            alwaysOpen
                            tv
                            open={open}
                            Keyboard={Keyboard}
                        />
                    </Grid>
                </Toolbar>
            </AppBar>
            <div className={classes.extendedAppBar} />
            <div className={classes.panel}>
                <Grid container className={classes.grid}>
                    <Grid item xs={6} className={classes.gridItem}>
                        <Paper className={classNames(classes.timetable, classes.paper)} square>
                            <ErrorBoundary>
                                <TimeTableContainer />
                            </ErrorBoundary>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} container direction="column">
                        <Grid item xs container>
                            <Paper className={classNames(classes.substitutions, classes.paper)} square>
                                <ErrorBoundary>
                                    <InformationView />
                                </ErrorBoundary>
                            </Paper>
                        </Grid>
                        <Grid item xs container>
                            <Grid item container xs={8}>
                                <Paper className={classNames(classes.substitutions, classes.paper)} square>
                                    <ErrorBoundary>
                                        <Substitutions addDays={0} />
                                    </ErrorBoundary>
                                </Paper>
                            </Grid>
                            <Grid item container xs={4}>
                                <Paper className={classNames(classes.dates, classes.paper)} square>
                                    <ErrorBoundary>
                                        <Dates filterDate={small} />
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
        small: state.browser.lessThan.medium,
        open: !state.timetable.currentTimeTableId,
    };
};

export default connect(mapStateToProps)(PublicDisplay);
