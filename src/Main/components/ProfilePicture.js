import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { loadProfilePicture } from "../actions"
import IconButton from 'material-ui/IconButton'
import EditIcon from 'material-ui/svg-icons/content/create';

class ProfilePicture extends Component {

    constructor(props) {
        super(props);
        props.loadProfilePicture();
    }

    profilePicChange = () => {
        window.open("https://outlook.office365.com/ecp/PersonalSettings/EditAccount.aspx?chgPhoto=1&e" +
            "xsvurl=1&realm=wgmail.de",
            "popup", "width=600,height=400,status=yes,scrollbars=yes,resizable=yes");
    };

    render() {
        return (
            <Wrapper>
                <ProfileImg src={this.props.user.profilePicture} />
                <IconButton
                    onClick={this.profilePicChange}
                    style={{ right: 0, top: 0, position: 'absolute' }}
                >
                    <EditIcon />
                </IconButton>
                <Name>
                    {this.props.user.firstname}
                    &nbsp;
                    {this.props.user.lastname}
                    <br />
                    <Type>{{ TEACHER: "Lehrer", STUDENT: "Schüler", "": "" }[this.props.user.type || ""]}</Type>
                </Name>
            </Wrapper>
        );
    }
}

const Wrapper = styled.div`
    position: relative;
`
const ProfileImg = styled.img`
    width:100%;
`
const Name = styled.div`
    bottom: 5px;
    left: 0;
    width: 100%;
    background: rgba(0,0,0,0.7);
    padding: 5px 10px;
    color: white;
    font-weight: 300;
    font-size: 90%;
    position: absolute;
    text-align: right;
    box-sizing: border-box;
`
const Type = styled.div`
    font-size:75%;
`
const mapDispatchToProps = dispatch => {
    return {
        loadProfilePicture: () => {
            dispatch(loadProfilePicture());
        }
    };
};

const mapStateToProps = state => {
    return { user: state.user };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePicture);
