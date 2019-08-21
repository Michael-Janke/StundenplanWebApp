import React from 'react';
import PropTypes from 'prop-types';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import cyan from '@material-ui/core/colors/cyan';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    room: {
        fontSize: '70%',
    },
    'room-new': {
        fontSize: '70%',
        color: theme.palette.type === 'dark' ? cyan[400] : blue[600],
        fontWeight: 600,
    },
    'room-old': {
        color: grey[600],
        fontSize: '50%',
    },
}));

const Room = ({ type, room }) => {
    const themeClasses = useStyles();
    const changed = !!room.old || room.old === 0;
    if (type === 'old') {
        return (
            <div
                className={themeClasses['room-old']}
            >
                {room.old ? room.old.NAME : '-'}
            </div>
        );
    }
    if (type === 'new') {
        return (
            <div
                className={themeClasses[changed ? 'room-new' : 'room']}
            >
                {room.new ? room.new.NAME : '-'}
            </div>
        );
    }
    if (type === 'instead-of' || type === 'instead-by') {
        return (
            <div
                className={themeClasses[changed ? 'room-new' : 'room']}
            >
                {room.substitution ? room.substitution.NAME : '-'}
            </div>
        );
    }
};


Room.propTypes = {
    room: PropTypes.object,
    small: PropTypes.bool,
};

export default Room;
