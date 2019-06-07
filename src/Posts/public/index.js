import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';

import { Grid, AppBar, Toolbar, Typography } from '@material-ui/core';
import Post from '../post';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { getPosts } from '../actions';
import ClockDigital from './ClockDigital';
import ClockAnalog from './ClockAnalog';
import CurrentDate from './CurrentDate';
import DayInfo from './DayInfo';
/**
 *
 * @param {import('@material-ui/core').Theme} theme
 */
const styles = theme => ({
    root: {
        width: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    postGridItem: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    post: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: 20,
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
    layout: {
        padding: 20,
        width: 'auto',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    transportInfo: {
        backgroundColor: theme.palette.background.paper,
        flex: '0 0 128px',
    },
    flexGrow: {
        flexGrow: 1,
    },

    main: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    toolbar: {
        minHeight: 130,
    },
    dateTime: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(1),
    },
    image: {
        filter: `invert(100%) drop-shadow(1px 1px 0px rgba(0,0,0,0.2))`,
    },
});

class Posts extends React.Component {
    componentWillMount() {
        this.props.getPosts();
    }

    render() {
        const { classes, posts } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <img className={classes.image} src={require('../../Common/icons/wolkenberg.png')} alt="" />
                        <ClockAnalog />
                        <div className={classes.dateTime}>
                            <CurrentDate />
                            <ClockDigital />
                        </div>
                        <DayInfo />
                    </Toolbar>
                </AppBar>
                <div className={classes.layout}>
                    <Grid container item className={classes.flexGrow}>
                        <Grid item xs={3}>
                            <div className={classes.sidebar} />
                        </Grid>
                        <Grid item xs={9} className={classes.main}>
                            <Typography variant="h2" color="textSecondary" gutterBottom>
                                Neuigkeiten
                            </Typography>
                            <Grid container component={TransitionGroup} className={classes.post}>
                                {posts &&
                                    posts.map(post => (
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
                                            <Grid item xs className={classes.postGridItem}>
                                                <Post overflow post={post} />
                                            </Grid>
                                        </CSSTransition>
                                    ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <Grid xs={12} item className={classes.transportInfo} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    posts: state.posts.posts,
});

const mapDispatchToProps = dispatch => ({
    getPosts: () => dispatch(getPosts()),
});

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Posts)
);
