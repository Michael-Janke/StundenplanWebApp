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

class WGAppBar extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if(!this.props.profilePictureSmall) {
            this.props.loadProfilePictureSmall();
        }
    }

    render() {
        const titleStyle = {
            width: DRAWER_WIDTH-64,
            flex: 'none'
        };
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
                    <Avatar src={this.props.profilePictureSmall} size={48} icon={< PersonIcon />}/>
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
    width: 100px;
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
        profilePictureSmall: state.user.profilePictureSmall
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WGAppBar);