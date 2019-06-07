import React, { Component } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import MailIcon from '@material-ui/icons/Mail';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Icons from '../../Common/Waffle/office-icons';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" {...props} ref={ref} />);
export class Mail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageText: '',
        };
    }

    clearError = () => {
        this.setState({ error: null });
    };

    handleClose = () => {
        this.props.onClose();
    };

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
            subject: 'User Feedback',
            content,
        });
    };

    openWebOutlook() {
        window.open('https://outlook.office365.com', '_blank');
    }

    render() {
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
                        <MailIcon color="primary" style={{ marginRight: '1vmin' }} />
                        Ungelesene Nachrichten
                    </FeedbackTitle>
                </DialogTitle>
                <DialogContent style={customContentStyle}>
                    <Typography variant="body1">
                        Du hast ungelesene Nachrichten in deinem Schul-E-Mail-Account.
                    </Typography>
                    <Button variant="contained" style={{ margin: 10 }} onClick={this.openWebOutlook}>
                        <Icons.Outlook.icon /> &nbsp; Zur Web-Version
                    </Button>
                    {isMobile ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Apps installieren
                            </Typography>
                            <Typography variant="body1">
                                Wir empfehlen dir die App zu installieren. Damit bekommst du sofort eine
                                Benachrichtigung auf dein Smartphone.
                            </Typography>
                            <div>
                                <a href="https://play.google.com/store/apps/details?id=com.microsoft.office.outlook&hl=de">
                                    <img
                                        alt="Jetzt bei Google Play"
                                        src="https://play.google.com/intl/en_us/badges/images/generic/de_badge_web_generic.png"
                                        style={{ display: 'inline', width: 150, height: 60 }}
                                    />
                                </a>
                                <a
                                    href="https://itunes.apple.com/de/app/microsoft-outlook/id951937596?mt=8"
                                    style={{
                                        display: 'inline-block',
                                        overflow: 'hidden',
                                        margin: 10,
                                        background:
                                            'url(https://linkmaker.itunes.apple.com/en-us/badge-lrg.svg?releaseDate=2015-01-29&kind=iossoftware&bubble=ios_apps) no-repeat',
                                        width: 135,
                                        height: 40,
                                    }}
                                >
                                    &nbsp;
                                </a>
                            </div>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Outlook auf dem PC/Mac installieren
                            </Typography>
                            <Typography variant="body1">
                                Auf deinem Computer kannst du{' '}
                                <a href="https://portal.office.com/OLS/MySoftware.aspx">Microsoft Office ProPlus</a>{' '}
                                kostenlos installieren. Damit wird auch Outlook installiert und mit deinem Konto
                                verbunden.
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="secondary">
                        Schließen
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const FeedbackTitle = styled.div`
    display: flex;
    align-items: center;
`;

const mapStateToProps = state => ({
    small: state.browser.lessThan.medium,
});

export default connect(mapStateToProps)(Mail);
