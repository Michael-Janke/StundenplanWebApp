import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Chip from '@material-ui/core/Chip';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
    root: {
        height: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    supervision: {
        marginTop: 'calc(-8px + -0.5vmin)',
        fontSize: '70%',
        height: 16,
        backgroundColor: green[600],
        color: 'white',
        zIndex: 1,
    }
});

class Supervision extends React.Component {

    render() {
        const { classes, supervision } = this.props;
        return (
            <div className={classes.root}>
                <Chip
                    label={supervision.LOCATION || "Aufsicht"}
                    className={classes.supervision}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Supervision);