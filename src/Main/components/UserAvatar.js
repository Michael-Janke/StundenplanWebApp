import React from 'react';
import { useSelector } from 'react-redux';
import { ProfilePicture } from './Avatars';

const UserAvatar = ({ size }) => {
    const upn = useSelector(state => state.user.upn);
    return <ProfilePicture upn={upn} size={size} outline={true} />;
};

export default UserAvatar;
