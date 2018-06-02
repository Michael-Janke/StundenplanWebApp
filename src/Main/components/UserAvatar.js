import React from "react";
import { connect } from "react-redux";
import { loadAvatars } from '../actions';

import { ProfilePicture, checkAvatars } from "./Avatars";

class UserAvatar extends React.Component {
    render() {
        const { upn } = this.props;
        checkAvatars([upn], this.props.avatars, this.props.loadAvatars);
        return ProfilePicture(upn, this.props.avatars, 48, true);
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadAvatars: (upns) => { dispatch(loadAvatars(upns)); },
    };
};

const mapStateToProps = state => {
    return {
        avatars: state.avatars,
        upn: state.user.upn,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAvatar);