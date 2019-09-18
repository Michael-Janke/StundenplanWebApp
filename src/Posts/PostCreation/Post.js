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

const PostWrapper = ({ image, title, content, onUpdateContent, onUpdateTitle, upn }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Post
                image={image}
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

export default connect(({ user }) => ({ upn: user.upn }))(PostWrapper);
