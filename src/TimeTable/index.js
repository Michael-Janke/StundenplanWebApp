import React from 'react';
import { connect } from 'react-redux';
import TimeTableContainer from './components/container';
import indigo from '@material-ui/core/colors/indigo';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/styles/makeStyles';
import grey from '@material-ui/core/colors/grey';
import classNames from 'classnames';

import AssignmentCreation from './components/AssignmentCreation';
import ComponentWrapper from '../Posts/ComponentWrapper';
import Dates from '../Dates';
import ErrorBoundary from '../Common/ErrorBoundary';
import makeGetPosts from '../Posts/index.selector';

const smallBreakpoint = 800;

const useStyles = makeStyles(
    theme => ({
        root: {
            position: 'relative',
            overflowY: 'auto',
            backgroundColor: grey[100],
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

        content: {
            zIndex: 1,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 840,
        },
        paper: {
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.down(smallBreakpoint)]: {
                flexGrow: 1,
            },
            width: '100%',
        },
        timetable: {
            flexDirection: 'column',
        },
        dates: {
            maxWidth: 340,
            [theme.breakpoints.down(smallBreakpoint)]: {
                maxWidth: 492,
            },
            minHeight: 500,
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap-reverse',
            margin: theme.spacing(1, 0),
            justifyContent: 'center',
        },
        posts: {
            maxWidth: 492,
            marginLeft: theme.spacing(1),
            [theme.breakpoints.down(smallBreakpoint)]: {
                marginLeft: 0,
            },
        },
        post: {
            marginBottom: theme.spacing(1),
        },
    }),
    { name: 'TimeTableView' }
);

function TimeTableView({ small, smallTimetable, posts }) {
    const classes = useStyles();
    return (
        <div className={classes.root} key={0} id="content-root">
            <div className={classes.extendedAppBar} />
            <div className={classes.content}>
                <Paper className={classNames(classes.timetable, classes.paper)} square>
                    <ErrorBoundary>
                        <TimeTableContainer small={smallTimetable} />
                    </ErrorBoundary>
                </Paper>
                <div className={classes.row}>
                    <Paper className={classNames(classes.dates, classes.paper)} square>
                        <ErrorBoundary>
                            <Dates filterDate={small} />
                        </ErrorBoundary>
                    </Paper>
                    <div className={classes.posts}>
                        {posts &&
                            posts.map(post => (
                                <ComponentWrapper
                                    key={post.POST_ID}
                                    post={post}
                                    className={classes.post}
                                ></ComponentWrapper>
                            ))}
                    </div>
                </div>
            </div>
            <AssignmentCreation />
        </div>
    );
}

const mapStateToProps = state => {
    const getPosts = makeGetPosts();
    return {
        small: state.browser.lessThan.medium,
        smallTimetable: state.browser.lessThan.large && !state.browser.is.small,
        ...getPosts(state),
    };
};

export default connect(mapStateToProps)(TimeTableView);
