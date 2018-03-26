import React from 'react';
import firebase from 'firebase';
import { connect } from "react-redux";

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';

import ProfilePicIcon from 'material-ui/svg-icons/action/account-circle';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import KeyIcon from 'material-ui/svg-icons/communication/vpn-key';
import NotificationsOn from 'material-ui/svg-icons/social/notifications-active';
import NotificationsOff from 'material-ui/svg-icons/social/notifications-off';

import { purge } from '../../store';
import { unregister } from '../../registerServiceWorker';
import { connectToServiceWorker } from '../../Common/firebase';
import { setNotification, showError } from '../actions';
import UserAvatar from './UserAvatar';

class UserSettingMenu extends React.Component {

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

    render() {
        return (
            <IconMenu
                iconButtonElement={
                    <IconButton
                        tooltipPosition="bottom-left"
                        tooltip="Benutzereinstellungen"
                        style={{ width: 48 + 8, height: 48, paddingLeft: 8, padding: 0 }}>
                        <UserAvatar />
                    </IconButton>}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                <MenuItem
                    primaryText="Profilbild ändern"
                    rightIcon={<ProfilePicIcon />}
                    onClick={this.profilePicChange} />
                <MenuItem
                    primaryText="Passwort ändern"
                    rightIcon={<KeyIcon />}
                    onClick={this.passwordChange} />
                <MenuItem
                    primaryText="Reset"
                    rightIcon={<RefreshIcon />}
                    onClick={this.reset} />
                <MenuItem
                    primaryText={"Benachrichtigungen " + (this.props.notificationToken ? "ausschalten" : "anschalten")}
                    rightIcon={this.props.notificationToken ? <NotificationsOff /> : <NotificationsOn />}
                    onClick={this.setNotification}
                />
            </IconMenu>
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



