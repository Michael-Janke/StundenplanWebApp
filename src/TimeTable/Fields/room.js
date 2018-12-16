import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import cyan from '@material-ui/core/colors/cyan';
import Description from './description';


const RoomContainer = type => room => ({ small, themeClasses, description }) => {
    const changed = !!room.old || room.old === 0;
    let output;
    if (type === 'old') {
        output = (
            <OldRoom className={themeClasses['room-old']}>{room.old.NAME}</OldRoom>
        );
    }
    if (type === 'new') {
        const RoomNormal = changed ? NewRoom : Room;
        output = (
            <RoomNormal className={themeClasses[changed ? 'room-new' : 'room-normal']}>{room.new ? room.new.NAME : '-'}</RoomNormal>
        );
    }
    if (type === 'instead-of') {
        output = (
            <Room className={themeClasses[changed ? 'room-new' : 'room-normal']}>{room.substitution ? room.substitution.NAME : '-'}</Room>
        );
    }
    if (type === 'instead-by') {
        output = (
            <Room className={themeClasses[changed ? 'room-new' : 'room-normal']}>{room.substitution ? room.substitution.NAME : '-'}</Room>
        );
    }
    return description ? <Description classes={themeClasses} label="Raum" type="room">{output}</Description> : output;
}

export const roomStyles = (theme) => ({
    'room': {

    },
    'room-new': {
        color: theme.palette.type === 'dark' ? cyan[400] : blue[600],
    },
    'room-old': {
        color: grey[600],
    },
});

RoomContainer.propTypes = {
    room: PropTypes.object,
    small: PropTypes.bool,
};

// const Container = styled.div`
//     flex-direction: row;
//     display: flex;
//     align-items: center;
// `;

const Room = styled.div`
    font-size: 70%;
`;

const NewRoom = styled(Room)`
    font-weight: 600;
`;

const OldRoom = styled(Room)`
    font-size: 50%;
`;

export default RoomContainer;