import React from 'react';
import { connect } from 'react-redux';
import makeStyles from '@material-ui/styles/makeStyles';
import Post from '../Common/Post';
import { Button } from '@material-ui/core';
import Rocket from './Rocket';


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

const PreviewAndSave = ({ upn, images, title, content, onSave }) => {
    const classes = useStyles();
    const [launched, setLaunched] = React.useState(false);

    const onClick = React.useCallback(() => {
        setLaunched(!launched);
    }, [launched]);

    return (
        <div className={classes.root}>
            <Post images={images} upn={upn} title={title} content={content} edit={false} />
            <Button onClick={onClick} variant="contained" size="large" color="primary">
                <Rocket launched={launched}></Rocket>
                Speichern
            </Button>
        </div>
    );
};


const mapStateToProps = state => ({
    images: state.postcreation.images,
    title: state.postcreation.title,
    content: state.postcreation.content,
    user: state.user.upn,
})

export default connect(mapStateToProps)(PreviewAndSave);
