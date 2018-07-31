import React, { Component } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { sendFeedback } from '../actions';
import FeedbackIcon from '@material-ui/icons/Feedback';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            messageText: ""
        };
    }

    clearError = () => {
        this.setState({ error: null });
    }

    open() {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleSendFeedback = () => {
        const content = this.state.messageText;
        if (content.length === 0) {
            this.setState({ error: true });
            return;
        }
        this.handleClose();
        this.props.sendFeedback({
            subject: "User Feedback",
            content,
        });
    }

    render() {

        const customContentStyle = {
            maxWidth: 500,
            overflowY: 'auto',
        };
        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
            >
                <DialogTitle>
                    <FeedbackTitle>
                        <FeedbackIcon color='secondary' style={{ marginRight: '1vmin' }} />{"Feedback geben"}
                    </FeedbackTitle>
                </DialogTitle>
                <DialogContent style={customContentStyle}>
                    <DialogContentText>
                        Danke, dass du diese App verwendest.
                        Hier kannst du Verbesserungsvorschläge vorschlagen
                    </DialogContentText>
                    <TextField
                        onFocus={this.clearError}
                        error={!!this.state.error}
                        name="text"
                        value={this.state.name}
                        onChange={this.handleChange('messageText')}
                        fullWidth
                        multiline
                        label="Schreibe eine Nachricht"
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.handleClose}
                        color="secondary"
                    >
                        Abbrechen
                    </Button>
                    <Button
                        onClick={this.handleSendFeedback}
                        color="primary"
                    >
                        Absenden
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const FeedbackTitle = styled.div`
    display: flex;
    align-items: center;
`;

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    sendFeedback: (feedback) => dispatch(sendFeedback(feedback))
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Feedback);