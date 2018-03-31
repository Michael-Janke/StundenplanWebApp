import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import { blue800, grey600 } from 'material-ui/styles/colors';

function RoomContainer({ room, small }) {
    const changed = !!room.old;
    const ClassNormal = changed ? NewRoom : Room;
    const Arrow = changed && <ArrowForward style={{ height: 10, width: null }} />;
    return (
        <Container>
            {!small && changed && <OldRoom>{room.old.NAME}</OldRoom>}
            {!small && Arrow}
            <ClassNormal>{room.new ? room.new.NAME : '-'}</ClassNormal>
        </Container>
    )
}

RoomContainer.propTypes = {
    room: PropTypes.object,
    small: PropTypes.bool,
};

const Container = styled.div`
    flex-direction: row;
    display: flex;
    align-items: center;
`;

const Room = styled.div`
    font-size: 70%;
`;

const NewRoom = styled(Room)`
    color: ${blue800};
    font-weight: 600;
    font-size: 65%;
`;

const OldRoom = styled(Room)`
    color: ${grey600};
    font-size: 50%;
`;



export default RoomContainer;