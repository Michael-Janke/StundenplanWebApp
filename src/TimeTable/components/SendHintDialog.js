import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { closeSendHint } from '../actions';
import AbstractLesson from '../lesson';

const useStyles = makeStyles({

});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

function SendHintDialog({ open, closeSendHint, data }) {

    return (
        <Dialog
            open={open}
            onClose={closeSendHint}
            TransitionComponent={Transition}
            fullWidth
        >
            <DialogTitle>
                Hinweis senden
            </DialogTitle>
            <DialogContent>
                <Typography>
                    Sende einen Hinweis an den Vertretungsplaner
                    
                    
                    <AbstractLesson
                        {...data}
                    ></AbstractLesson>

                </Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="flat" color="secondary" onClick={closeSendHint}>
                    Abbrechen
                </Button>
                <Button variant="contained" color="primary">
                    Senden
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state) => ({
    open: state.hint.sendHintOpen,
    data: state.hint.data,
});

const mapDispatchToProps = (dispatch) => ({
    closeSendHint: () => {
        dispatch(closeSendHint());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SendHintDialog);