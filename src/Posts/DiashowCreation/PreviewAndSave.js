import React from 'react';
import { connect } from 'react-redux';
import makeStyles from '@material-ui/styles/makeStyles';
import Diashow from '../Common/Diashow';
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

const PreviewAndSave = ({ title, images, upn, onSave }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Diashow images={images} upn={upn} title={title} />
            <Button onClick={onSave} variant="contained" size="large" color="primary">
                Speichern
            </Button>
        </div>
    );
};

export default connect(({ user }) => ({ upn: user.upn }))(PreviewAndSave);
