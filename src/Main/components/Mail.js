import React, { Component } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import MailIcon from '@material-ui/icons/Mail';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Icons from '../../Common/Waffle/office-icons';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export class Mail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageText: ""
        };
    }

    clearError = () => {
        this.setState({ error: null });
    }

    handleClose = () => {
        this.props.onClose();
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

    createBadges() { return {__html:
        "<a href='https://play.google.com/store/apps/details?id=com.microsoft.office.outlook&hl=de'><img alt='Jetzt bei Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/de_badge_web_generic.png' style='display:inline;width:150px;height:60px;'/></a>" +
        "<a href='https://itunes.apple.com/de/app/microsoft-outlook/id951937596?mt=8' style='display:inline-block;overflow:hidden;margin:10px;background:url(https://linkmaker.itunes.apple.com/en-us/badge-lrg.svg?releaseDate=2015-01-29&kind=iossoftware&bubble=ios_apps) no-repeat;width:135px;height:40px;'></a>"
    }};

    render() {

        const customContentStyle = {
            maxWidth: 500,
            overflowY: 'auto',
        };
        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
                fullScreen={this.props.small}
            >
                <DialogTitle>
                    <FeedbackTitle>
                        <MailIcon color='primary' style={{ marginRight: '1vmin' }} />
                        Ungelesene Nachrichten
                    </FeedbackTitle>
                </DialogTitle>
                <DialogContent style={customContentStyle}>
                    <DialogContentText>
                        Du hast ungelesene Nachrichten in deinem Schul-E-Mail-Account.
                        <Button variant="contained" style={{margin:10}}>
                            <Icons.Outlook.icon/> &nbsp;
                            Zur Web-Version
                        </Button>
                        
                        <Typography variant="h6" gutterBottom>
                            Apps installieren
                        </Typography>
                            Wir empfehlen dir die App zu installieren. Damit bekommst du sofort eine Benachrichtigung auf dein Smartphone.
                        <div dangerouslySetInnerHTML={this.createBadges()} />
                        <Typography variant="h6" gutterBottom>
                            Outlook auf dem PC/Mac installieren
                        </Typography>
                            Auf deinem Computer kannst du <a href="https://portal.office.com/OLS/MySoftware.aspx">Micrsoft Office ProPlus</a> kostenlos installieren. Damit wird auch Outlook installiert und mit deinem Konto verbunden.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.handleClose}
                        color="secondary"
                    >
                        Schließen
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
    small: state.browser.lessThan.medium
});

export default connect(mapStateToProps)(Mail);