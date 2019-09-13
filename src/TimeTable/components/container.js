import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Grid from './Grid';
import Header from './Header';
import Dates from './Dates';

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
};

const TimeTableContainer = ({ classes, ...other }) => (
    <div className={classes.root}>
        <Header {...other} />
        <Grid {...other} />
        {!other.noSubstitutions && <Dates {...other} />}
    </div>
);

export default withStyles(styles)(TimeTableContainer);
