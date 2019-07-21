import React from 'react';
import { connect } from 'react-redux';
import TimeTableContainer from './components/container';
import indigo from '@material-ui/core/colors/indigo';
import { Paper, Grid } from '@material-ui/core';
import Dates from '../Dates';
import ErrorBoundary from '../Common/ErrorBoundary';
import { makeStyles } from '@material-ui/styles';
import { classNames } from '../Common/const';
import AssignmentCreation from './components/AssignmentCreation';

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
        },
        extendedAppBar: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            height: 64,
            position: 'absolute',
            backgroundColor: indigo[600],
        },
        toolbar: {
            display: 'flex',
        },

        panel: {
            [theme.breakpoints.up(smallBreakpoint)]: {
                flexGrow: 1,
                display: 'flex',
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
            display: 'flex',
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
        },
        timetable: {
            maxWidth: 800,
            flexDirection: 'column',
        },
        dates: {
            maxWidth: 340,
            [theme.breakpoints.down(smallBreakpoint)]: {
                maxWidth: 'initial',
            },
        },
    }),
    { name: 'TimeTableView' }
);

function TimeTableView({ small, smallTimetable }) {
    const classes = useStyles();
    return (
        <div className={classes.root} key={0} id="content-root">
            <div className={classes.extendedAppBar} />
            <div className={classes.panel}>
                <Grid container spacing={1} className={classes.grid} direction="row">
                    <Grid item xs className={classNames(classes.timetable, classes.gridItem)}>
                        <Paper className={classes.paper} square>
                            <ErrorBoundary>
                                <TimeTableContainer small={smallTimetable} />
                            </ErrorBoundary>
                        </Paper>
                    </Grid>
                    <Grid item xs className={classNames(classes.dates, classes.gridItem)}>
                        <Paper className={classes.paper} square>
                            <ErrorBoundary>
                                <Dates singleMonth={small} />
                            </ErrorBoundary>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
            <AssignmentCreation />
        </div>
    );
}

const mapDispatchToProps = dispatch => {
    return {};
};

const mapStateToProps = state => {
    return {
        small: state.browser.lessThan.medium,
        smallTimetable: state.browser.lessThan.large && !state.browser.is.small,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeTableView);
