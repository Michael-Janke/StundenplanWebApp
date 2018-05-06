import React, { Component } from 'react';
import styled from 'styled-components';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import { Button, TextField } from 'material-ui';
import { connect } from 'react-redux';
import { sendFeedback } from '../actions';
import FeedbackIcon from '@material-ui/icons/Feedback';
import { grey, purple } from 'material-ui/colors';

import Slide from 'material-ui/transitions/Slide';

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
            overflow: 'hidden',
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
                        keyboardFocused={true}
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