import React, { useMemo } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Room from '@material-ui/icons/Room';
import { changeWeek } from '../../../Main/actions';
import { Paper, Grow } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
    },
    image: {
        display: 'flex',
        flexDirection: 'column',
        width: '10%',
    },
}));

function FastSelect({ open }) {
    const classes = useStyles();
    const rooms = useSelector(state => state.timetable.masterdata.Room);
    const dispatch = useDispatch();
    const levels = useMemo(
        () =>
            Object.values(rooms).reduce((acc, room) => {
                const match = room.NAME.match(/([A-Z]+)([\d]+)/);
                const level = match[1];
                acc[level] = acc[level] ? acc[level] : [];
                acc[level].push(room);
                return acc;
            }, {}),
        [rooms]
    );
    const maxCount = Math.max(...Object.values(levels).map(level => level.length));
    const width = 100 / maxCount + '%';
    return (
        <Grow in={open}>
            <Paper className={classes.root} square>
                <Typography variant="subtitle1">
                    Räume können auch direkt durch einen Klick auf den Raum in der Raumübersicht aufgerufen werden
                </Typography>
                {Object.keys(levels)
                    .sort()
                    .map(level => (
                        <div className={classes.row}>
                            {levels[level].map(room => (
                                <ButtonBase
                                    focusRipple
                                    key={room.roomID}
                                    className={classes.image}
                                    style={{ width }}
                                    onClick={() => dispatch(changeWeek('now', room.ROOM_ID, 'room'))}
                                >
                                    <Room />
                                    <Typography component="span" variant="h6" color="inherit">
                                        {room.NAME}
                                    </Typography>
                                </ButtonBase>
                            ))}
                        </div>
                    ))}
            </Paper>
        </Grow>
    );
}

export default FastSelect;
