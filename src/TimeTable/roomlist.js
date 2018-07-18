import React from 'react';
import { withStyles } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import { darken } from '@material-ui/core/styles/colorManipulator';

class RoomList extends React.Component {

    extractRooms(rooms) {
        let e = {};
        rooms.forEach(r => {
            const array = r.NAME.match(/[a-zA-Z]+|[0-9]+/g);
            const floor = array[0];
            const number = array[1];
            const rooms = e[floor] || (e[floor] = []);
            rooms.push(number);
        });
        return e;
    }

    render() {
        const { classes, rooms } = this.props;
        const extracted = this.extractRooms(rooms);
        return (
            <div className={classes.root}>
                {Object.entries(extracted).map(([key, entry], i) => (
                    <div key={i} className={classes.wrapper}>
                        <div className={classes.floor}>{key}</div>
                        <div className={classes.numbers}>
                            {entry.map((number, j) => (
                                <div className={classes.number} key={j}>{number}
                                    {(j < entry.length - 1) ? ", " : ""}</div>
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
        fontSize: '70%',
        display: 'flex',
        flexWrap: 'wrap',

    },
    number: {
    },
});

export default withStyles(styles)(RoomList);