import React from 'react';
import firebase from 'firebase';
import { connect } from "react-redux";
import Menu, { MenuItem } from 'material-ui/Menu';
import { ListItemIcon, ListItemText } from 'material-ui/List';

import IconButton from 'material-ui/IconButton';

import ProfilePicIcon from 'material-ui-icons/AccountCircle';
import RefreshIcon from 'material-ui-icons/Refresh';
import KeyIcon from 'material-ui-icons/VpnKey';
import NotificationsOn from 'material-ui-icons/NotificationsActive';
import NotificationsOff from 'material-ui-icons/NotificationsOff';

import { purge } from '../../store';
import { unregister } from '../../registerServiceWorker';
import { connectToServiceWorker } from '../../Common/firebase';
import { setNotification, showError } from '../actions';
import UserAvatar from './UserAvatar';

class UserSettingMenu extends React.Component {

    state = {};

    profilePicChange = () => {
        window.open("https://outlook.office365.com/ecp/PersonalSettings/EditAccount.aspx?chgPhoto=1&e" +
            "xsvurl=1&realm=wgmail.de",
            "popup", "width=600,height=400,status=yes,scrollbars=yes,resizable=yes");
    }

    passwordChange = () => {
        window.open("https://login.wgmail.de/adfs/portal/updatepassword?username=" + this.props.upn,
            "popup", "width=400,height=600,status=yes,scrollbars=yes,resizable=yes");
    }

    reset = () => {
        purge().finally(() => {
            localStorage.clear();
            unregister();
            window.location.reload();
        })
    }

    requestPermission = () => {
        const that = this;
        console.log('Requesting permission...');
        const messaging = firebase.messaging();
        return messaging.requestPermission().then(function () {
            console.log('Notification permission granted.');
        }).catch(function (err) {
            console.log('Unable to get permission to notify.', err);
            that.props.showError("Browser gab keine Erlaubnis für Benachrichtungen");
        });
    }

    setNotification = () => {
        if (this.props.notificationToken) {
            this.props.setNotification({
                oldToken: this.props.notificationToken,
                newToken: null
            });
        } else {
            const messaging = firebase.messaging();
            const that = this;
            this.requestPermission()
                .then(() => { return messaging.getToken() })
                .then((token) => that.props.setNotification({
                    oldToken: that.props.notificationToken,
                    newToken: token
                }))
                .catch((error) => { this.props.showError(error); debugger });
            connectToServiceWorker(this.props.setNotification, this.props.notificationToken);
        }
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };


    render() {
        const { anchorEl } = this.state;
        return (
            <div>
                <IconButton
                    aria-label="More"
                    aria-owns={anchorEl ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    style={{ width: 48 + 8, height: 48, paddingLeft: 8, padding: 0 }}
                >
                    <UserAvatar />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem
                        onClick={this.profilePicChange} >
                        <ListItemIcon>
                            <ProfilePicIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Profilbild ändern" />
                    </MenuItem>
                    <MenuItem
                        onClick={this.passwordChange}>
                        <ListItemIcon>
                            <KeyIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Passwort ändern" />
                    </MenuItem>
                    <MenuItem
                        onClick={this.reset}>
                        <ListItemIcon>
                            <RefreshIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Reset" />
                    </MenuItem>
                    <MenuItem
                        onClick={this.setNotification}>
                        <ListItemIcon>
                            {this.props.notificationToken ? <NotificationsOff /> : <NotificationsOn />}
                        </ListItemIcon>
                        <ListItemText inset primary={"Benachrichtigungen " + (this.props.notificationToken ? "ausschalten" : "anschalten")} />
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setNotification: (newToken, oldToken) => { dispatch(setNotification(newToken, oldToken)); },
        showError: (text) => { dispatch(showError(text)); },
    };
};

const mapStateToProps = state => {
    return {
        notificationToken: state.user.notificationToken
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingMenu);



