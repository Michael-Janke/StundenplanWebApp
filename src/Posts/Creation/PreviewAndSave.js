import React from 'react';
import { connect } from 'react-redux';
import makeStyles from '@material-ui/styles/makeStyles';
import Post from '../Common/Post';
import Diashow from '../Common/Diashow';
import { Button } from '@material-ui/core';
import Rocket from './Rocket';
import { withRouter } from 'react-router';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        minHeight: '100%',
    },
}));

const PreviewAndSave = ({
    upn,
    dateFrom,
    dateTo,
    images,
    type,
    title,
    content,
    POST_ID,
    viewPublic,
    viewTeacher,
    viewStudent,
    savePost,
    endPostCreation,
    history,
    saved,
}) => {
    const classes = useStyles();
    const [launched, setLaunched] = React.useState(false);

    const onClick = React.useCallback(() => {
        setLaunched(true);
        savePost({
            IMAGES: images,
            TITLE: title,
            TEXT: JSON.stringify(content),
            POST_ID: POST_ID,
            TYPE: type,
            DATE_FROM: dateFrom,
            DATE_TO: dateTo,
            APPROVED: true,
            VIEW_PUBLIC: viewPublic,
            VIEW_STUDENT: viewStudent,
            VIEW_TEACHER: viewTeacher,
        });
    }, [POST_ID, content, dateFrom, dateTo, images, savePost, title, type, viewPublic, viewStudent, viewTeacher]);

    const onEnd = React.useCallback(() => {
        if (saved) {
            history.goBack();
            endPostCreation();
        }
    }, [endPostCreation, history, saved]);

    const Component = {
        'diashow': Diashow,
        'post': Post,
    }[type]

    return (
        <div className={classes.root}>
            {Component &&
                <Component images={images} upn={upn} title={title} content={content} edit={false} />
            }
            <Button onClick={onClick} variant="contained" size="large" color="primary">
                <Rocket launched={launched} onEnd={onEnd}></Rocket>
                Speichern
            </Button>
        </div>
    );
};

const mapStateToProps = state => ({
    images: state.postcreation.images,
    title: state.postcreation.title,
    content: state.postcreation.content,
    type: state.postcreation.type,
    user: state.user.upn,
    POST_ID: state.postcreation.POST_ID,
    saved: state.postcreation.saved,
    dateFrom: state.postcreation.dateFrom,
    dateTo: state.postcreation.dateTo,
    viewPublic: state.postcreation.viewPublic,
    viewStudent: state.postcreation.viewStudent,
    viewTeacher: state.postcreation.viewTeacher,
});

const mapDispatchToProps = dispatch => ({
    savePost: post =>
        dispatch({
            type: post.POST_ID ? 'EDIT_POST' : 'ADD_POST',
            payload: post,
        }),
    endPostCreation: () => dispatch({ type: 'END_POST_CREATION' }),
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PreviewAndSave)
);
