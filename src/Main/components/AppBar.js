import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import NextIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import PrintIcon from 'material-ui/svg-icons/action/print';
import CalendarIcon from 'material-ui/svg-icons/action/event';
import MenuItem from 'material-ui/MenuItem';

import UserSettingsMenu from './UserSettingsMenu';
import Drawer from './Drawer';
import SearchBar from './SearchBar';
import { showError, changeWeek } from '../actions';

import { grey100 } from 'material-ui/styles/colors';
import { DRAWER_WIDTH } from '../../Common/const';

class WGAppBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    openDrawer = () => {
        this.setState({ open: true });
    }

    onPrintTimetable = () => {
        window.setTimeout(window.print, 0);
    }
    
    onCloseDrawer = (open) => {
        this.setState({ open });
    }

    render() {
        const small = this.props.small;
        return (
            <AppBar
                titleStyle={{
                    maxWidth: small ? 0 : DRAWER_WIDTH - 64,
                    flex: 1
                }}
                title={small ? "" : "Stundenplan"}
                style={{ boxShadow: 'none' }}
                onLeftIconButtonClick={this.openDrawer}
            >
                <SearchBar
                    anchorIfSmall={this} />
                <Icons>
                    {small || <IconButton tooltip="Voherige Woche" onClick={this.props.setPreviousWeek}>
                        <BackIcon color={grey100} />
                    </IconButton>}
                    {small && <IconButton tooltip="Kalendar öffnen">
                        <CalendarIcon color={grey100} />
                    </IconButton>}
                    {small || <IconButton tooltip="Nächste Woche" onClick={this.props.setNextWeek}>
                        <NextIcon color={grey100} />
                    </IconButton>}
                    {small || <IconButton tooltip="Stundenplan drucken" onClick={this.onPrintTimetable}>
                        <PrintIcon color={grey100} />
                    </IconButton>}
                    <UserSettingsMenu />
                </Icons>
                <Drawer
                    open={this.state.open}
                    onClose={this.onCloseDrawer}
                />
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
        showError: (text) => { dispatch(showError(text)); },
        setNextWeek: () => dispatch(changeWeek(1)),
        setPreviousWeek: () => dispatch(changeWeek(-1)),
    };
};

const mapStateToProps = state => {
    return {
        avatars: state.avatars,
        upn: state.user.upn,
        small: state.browser.lessThan.medium
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WGAppBar);