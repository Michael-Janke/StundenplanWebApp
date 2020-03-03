import React from 'react';
import { connect } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import IconButton from '@material-ui/core/IconButton';

import ProfilePicIcon from '@material-ui/icons/AccountCircle';
import RefreshIcon from '@material-ui/icons/Refresh';
import KeyIcon from '@material-ui/icons/VpnKey';
import FeedbackIcon from '@material-ui/icons/Feedback';
import NotificationsOn from '@material-ui/icons/NotificationsActive';
import NotificationsOff from '@material-ui/icons/NotificationsOff';
import LogOutIcon from '@material-ui/icons/ExitToApp';
import MailIcon from '@material-ui/icons/Mail';
import { withRouter } from 'react-router';

import { purge } from '../../store';
import { unregister } from '../../serviceWorker';
import { setNotification, showError, loadMe, logOut } from '../actions';
import UserAvatar from './UserAvatar';
import withTheme from '@material-ui/core/styles/withTheme';
import Tooltip from '@material-ui/core/Tooltip';
import ReminderSettingsDialog from './ReminderSettingsDialog';
import Feedback from './Feedback';

class UserSettingsMenu extends React.Component {
    state = {
        reminderOpen: false,
        feedbackOpen: false,
    };

    profilePicChange = () => {
        window.open(
            'https://outlook.office365.com/ecp/PersonalSettings/EditAccount.aspx?chgPhoto=1&e' +
                'xsvurl=1&realm=wgmail.de',
            'popup',
            'width=600,height=400,status=yes,scrollbars=yes,resizable=yes'
        );
    };

    passwordChange = () => {
        window.open(
            'https://login.wgmail.de/adfs/portal/updatepassword?username=' + this.props.upn,
            'popup',
            'width=400,height=600,status=yes,scrollbars=yes,resizable=yes'
        );
    };

    reset = () => {
        purge().finally(() => {
            localStorage.clear();
            unregister();
            window.location.reload();
        });
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    openFeedback = () => {
        this.setState({ feedbackOpen: true });
        this.handleClose();
    };

    openReminderSettings = () => {
        this.props.loadMe();
        this.setState({ reminderOpen: true });
        this.handleClose();
    };

    closeReminderSettings = () => {
        this.setState({ reminderOpen: false });
    };

    closeFeedback = () => {
        this.setState({ feedbackOpen: false });
    };

    closeFeedback = () => {
        this.setState({ feedbackOpen: false });
    };

    render() {
        const { anchorEl } = this.state;
        return (
            <div>
                <ReminderSettingsDialog open={this.state.reminderOpen} onClose={this.closeReminderSettings} />
                <Feedback open={this.state.feedbackOpen} onClose={this.closeFeedback} />
                {/* https://github.com/mui-org/material-ui/issues/9343#issuecomment-377772257 */}
                <Tooltip id="tooltip-settings" title="Benutzereinstellungen" disableFocusListener>
                    <IconButton
                        aria-label="More"
                        aria-owns={anchorEl ? 'long-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleClick}
                        style={{ width: 48, height: 48, padding: 0, marginLeft: 8 }}
                    >
                        <UserAvatar size={36} />
                    </IconButton>
                </Tooltip>
                <Menu
                    disableRestoreFocus
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    getContentAnchorEl={undefined}
                >
                    <MenuItem onClick={this.openFeedback}>
                        <ListItemIcon>
                            <FeedbackIcon />
                        </ListItemIcon>
                        <ListItemText primary="Feedback senden" />
                    </MenuItem>
                    <MenuItem onClick={this.profilePicChange}>
                        <ListItemIcon>
                            <ProfilePicIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profilbild ändern" />
                    </MenuItem>
                    <MenuItem onClick={this.passwordChange}>
                        <ListItemIcon>
                            <KeyIcon />
                        </ListItemIcon>
                        <ListItemText primary="Passwort ändern" />
                    </MenuItem>
                    <MenuItem onClick={this.openReminderSettings}>
                        <ListItemIcon>
                            <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary="E-Mail-Erinnerungen" />
                    </MenuItem>
                    <MenuItem onClick={this.reset}>
                        <ListItemIcon>
                            <RefreshIcon />
                        </ListItemIcon>
                        <ListItemText primary="Reset" />
                    </MenuItem>
                    {false && (
                        <MenuItem onClick={this.setNotification}>
                            <ListItemIcon>
                                {this.props.notificationToken ? <NotificationsOff /> : <NotificationsOn />}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    'Benachrichtigungen ' +
                                    (this.props.notificationToken ? 'ausschalten' : 'anschalten')
                                }
                            />
                        </MenuItem>
                    )}
                    <MenuItem onClick={this.props.logOut}>
                        <ListItemIcon>
                            <LogOutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logOut: () => {
            dispatch(logOut());
        },
        setNotification: (newToken, oldToken) => {
            dispatch(setNotification(newToken, oldToken));
        },
        showError: text => {
            dispatch(showError(text));
        },
        loadMe: () => {
            dispatch(loadMe());
        },
    };
};

const mapStateToProps = state => {
    return {
        notificationToken: state.user.notificationToken,
        upn: state.user.upn,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(withRouter(UserSettingsMenu)));
