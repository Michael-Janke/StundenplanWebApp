import React from 'react';
import { connect } from 'react-redux';
import makeStyles from '@material-ui/styles/makeStyles';
import Post from '../Common/Post';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        minHeight: '100%',
    },
}));

const PreviewAndSave = ({ upn, image, title, content, onSave }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Post image={image} upn={upn} title={title} content={content} edit={false} />
            <Button onClick={onSave} variant="contained" size="large" color="primary">
                Speichern
            </Button>
        </div>
    );
};


const mapStateToProps = state => ({
    image: state.postcreation.image,
    title: state.postcreation.title,
    content: state.postcreation.content,
    user: state.user.upn,
})

export default connect(mapStateToProps)(PreviewAndSave);
