import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { Button, Grid } from '@material-ui/core';
import Post from './post';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { addPost, editPost, getPosts } from './actions';
import { withRouter } from 'react-router';

const styles = theme => ({
    root: {
        width: '100%',
        // padding: `${theme.spacing.unit * 8}px ${theme.spacing.unit * 6}px`,
        boxSizing: 'border-box',
        overflowY: 'auto',
    },
    post: {
        display: 'flex',
        flexWrap: 'wrap',
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

    createButton: {
        position: 'absolute',
        right: theme.spacing.unit * 2,
        bottom: theme.spacing.unit * 2,
    },
    heroUnit: {
        backgroundColor: theme.palette.background.paper,
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    heroButtons: {
        marginTop: theme.spacing.unit * 4,
    },
    layout: {
        padding: `${theme.spacing.unit * 8}px 0`,
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
});

class Posts extends React.Component {

    state = { dialogOpen: false };

    componentWillMount() {
        this.props.getPosts();
    }
    handleDialogClose = (post) => {
        this.setState({ dialogOpen: false });
        if (!post) {
            return;
        }
        if (post.POST_ID) {
            this.props.editPost(post);
        } else {
            this.props.addPost(post);
        }
    }

    handleCreate = () => {
        this.props.history.push("/posts/new");
    }

    handleOnEdit = (post) => {
        this.props.history.push("/posts/" + post.POST_ID);
    }

    render() {
        const { classes, posts, isAdmin } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.heroUnit}>
                    <div className={classes.heroContent}>
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Neuigkeiten
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" paragraph>
                            Erstelle Beiträge, um über Neugigkeiten von Lehrern und Schülern zu informieren. 
                        </Typography>
                        {posts && !posts.length &&
                            <Typography variant="h6" align="center" color="error" paragraph>
                                Es sind keine Neuigkeiten vorhanden!
                            </Typography>
                        }
                        <div className={classes.heroButtons}>
                            <Grid container spacing={16} justify="center">
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={this.handleCreate}>
                                        Jetzt erstellen
                                    </Button>
                                </Grid>
                                {/* <Grid item>
                                    <Button variant="outlined" color="primary">
                                        Secondary action
                                    </Button>
                                </Grid> */}
                            </Grid>
                        </div>
                    </div>
                </div>
                <div className={classes.layout}>
                    <Grid container component={TransitionGroup} spacing={40} className={classes.post}>
                        {posts && posts.map(post => (
                            <CSSTransition
                                classNames={{
                                    enter: classes.postEnter,
                                    enterActive: classes.postEnterActive,
                                    exit: classes.postExit,
                                    exitActive: classes.postExitActive,
                                }}
                                key={post.POST_ID}
                                timeout={500}>
                                <Grid item xs={12} md={6}>
                                    <Post post={post} isAdmin={isAdmin} onEdit={this.handleOnEdit} />
                                </Grid>
                            </CSSTransition>
                        ))}
                    </Grid>
                </div>
                <Button variant="fab" color="primary" className={classes.createButton} onClick={this.handleCreate}>
                    <AddIcon />
                </Button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    posts: state.posts.posts,
    isAdmin: state.user.scope === 'admin',
});

const mapDispatchToProps = dispatch => ({
    getPosts: () => dispatch(getPosts()),
    addPost: (post) => dispatch(addPost(post)),
    editPost: (post) => dispatch(editPost(post)),
});

export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(Posts)));