import React from "react";
import { connect } from "react-redux";
import { loadAvatars } from '../actions';

import { ProfilePicture, checkAvatars } from "./Avatars";
import makeGetEffectiveAvatars from "../../Selector/avatars";

class UserAvatar extends React.Component {
    render() {
        const { upn } = this.props;
        checkAvatars([upn], this.props.loadAvatars);
        return ProfilePicture(upn, this.props.avatars, 48, true);
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadAvatars: (upns) => { dispatch(loadAvatars(upns)); },
    };
};

const makeMapStateToProps = () => {
    const getEffectiveAvatars = makeGetEffectiveAvatars();
    return (state) => ({
        avatars: getEffectiveAvatars(state),
        upn: state.user.upn,
    });
}

export default connect(makeMapStateToProps, mapDispatchToProps)(UserAvatar);