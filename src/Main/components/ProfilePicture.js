import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { loadProfilePicture } from '../actions';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Create';
import computeUser from '../../Selector/user';
import { Typography, withStyles } from '@material-ui/core';

const styles = (theme) => ({
    name: {
        bottom: 0,
        left: 0,
        width: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '5px 10px',
        color: 'white',
        fontWeight: 300,
        fontSize: '125%',
        position: 'absolute',
        textAlign: 'right',
        boxSizing: 'border-box',
    },
});

class ProfilePicture extends Component {
    constructor(props) {
        super(props);
        props.loadProfilePicture();
    }

    profilePicChange = () => {
        window.open(
            'https://outlook.office365.com/ecp/PersonalSettings/EditAccount.aspx?chgPhoto=1&e' +
                'xsvurl=1&realm=wgmail.de',
            'popup',
            'width=600,height=400,status=yes,scrollbars=yes,resizable=yes'
        );
    };

    render() {
        const { classes } = this.props;
        return (
            <Wrapper>
                {this.props.userProfilePicture ? (
                    <ProfileImg src={this.props.userProfilePicture} />
                ) : (
                    <div style={{ height: 100, padding: 20 }}>Lade doch ein Profilfoto hoch.</div>
                )}
                <IconButton onClick={this.profilePicChange} style={{ right: 0, top: 0, position: 'absolute' }}>
                    <EditIcon />
                </IconButton>
                <Typography component="div" className={classes.name}>
                    {this.props.user.firstname}
                    &nbsp;
                    {this.props.user.lastname}
                    <br />
                    <Type>{{ teacher: 'Lehrer', student: 'Schüler', '': '' }[this.props.user.type || '']}</Type>
                </Typography>
            </Wrapper>
        );
    }
}

const Wrapper = styled.div`
    position: relative;
`;
const ProfileImg = styled.img`
    width: 100%;
    height: 300px;
    display: block;
`;

const Type = styled.div`
    font-size: 80%;
`;
const mapDispatchToProps = (dispatch) => {
    return {
        loadProfilePicture: () => {
            dispatch(loadProfilePicture());
        },
    };
};

const makeMapStateToProps = () => {
    return (state) => {
        return {
            user: computeUser(state),
            userProfilePicture: state.user.profilePicture,
        };
    };
};

export default withStyles(styles)(connect(makeMapStateToProps, mapDispatchToProps)(ProfilePicture));
