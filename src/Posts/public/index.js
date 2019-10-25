import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch } from 'react-redux';

import { GridList, GridListTile, AppBar, Toolbar } from '@material-ui/core';
import ComponentWrapper from '../ComponentWrapper';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { getPosts as getPostsAction } from '../actions';
import ClockDigital from './ClockDigital';
import CurrentDate from './CurrentDate';
import DayInfo from './DayInfo';
import TransportInfo from './TransportInfo/TransportInfo';
import { fade } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors';
import { useIntervalCheck } from '../../Common/intervalCheck';
import useInterval from 'react-useinterval';
import { usePosts } from '../hooks';

const useStyles = makeStyles(theme => ({
    root: {
        width: 1920,
        boxSizing: 'border-box',
        overflow: 'hidden',
        minHeight: 1080,
        maxHeight: 1080,
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
    },
    appBar: {
        backgroundColor: indigo[600],
        height: 100,
    },
    content: {
        width: '100%',
        height: '100%',
        padding: 8,
        boxSizing: 'border-box',
    },
    postGridItem: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    postEnter: {
        opacity: 0,
    },
    postEnterActive: {
        transition: theme.transitions.create(['opacity']),
        opacity: 1,
    },
    postExit: {
        opacity: 1,
    },
    postExitActive: {
        transition: theme.transitions.create(['opacity']),
        opacity: 0,
    },
    main: {
        padding: theme.spacing(1),
        backgroundColor: fade(theme.palette.background.paper, 0.8),
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    toolbar: {
        height: '100%',
        '& > *  ': {
            padding: theme.spacing(0, 4, 0, 0),
        },
    },
    dateTime: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing(1),
    },
    icon: {
        filter: `invert(100%) drop-shadow(1px 1px 0px rgba(0,0,0,0.2))`,
        height: 68,
    },
    tile: {
        overflow: 'unset',
    },
    post: {
        height: '100%',
    },
}));

const Posts = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const getPosts = () => dispatch(getPostsAction());
    useEffect(getPosts, []);
    useIntervalCheck();
    const [zoom, setZoom] = useState(document.body.offsetWidth / 1920);
    useEffect(() => {
        window.addEventListener('resize', () => setZoom(document.body.offsetWidth / 1920));
    }, []);

    const posts = usePosts();

    const [postOverflow, setPostOverflow] = useState(0);
    const overflow = posts ? posts.length - 4 : 0;
    useInterval(() => setPostOverflow((postOverflow + 1) % overflow), 1000 * 30);

    return (
        <TransitionGroup className={classes.root} style={{ zoom }}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <img className={classes.icon} src={require('../../Common/icons/wolkenberg.png')} alt="" />
                    <CurrentDate />
                    <ClockDigital />
                </Toolbar>
            </AppBar>
            <div className={classes.content}>
                <GridList cellHeight={482} cols={4} rows={2} spacing={8}>
                    <GridListTile rows={2} cols={1} classes={{ tile: classes.tile }}>
                        <TransportInfo></TransportInfo>
                    </GridListTile>
                    <GridListTile rows={2} cols={3} classes={{ tile: classes.tile }}>
                        <GridList cellHeight={478} cols={3} rows={2} spacing={8} classes={{ root: classes.tile }}>
                            <GridListTile rows={1} cols={1} classes={{ tile: classes.tile }}>
                                <DayInfo></DayInfo>
                            </GridListTile>
                            {posts
                                .filter((v, i) => i < 4 || i === 4 + postOverflow)
                                .map((post, i) => (
                                    <GridListTile key={post.POST_ID} rows={1} cols={1} classes={{ tile: classes.tile }}>
                                        <CSSTransition
                                            classNames={{
                                                enter: classes.postEnter,
                                                enterActive: classes.postEnterActive,
                                                exit: classes.postExit,
                                                exitActive: classes.postExitActive,
                                            }}
                                            key={post.POST_ID}
                                            timeout={500}
                                        >
                                            <ComponentWrapper
                                                post={post}
                                                noButtons={true}
                                                className={classes.post}
                                                titleAdd={
                                                    i === 4 && overflow > 0 ? ` (${postOverflow + 1}/${overflow})` : ''
                                                }
                                            ></ComponentWrapper>
                                        </CSSTransition>
                                    </GridListTile>
                                ))}
                        </GridList>
                    </GridListTile>
                </GridList>
            </div>
        </TransitionGroup>
    );
};

export default Posts;
