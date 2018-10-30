import React from 'react';
import grey from '@material-ui/core/colors/grey';
import withStyles from '@material-ui/core/styles/withStyles';

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

const Absence = ({ absence, classes, table }) => {
    let from = absence.PERIOD_FROM - 1;
    let to = absence.PERIOD_TO - 1;
    return (
        <div className={classes.container}>
            {absence.TEXT}
            {table || from === -1 ||
                ` (${from === to 
                    ? `${from}.`
                    : `${from}. - ${to}.`})`
            }
        </div>
    );
};
export default withStyles(styles)(Absence);