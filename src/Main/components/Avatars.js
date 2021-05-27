import React from 'react';
import { Avatar } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import ClassIcon from '@material-ui/icons/Group';
import RoomIcon from '@material-ui/icons/Room';
import SubjectIcon from '@material-ui/icons/Book';
import debounce from 'debounce';
import { useSelector } from 'react-redux';
import { loadAvatars } from '../actions';
import { dispatch } from '../../store';

export const ObjectIcon = ({ type, upn, size, profilePicSize, outline, ...other }) => {
    if (type === 'class') {
        return <ClassIcon {...other} />;
    }
    if (type === 'subject') {
        return <SubjectIcon {...other} />;
    }
    if (type === 'room' || type === 'all') {
        return <RoomIcon {...other} />;
    }
    return <UserIcon {...{ upn, size, profilePicSize, outline }} {...other} />;
};

var loadUpns = [];

const dispatchLoad = debounce(() => {
    dispatch(loadAvatars(loadUpns));
    loadUpns = [];
}, 200);

const loadAvatar = (upn) => {
    loadUpns.push(upn);
    dispatchLoad();
};

export const UserIcon = ({ upn, size = 24, profilePicSize, outline, ...other }) => {
    upn && loadAvatar(upn);
    const avatar = useSelector((state) => state.avatars[upn]);
    if (avatar && avatar.img) {
        return (
            <Avatar
                src={avatar.img}
                style={{ height: profilePicSize || size, width: profilePicSize || size }}
                {...other}
            />
        );
    }
    if (outline) {
        return (
            <Avatar style={{ height: size, width: size }} {...other}>
                <PersonIcon />
            </Avatar>
        );
    }
    return <PersonIcon style={{ height: size, width: size }} {...other} />;
};
