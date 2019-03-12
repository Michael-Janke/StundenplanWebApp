import React from 'react';
import { connect } from 'react-redux';
import { loadAvatars } from '../actions';

import { ProfilePicture, checkAvatars } from './Avatars';

class UserAvatar extends React.Component {
    render() {
        const { upn, size } = this.props;
        checkAvatars([upn], this.props.loadAvatars);
        return <ProfilePicture upn={upn} size={size} outline={true} />;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadAvatars: upns => {
            dispatch(loadAvatars(upns));
        },
    };
};

const makeMapStateToProps = () => {
    return state => ({
        upn: state.user.upn,
    });
};

export default connect(
    makeMapStateToProps,
    mapDispatchToProps
)(UserAvatar);
