import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { loadAvatars } from './actions';
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
import IconMenu from 'material-ui/IconMenu';
import { grey100 } from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import {purge} from '../configStores';
import {unregister} from '../registerServiceWorker';

class WGAppBar extends Component {
    constructor(props) {
        super(props);
    }

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

    reset() {
        purge().finally(() => {
            localStorage.clear();
            unregister();
            window.location.reload();
        })
    }

    render() {
        this.checkAvatar();
        const titleStyle = {
            maxWidth: DRAWER_WIDTH - 64,
            flex: 1
        };
        const small = this.props.small;
        return (
            <AppBar
                titleStyle={titleStyle}
                title="Stundenplan"
                style={{ boxShadow: 'none' }}>
                <SearchBar />
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
                                <Avatar src={this.props.avatar && ("data:image/jpg;base64," + this.props.avatar.img)} size={48} icon={< PersonIcon />} />
                            </IconButton>}
                        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                    >
                        <MenuItem primaryText="Profilbild ändern" rightIcon={<ProfilePicIcon />} onClick={() => this.profilePicChange()} />
                        <MenuItem primaryText="Reset" rightIcon={<RefreshIcon />} onClick={() => this.reset()}/>
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
        loadAvatars: (upns) => {
            dispatch(loadAvatars(upns));
        }
    };
};

const mapStateToProps = state => {
    return {
        avatars: state.avatars,
        upn: state.user.upn,
        avatar: state.avatars[state.user.upn],
        masterdata: state.timetable.masterdata,
        small: state.browser.lessThan.medium,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WGAppBar);