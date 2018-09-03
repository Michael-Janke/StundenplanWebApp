import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
    root: {
        height: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    'supervision': {
        marginTop: 'calc(-8px + -0.5vmin)',
        fontSize: '60%',
        height: 16,
        color: 'white',
        zIndex: 1,
    },
    'supervision-normal': {
        maxWidth: '100%'
    }
});

class Supervision extends React.Component {

    render() {
        const { classes, supervision } = this.props;
        return (
            <div className={classes.root}>
                <Chip
                    label={supervision.LOCATION || "Aufsicht"}
                    style={{
                        backgroundColor: (supervision.TYPE === "NORMAL" ? "rgba(67, 160, 71, 0.85)" : "rgba(229, 57, 53, 0.85)"),
                        textDecorationLine: (supervision.TYPE === "ELIMINATION" ? "line-through" : ""),
                    }}
                    className={classes.supervision}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Supervision);