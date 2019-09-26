import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { Button, Grid, Fab, Fade } from '@material-ui/core';
import { TransitionGroup } from 'react-transition-group';
import { addPost, editPost, getPosts, deletePost } from './actions';
import { withRouter } from 'react-router';
import ComponentWrapper from './ComponentWrapper';
import makeGetPosts from './index.selector';
import useDialog from '../Common/useDialog';
import { useIntervalCheck } from '../Common/intervalCheck';

const styles = theme => ({
    root: {
        width: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.palette.background.default,
    },
    postContainer: {
    },
    createButton: {
        position: 'absolute',
        right: theme.spacing(2),
        bottom: theme.spacing(2),
    },
    headerContainer: {
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing(2)}px`,
    },
    topCreateButton: {
        margin: theme.spacing(1),
        display: 'flex',
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(0, 1),
        }
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

function Posts({ getPosts, classes, isAdmin, posts, hasPosts, history, deletePost }) {
    
    useIntervalCheck();

    const handleCreate = type => () => {
        history.push('/posts/new/' + type);
    };

    const handleOnEdit = post => {
        history.push('/posts/edit/' + post.POST_ID);
    };

    const handleOnDelete = (post, target) => {
        setDialog(target, (status) => {
            if (status) {
                deletePost(post);
            }
        });
    }
    const [dialog, setDialog] = useDialog({
        title: 'Beitrag löschen',
        text: 'Möchtest du diesen Beitrag wirklich löschen?',
        textAccept: 'Löschen',
        textDecline: 'Abbrechen'
    });

    return (
        <div className={classes.root}>
            {dialog}
            <div className={classes.headerContainer}>
                <div className={classes.header}>
                    <Typography variant="h6" align="center" color="textSecondary">
                        Kuchenbasar? Kartenverkauf? Neuigkeiten?
                        </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
                        Informiere das Wolkenberg und poste etwas auf die Infotafel!
                        </Typography>
                    <div className={classes.topCreateButton}>
                        <Button variant="outlined" color="primary" onClick={handleCreate('post')}>
                            Beitrag erstellen
                            </Button>
                        <Button variant="outlined" color="primary" onClick={handleCreate('diashow')}>
                            Diashow erstellen
                            </Button>
                    </div>
                </div>
            </div>
            <div className={classes.layout}>
                {(!hasPosts) && (
                    <Typography variant="h6" align="center" color="textSecondary">
                        Es sind keine Beiträge vorhanden. Sei der erste und erstelle jetzt einen Beitrag oder eine Diashow.
                        </Typography>
                )}
                <Grid
                    container
                    component={TransitionGroup}
                    spacing={1}
                    className={classes.postsGrid}
                    justify="center"
                >
                    {posts &&
                        posts.map(post => {
                            const canEdit = isAdmin || post.USER_CREATED;

                            return (
                                <Fade key={post.POST_ID}>
                                    <Grid item xs={12} md={6} xl={4} className={classes.postContainer}>
                                        <ComponentWrapper
                                            post={post}
                                            onEdit={canEdit && handleOnEdit}
                                            onDelete={canEdit && handleOnDelete}
                                        >
                                        </ComponentWrapper>
                                    </Grid>
                                </Fade>
                            )
                        })}
                </Grid>
            </div>
            <Fab color="primary" className={classes.createButton} onClick={handleCreate("post")}>
                <AddIcon />
            </Fab>
        </div>
    );

}
const makeMapStateToProps = () => {
    const getPosts = makeGetPosts();

    return (state) => ({
        ...getPosts(state),
        isAdmin: state.user.scope === 'admin',
    })
}


const mapDispatchToProps = dispatch => ({
    getPosts: () => dispatch(getPosts()),
    addPost: post => dispatch(addPost(post)),
    editPost: post => dispatch(editPost(post)),
    deletePost: post => dispatch(deletePost(post)),
});

export default withStyles(styles)(
    withRouter(
        connect(
            makeMapStateToProps,
            mapDispatchToProps
        )(Posts)
    )
);
