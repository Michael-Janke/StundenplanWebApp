import React from 'react';
import PropTypes from 'prop-types';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import cyan from '@material-ui/core/colors/cyan';
import Description from './description';

function Container({ className, description, type, children, setTimeTable, room }) {
    if (description) {
        return (
            <Description onClick={() => setTimeTable('room', room.ROOM_ID)} type="room" instead={type}>
                {children}
            </Description>
        );
    }
    return <div className={className}>{children}</div>;
}

const RoomContainer = type => room => ({ small, themeClasses, description, setTimeTable }) => {
    const changed = !!room.old || room.old === 0;
    if (type === 'old') {
        return (
            <Container
                description={description}
                setTimeTable={setTimeTable}
                room={room.old}
                className={themeClasses['room-old']}
            >
                {room.old ? room.old.NAME : '-'}
            </Container>
        );
    }
    if (type === 'new') {
        return (
            <Container
                description={description}
                setTimeTable={setTimeTable}
                room={room.new}
                className={themeClasses[changed ? 'room-new' : 'room']}
            >
                {room.new ? room.new.NAME : '-'}
            </Container>
        );
    }
    if (type === 'instead-of' || type === 'instead-by') {
        return (
            <Container
                description={description}
                setTimeTable={setTimeTable}
                room={room.new}
                className={themeClasses[changed ? 'room-new' : 'room']}
            >
                {room.substitution ? room.substitution.NAME : '-'}
            </Container>
        );
    }
};

export const roomStyles = theme => ({
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
});

RoomContainer.propTypes = {
    room: PropTypes.object,
    small: PropTypes.bool,
};

export default RoomContainer;
