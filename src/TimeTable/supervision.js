import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Chip from '@material-ui/core/Chip';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import { classNames } from '../Common/const';

const styles = theme => ({
    root: {
        height: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    'supervision': {
        marginTop: 'calc(-8px + -0.5vmin)',
        fontSize: '70%',
        height: 16,
        backgroundColor: green[600],
        color: 'white',
        zIndex: 1,
    },
    'supervision-normal': {

    },
    'supervision-elimination': {
        backgroundColor: red[600],
        textDecoration: 'line-through black'
    },
    'supervision-extra_supervision': {
        backgroundColor: red[600],

    }
});

class Supervision extends React.Component {

    render() {
        const { classes, supervision } = this.props;
        return (
            <div className={classes.root}>
                <Chip
                    label={supervision.LOCATION || "Aufsicht"}
                    className={classNames(
                        classes.supervision,
                        classes['supervision-' + supervision.TYPE.toLowerCase()]
                    )}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Supervision);