import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

export class TokenError extends Component {

    state={}
    
    static getDerivedStateFromProps(props, state) {
        return state && state.open ? state : props;
    }
    
    render() {

        const customContentStyle = {
            maxWidth: 500,
            overflowY: 'auto',
        };
        return (
            <Dialog
                open={this.state.open && !this.state.ignore}
                fullScreen={this.props.small}
            >
                <DialogTitle>
                    Cookies aktivieren
                </DialogTitle>
                <DialogContent style={customContentStyle}>
                    
                    <Typography variant="h6">
                        Bitte erlaube Cookies in den Einstellungen deines Browsers.
                    </Typography>
                    <Typography variant="body2">
                    Dein Browser erlaubt keine Cookies.
                    Damit die App die Anmeldung vornehmen kann, benötigt es diese Funktion jedoch.
                    </Typography>

                    <Typography variant="h6">
                    Links zu den Hilfeseiten der Browserhersteller:
                    </Typography>

                    <Typography variant="body1">
                        <a href="https://support.google.com/accounts/answer/61416?co=GENIE.Platform%3DDesktop&hl=de">Google</a>
                    </Typography>
                   
                    <Typography variant="body1">
                        <a href="https://support.mozilla.org/de/kb/cookies-erlauben-und-ablehnen">Firefox</a>
                    </Typography>
                
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.props.onReset}
                        variant="outlined"
                        color="primary"
                    >
                        Seite zurücksetzen
                    </Button>
                    <Button
                        onClick={() => window.location.reload()}
                        color="primary"
                        variant="contained"
                    >
                        Seite neuladen
                    </Button>
                    <Button
                        onClick={() => this.setState({ignore:true})}
                        color="primary"
                    >
                        ignorieren
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => ({
    small: state.browser.lessThan.medium,
    open: state.error.type === "TOKEN_ERROR"
});

export default connect(mapStateToProps)(TokenError);