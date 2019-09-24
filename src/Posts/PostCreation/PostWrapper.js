import React from 'react';
import { connect } from 'react-redux';
import makeStyles from '@material-ui/styles/makeStyles';
import Post from '../Common/Post';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        paddingTop: 70,
        boxSizing: 'border-box',
    },
}));

const PostWrapper = ({ upn, images, title, content, onUpdateContent, onUpdateTitle }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Post
                images={images}
                upn={upn}
                edit={true}
                title={title}
                content={content}
                onUpdateTitle={onUpdateTitle}
                onUpdateContent={onUpdateContent}
            />
        </div>
    );
};

const mapStateToProps = state => ({
    images: state.postcreation.images,
    title: state.postcreation.title,
    content: state.postcreation.content,
    user: state.user.upn,
})

const mapDispatchToProps = dispatch => ({
    onUpdateTitle: (title) => dispatch({ type: 'SET_TITLE', payload: title }),
    onUpdateContent: (content) => dispatch({ type: 'SET_CONTENT', payload: content }),
})

export default connect(mapStateToProps, mapDispatchToProps)(PostWrapper);
