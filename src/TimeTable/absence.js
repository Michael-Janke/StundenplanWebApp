import React from 'react';
import grey from '@material-ui/core/colors/grey';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    container: {
        fontSize: '60%',
        color: theme.palette.type === 'dark' ? grey[400] : grey[600],
        flex: 1,
        backgroundColor: theme.palette.type === 'dark' ? grey[800] : grey[100],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const Absence = ({ absence, classes }) => {
    return (
        <div className={classes.container}>
            {absence.TEXT}
        </div>
    );
};
export default withStyles(styles)(Absence);