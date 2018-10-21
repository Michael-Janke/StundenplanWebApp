import React from 'react';
import { withStyles, Button, Paper, Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';

function NotFoundPage(props) {
    const { classes, location, error = 404, retry } = props;
    let message = {
        404: `${location.pathname} konnte nicht gefunden werden`,
        400: `${location.pathname} konnte nicht geladen werden`,
    }[error];
    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={0}>
                <Typography variant="title">{message}</Typography>
                <Button component={Link} to="/">Zurück</Button>
                {retry && <Button onClick={retry}>Erneut versuchen</Button>}
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