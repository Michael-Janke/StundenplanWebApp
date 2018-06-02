import React from 'react';
import { Avatar } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import ClassIcon from '@material-ui/icons/Group';
import RoomIcon from '@material-ui/icons/Room';
import moment from 'moment';

export const checkAvatars = (upns, avatars, loadAvatars) => {
    const r = upns.filter((upn) => {
        if (!upn || !avatars) return false;
        const avatar = avatars[upn];
        return !avatar || moment(avatar.expires).isBefore(moment())
    });
    if (r.length) {
        loadAvatars(r);
    }
};

export const ObjectIcon = ({ type, upn, avatars, size, outline, ...other }) => {
    if (type === 'class') {
        return <ClassIcon {...other} />;
    }
    if (type === 'room') {
        return <RoomIcon {...other} />;
    }
    return ProfilePicture(upn, avatars, size, outline, other);
}

export const ProfilePicture = (upn, avatars, size = 24, outline = false, other) =>
    (avatars[upn] && avatars[upn].img
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
