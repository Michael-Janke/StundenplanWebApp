import React from 'react';
import { withStyles, Button, Paper, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { hideSplash } from './SplashScreen';

function NotFoundPage(props) {
    const { classes, retry, location } = props;
    const { pathname } = (location.state && location.state.referrer) || location;
    let { error = 0, message: messageProp } = location.state || props;

    if (!error) {
        return (
            <Redirect to="/" />
        );
    }
    let message = {
        404: `${pathname} konnte nicht gefunden werden`,
        400: `${pathname} konnte nicht geladen werden`,
        500: `In ${pathname} ist ein interner Fehler aufgetreten.`,
    }[error];

    // make sure splash is hidden
    hideSplash();

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={0}>
                <Typography variant="h5" paragraph>{message}</Typography>
                <Button component={Link} to="/">Zurück</Button>
                {retry && <Button onClick={retry}>Erneut versuchen</Button>}
                <ExpansionPanel className={classes.expansionPanel} elevation={0} square>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Details anzeigen</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div>
                            <Typography variant="body1" paragraph>
                                Errorcode: {error}
                            </Typography>
                            <Typography variant="body2" paragraph>
                                {messageProp &&
                                    messageProp
                                        .split("\n")
                                        .map((paragraph, i) =>
                                            <React.Fragment key={i}>{paragraph}<br/></React.Fragment>
                                        )}
                            </Typography>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

            </Paper>
        </div>
    );
}

const styles = theme => ({
    root: {
        height: '100%',
        width: '100%',
        overflow: 'auto',
        padding: `12.5% ${theme.spacing.unit*4}px`,
        boxSizing: 'border-box',
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        padding: theme.spacing.unit * 2,
    },
    expansionPanel: {
        '&:before': {
            content: 'unset',

        },
    }
});

export default withRouter(withStyles(styles)(NotFoundPage));