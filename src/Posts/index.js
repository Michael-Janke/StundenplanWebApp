import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { Button, Grid, Fab, Fade } from '@material-ui/core';
import { TransitionGroup } from 'react-transition-group';
import { addPost, editPost, getPosts } from './actions';
import { withRouter } from 'react-router';
import PostWrapper from './PostWrapper';


const styles = theme => ({
    root: {
        width: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.palette.background.default,
    },
    postContainer: {
        maxWidth: 400,
    },
    createButton: {
        position: 'absolute',
        right: theme.spacing(2),
        bottom: theme.spacing(2),
    },
    heroUnit: {
        backgroundColor: theme.palette.background.paper,
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing(2)}px`,
    },
    topCreateButton: {
        margin: theme.spacing(1),
        display: 'flex',
        justifyContent: 'center',
        
    },
    layout: {
        padding: `${theme.spacing(1)}px`,
        width: 'auto',
        [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
});

class Posts extends React.Component {
    state = { dialogOpen: false };

    componentDidMount() {
        this.props.getPosts();
    }

    handleDialogClose = post => {
        this.setState({ dialogOpen: false });
        if (!post) {
            return;
        }
        if (post.POST_ID) {
            this.props.editPost(post);
        } else {
            this.props.addPost(post);
        }
    };

    handleCreate = type => () => {
        this.props.history.push('/posts/new/' + type);
    };

    handleOnEdit = post => {
        this.props.history.push('/posts/edit/' + post.POST_ID);
    };

    render() {
        const { classes, posts, isAdmin } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.heroUnit}>
                    <div className={classes.heroContent}>
                        <Typography variant="h6" align="center" color="textSecondary">
                            Kuchenbasar? Kartenverkauf? Neuigkeiten?
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
                            Informiere das Wolkenberg und poste etwas auf die Infotafel!
                        </Typography>
                        {posts && !posts.length && (
                            <Typography variant="h6" align="center" color="error" paragraph>
                                Es sind keine Neuigkeiten vorhanden!
                            </Typography>
                        )}
                        <div className={classes.topCreateButton}>
                            <Button variant="contained" color="primary" onClick={this.handleCreate("post")}>
                                Beitrag erstellen
                            </Button>
                            <Button variant="contained" color="primary" onClick={this.handleCreate("diashow")}>
                                Diashow erstellen
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={classes.layout}>
                    <Grid
                        container
                        component={TransitionGroup}
                        spacing={1}
                        className={classes.postsGrid}
                        justify="center"
                    >
                        {posts &&
                            posts.map(post => (
                                <Fade post={post.POST_ID}>
                                    <Grid item xs={12} md={6} xl={4} className={classes.postContainer}>
                                        <PostWrapper {...post}></PostWrapper>
                                    </Grid>
                                </Fade>
                            ))}
                    </Grid>
                </div>
                <Fab color="primary" className={classes.createButton} onClick={this.handleCreate}>
                    <AddIcon />
                </Fab>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    posts: state.posts.posts,
    isAdmin: state.user.scope === 'admin',
});

const mapDispatchToProps = dispatch => ({
    getPosts: () => dispatch(getPosts()),
    addPost: post => dispatch(addPost(post)),
    editPost: post => dispatch(editPost(post)),
});

export default withStyles(styles)(
    withRouter(
        connect(
            mapStateToProps,
            mapDispatchToProps
        )(Posts)
    )
);
