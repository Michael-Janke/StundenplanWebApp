import React, { Component } from 'react';
import styled from 'styled-components';
import Dialog from 'material-ui/Dialog';
import { Button, TextField } from 'material-ui';
import { connect } from 'react-redux';
import { sendFeedback } from '../actions';
import FeedbackIcon from '@material-ui/icons/Feedback';
import { grey, purple } from 'material-ui/colors';

export class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    open() {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleSendFeedback = () => {
        this.handleClose();
        const content = this.refs.textField.getValue();
        this.props.sendFeedback({
            subject: "User Feedback",
            content,
        });
    }

    render() {
        const actions = [
            <Button
                label="Abbrechen"
                primary={true}
                onClick={this.handleClose}
            />,
            <Button
                label="Absenden"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleSendFeedback}
            />,
        ];
        const customContentStyle = {
            maxWidth: 500,
        };
        return (
            <Dialog
                title={<FeedbackTitle><FeedbackIcon color={grey[400]} style={{ marginRight: '1vmin' }} />{"Feedback geben"}</FeedbackTitle>}
                actions={actions}
                modal={false}
                contentStyle={customContentStyle}
                open={this.state.open}
                onRequestClose={this.handleClose}
            >
                Danke, dass du diese App verwendest.
                Hier kannst du Verbesserungsvorschläge vorschlagen
                <TextField
                    name="text"
                    ref="textField"
                    fullWidth
                    multiLine
                    floatingLabelText="Schreibe eine Nachricht"
                    rows={4}
                    errorStyle={{ color: purple[600] }}
                    hintStyle={{ color: purple[600] }}
                    floatingLabelFocusStyle={{ color: purple[600] }}
                />
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