import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
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
import { usePosts } from '../Posts/hooks';
import { setMyTimetable } from './actions';
import StudentList from './components/StudentList';
import { QuoteOfTheDay } from './components/QuoteOfTheDay';
import { PostEmpty } from './components/PostEmpty';

const smallBreakpoint = 800;

const useStyles = makeStyles(
    (theme) => ({
        root: {
            position: 'relative',
            overflowY: 'auto',
            backgroundColor: grey[100],
            flex: 1,
            overscrollBehavior: 'none'
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
            overflowX: 'hidden',
        },
        dates: {
            maxWidth: 340,
            [theme.breakpoints.down(smallBreakpoint)]: {
                maxWidth: 492,
            },
            minHeight: 500,
            zIndex: 2,
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
            fontSize: '80%',
        },
        post: {
            marginBottom: theme.spacing(1),
        },
    }),
    { name: 'TimeTableView' }
);

function TimeTableView({ small }) {
    const classes = useStyles();
    const posts = usePosts();

    const dispatch = useDispatch();
    useEffect(() => dispatch(setMyTimetable()), [dispatch]);

    return (
        <div className={classes.root} key={0} id="content-root">
            <div className={classes.extendedAppBar} />
            <div className={classes.content}>
                <Paper className={classNames(classes.timetable, classes.paper)} square>
                    <ErrorBoundary>
                        <TimeTableContainer small={small} />
                    </ErrorBoundary>
                </Paper>
                <div className={classes.row}>
                    <Paper className={classNames(classes.dates, classes.paper)} square>
                        <ErrorBoundary>
                            <Dates />
                        </ErrorBoundary>
                    </Paper>
                    <div className={classes.posts}>
                        {posts.map((post) => (
                            <ComponentWrapper
                                key={post.POST_ID}
                                post={post}
                                className={classes.post}
                            ></ComponentWrapper>
                        ))}
                        {posts.length === 0 && <PostEmpty />}
                        <QuoteOfTheDay />
                    </div>
                </div>
            </div>
            <AssignmentCreation />
            <StudentList />
        </div>
    );
}

const mapStateToProps = (state) => ({
    small: state.browser.lessThan.medium,
});

export default connect(mapStateToProps)(TimeTableView);
