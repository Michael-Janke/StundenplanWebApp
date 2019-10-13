import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import indigo from '@material-ui/core/colors/indigo';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import { darken } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';

class RoomList extends React.Component {
    extractRooms(rooms) {
        let e = {};
        rooms.forEach(r => {
            const array = r.NAME.match(/[a-zA-Z]+|[0-9]+/g);
            const floor = array[0];
            const number = array[1];
            const rooms = e[floor] || (e[floor] = []);
            rooms.push({ number, status: r.status });
        });
        return e;
    }

    render() {
        const { classes, rooms } = this.props;
        const extracted = this.extractRooms(rooms);
        return (
            <div className={classes.root}>
                {Object.entries(extracted).map(([key, entry], i) => (
                    <div key={key} className={classes.wrapper}>
                        <div className={classes.floor}>{key}</div>
                        <div className={classes.numbers}>
                            {entry.map(room => (
                                <div
                                    key={room.number}
                                    className={classNames(
                                        classes.number,
                                        room.status ? classes.numberFree : classes.numberBlocked
                                    )}
                                >
                                    {room.number}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        fontSize: '70%',
        backgroundColor: darken(indigo[50], theme.palette.type === 'dark' ? 0.6 : 0),
        flex: 1,
        height: '100%',
    },
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        padding: 8,
    },
    floor: {
        fontWeight: 600,
        marginRight: 4,
    },
    numbers: {
        fontSize: '80%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    number: {
        margin: `${theme.spacing(0.333)}px`,
    },
    numberFree: {
        padding: `0 ${theme.spacing(0.5) - 1}px`,
        fontWeight: 600,
        color: green[theme.palette.type === 'dark' ? 300 : 600],
        fontSize: '140%',
    },
    numberBlocked: {
        padding: `0 ${theme.spacing(0.5)}px`,
        fontSize: '100%',
        color: red[theme.palette.type === 'dark' ? 300 : 600] + '5c',
    },
});

export default withStyles(styles)(RoomList);
