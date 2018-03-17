import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { loadAvatars, setNotification, showError } from './actions';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import PersonIcon from 'material-ui/svg-icons/social/person';
import { DRAWER_WIDTH } from '../Common/const';
import SearchBar from './searchBar';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import NextIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import PrintIcon from 'material-ui/svg-icons/action/print';
import CalendarIcon from 'material-ui/svg-icons/action/event';
import ProfilePicIcon from 'material-ui/svg-icons/action/account-circle';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import KeyIcon from 'material-ui/svg-icons/communication/vpn-key';
import NotificationsOn from 'material-ui/svg-icons/social/notifications-active';
import NotificationsOff from 'material-ui/svg-icons/social/notifications-off';
import IconMenu from 'material-ui/IconMenu';
import { grey100 } from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import { purge } from '../configStores';
import { unregister, subscribeNotifications, onTokenChange } from '../registerServiceWorker';


class WGAppBar extends Component {

    checkAvatar(props) {
        if (this.props.upn && this.props.avatars && !this.props.avatars.loading && !this.props.avatars[this.props.upn]) {
            this.props.loadAvatars([this.props.upn]);
        }
    }

    profilePicChange() {
        window.open("https://outlook.office365.com/ecp/PersonalSettings/EditAccount.aspx?chgPhoto=1&e" +
            "xsvurl=1&realm=wgmail.de",
            "popup", "width=600,height=400,status=yes,scrollbars=yes,resizable=yes");
    }

    passwordChange() {
        window.open("https://login.wgmail.de/adfs/portal/updatepassword?username=" + this.props.upn,
            "popup", "width=400,height=600,status=yes,scrollbars=yes,resizable=yes");
    }

    reset() {
        purge().finally(() => {
            localStorage.clear();
            unregister();
            window.location.reload();
        })
    }

    setNotification(event) {
        if (this.props.notificationToken) {
            this.props.setNotification(undefined)
        } else {
            subscribeNotifications(
                (token) => {
                    this.props.setNotification(token);
                    onTokenChange((token) => this.props.setNotification(token, this.props.notificationToken));
                },
                (error) => this.props.showError(error)
            );
        }
    }

    render() {
        this.checkAvatar();
        const titleStyle = {
            maxWidth: this.props.small ? 0 : DRAWER_WIDTH - 64,
            flex: 1
        };
        const small = this.props.small;
        return (
            <AppBar
                titleStyle={titleStyle}
                title={this.props.small ? "" : "Stundenplan"}
                style={{ boxShadow: 'none' }}>
                <SearchBar anchorIfSmall={this} />
                <Icons>
                    {small || <IconButton tooltip="Voherige Woche">
                        <BackIcon color={grey100} />
                    </IconButton>}
                    {small && <IconButton tooltip="Kalendar öffnen">
                        <CalendarIcon color={grey100} />
                    </IconButton>}
                    {small || <IconButton tooltip="Nächste Woche">
                        <NextIcon color={grey100} />
                    </IconButton>}
                    {small || <IconButton tooltip="Stundenplan drucken">
                        <PrintIcon color={grey100} />
                    </IconButton>}
                    <IconMenu
                        iconButtonElement={
                            <IconButton tooltip="Benutzereinstellungen" style={{ width: 48 + 8, height: 48, paddingLeft: 8, padding: 0 }}>
                                <Avatar src={this.props.avatar && this.props.avatar.img && ("data:image/jpg;base64," + this.props.avatar.img)} size={48} icon={< PersonIcon />} />
                            </IconButton>}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                    >
                        <MenuItem primaryText="Profilbild ändern" rightIcon={<ProfilePicIcon />} onClick={() => this.profilePicChange()} />
                        <MenuItem primaryText="Passwort ändern" rightIcon={<KeyIcon />} onClick={() => this.passwordChange()} />
                        <MenuItem primaryText="Reset" rightIcon={<RefreshIcon />} onClick={() => this.reset()} />
                        <MenuItem
                            primaryText={"Benachrichtigungen " + (this.props.notificationToken ? "ausschalten" : "anschalten")}
                            rightIcon={this.props.notificationToken ? <NotificationsOff /> : <NotificationsOn />}
                            onClick={this.setNotification.bind(this)}
                        />
                    </IconMenu>
                </Icons>
            </AppBar>
        )
    }
}
const Icons = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`

const mapDispatchToProps = dispatch => {
    return {
        loadAvatars: (upns) => { dispatch(loadAvatars(upns)); },
        setNotification: (newToken, oldToken) => { dispatch(setNotification(newToken, oldToken)); },
        showError: (text) => { dispatch(showError(text)); },
    };
};

const mapStateToProps = state => {
    return {
        avatars: state.avatars,
        upn: state.user.upn,
        avatar: state.avatars[state.user.upn],
        masterdata: state.timetable.masterdata,
        small: state.browser.lessThan.medium,
        notificationToken: state.user.notificationToken
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WGAppBar);