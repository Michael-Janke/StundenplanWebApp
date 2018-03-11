import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { loadProfilePictureSmall } from './actions';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import PersonIcon from 'material-ui/svg-icons/social/person';
import SearchIcon from 'material-ui/svg-icons/action/search';
import { DRAWER_WIDTH } from '../Common/const';
import SearchBar from 'material-ui-search-bar';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import NextIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import PrintIcon from 'material-ui/svg-icons/action/print';
import CalendarIcon from 'material-ui/svg-icons/action/event';

import { grey100 } from 'material-ui/styles/colors';


class WGAppBar extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (!this.props.profilePictureSmall) {
            this.props.loadProfilePictureSmall();
        }
    }

    render() {
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
                <Flex>
                    <SearchBar
                        onChange={() => console.log('onChange')}
                        onRequestSearch={() => console.log('onRequestSearch')}
                        hintText="Suche"
                        style={{
                            backgroundColor: '#C5CAE9',
                            marginTop: 8,
                            marginRight: 8,
                            left: DRAWER_WIDTH,
                            maxWidth: 800,
                            color: 'white'
                        }} />
                </Flex>
                <Icons>
                    {small || <IconButton tooltip="Voherige Woche">
                        <BackIcon color={grey100} />
                    </IconButton>}
                    <IconButton tooltip="Kalendar öffnen">
                        <CalendarIcon color={grey100} />
                    </IconButton>
                    {small || <IconButton tooltip="Nächste Woche">
                        <NextIcon color={grey100} />
                    </IconButton>}
                    {small || <IconButton tooltip="Stundenplan drucken">
                        <PrintIcon color={grey100} />
                    </IconButton>}
                    <IconButton tooltip="Benutzereinstellungen" style={{width: 48+8, height:48, paddingLeft: 8, padding: 0}}>
                        <Avatar src={this.props.profilePictureSmall} size={48} icon={< PersonIcon /> } />
                    </IconButton>
                </Icons>
            </AppBar>
        )
    }
}
const Flex = styled.div`
    flex: 1;
    display:flex;
    flex-direction: column;
`

const Icons = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`

const mapDispatchToProps = dispatch => {
    return {
        loadProfilePictureSmall: () => {
            dispatch(loadProfilePictureSmall());
        }
    };
};

const mapStateToProps = state => {
    return {
        profilePictureSmall: state.user.profilePictureSmall,
        small: state.browser.lessThan.medium,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WGAppBar);