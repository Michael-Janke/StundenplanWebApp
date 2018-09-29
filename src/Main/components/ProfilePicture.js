import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { loadProfilePicture } from "../actions"
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Create';

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
                {this.props.user.profilePicture
                    ?<ProfileImg src={this.props.user.profilePicture} />
                    :<div style={{height:100, padding:20}}>Lade doch ein Profilfoto hoch.</div>}
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
                    <Type>{{ teacher: "Lehrer", student: "Schüler", "": "" }[this.props.user.type || ""]}</Type>
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
    height: 300px;
`
const Name = styled.div`
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0,0,0,0.7);
    padding: 5px 10px;
    color: white;
    font-weight: 300;
    font-size: 125%;
    position: absolute;
    text-align: right;
    box-sizing: border-box;
`
const Type = styled.div`
    font-size:80%;
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
