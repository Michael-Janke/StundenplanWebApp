import React from 'react';
import { useSelector } from 'react-redux';
import { UserIcon } from './Avatars';

const UserAvatar = ({ size }) => {
    const upn = useSelector((state) => state.user.upn);
    return <UserIcon upn={upn} size={size} outline={true} />;
};

export default UserAvatar;
