import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { loadAvatars } from '../actions';

import Avatar from 'material-ui/Avatar';
import PersonIcon from '@material-ui/icons/Person';

class UserAvatar extends Component {

    constructor(props) {
        super(props);
        this.checkAvatar(props)
    }

    componentWillReceiveProps(props) {
        this.checkAvatar(props)
    }

    checkAvatar(props) {
        if (!props.upn) return;
        if (!props.avatars) return;
        const avatar = props.avatars[props.upn];
        if (!avatar || moment(avatar.expires).isBefore(moment())) {
            props.loadAvatars([props.upn]);
        }
    }

    render() {
        const avatar = (this.props.avatars || {})[this.props.upn];
        return <Avatar
            src={avatar && ("data:image/jpg;base64," + avatar.img)}
            size={48}
            icon={<PersonIcon />}
        />
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