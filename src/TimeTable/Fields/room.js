import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ArrowForward from '@material-ui/icons/ArrowForward';
import blue from 'material-ui/colors/blue';
import grey from 'material-ui/colors/grey';
const blue800 = blue['800'];
const grey600 = grey['600'];

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