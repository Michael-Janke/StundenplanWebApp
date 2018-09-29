import React from 'react';
import { Avatar } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import ClassIcon from '@material-ui/icons/Group';
import RoomIcon from '@material-ui/icons/Room';
import SubjectIcon from '@material-ui/icons/Book';
import moment from 'moment';
import createStore from '../../store';

const { store } = createStore();

export const checkAvatars = (upns, loadAvatars) => {
    const { avatars } = store.getState();
    const r = upns.filter((upn) => {
        if (!upn || !avatars) return false;
        const avatar = avatars[upn];
        return !avatar || moment(avatar.expires).isBefore(moment())
    });
    for(let i = 0; i<r.length; i += 10) {
        loadAvatars(r.slice(i, i+10));
    }
};

export const ObjectIcon = ({ type, upn, avatars, size, outline, ...other }) => {
    if (type === 'class') {
        return <ClassIcon {...other} />;
    }
    if (type === 'subject') {
        return <SubjectIcon {...other} />;
    }
    if (type === 'room' || type === 'all') {
        return <RoomIcon {...other} />;
    }
    return ProfilePicture(upn, avatars, size, outline, other);
}

export const ProfilePicture = (upn, avatars, size = 24, outline = false, other) =>
    (avatars && avatars[upn] && avatars[upn].img
        ? <Avatar src={"data:image/jpg;base64," + avatars[upn].img}
            style={{ height: size, width: size }}
            {...other} />
        : outline ?
            <Avatar style={{ height: size, width: size }} {...other}>
                <PersonIcon />
            </Avatar>
            :
            <PersonIcon style={{ height: size, width: size }} {...other} />
    );
