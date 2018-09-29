import React from 'react';
import { withStyles, Button, Paper, Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';

function NotFoundPage(props) {
    const { classes, location } = props;
    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={0}>
                <Typography variant="title">{location.pathname} konnte nicht gefunden werden</Typography>
                <Button component={Link} to="/">Zurück</Button>
            </Paper>
        </div>
    );
}

const styles = theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        padding: theme.spacing.unit * 2,
    }

});

export default withRouter(withStyles(styles)(NotFoundPage));