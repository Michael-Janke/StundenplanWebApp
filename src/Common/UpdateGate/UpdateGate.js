import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ignoreUpdate } from './actions';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: theme.spacing(2),
    },
}));

export default function UpdateGate({ children }) {
    const updateAvailable = useSelector(state => state.update.updateAvailable);
    const fromServiceWorker = useSelector(state => state.update.fromServiceWorker);
    const classes = useStyles();
    const dispatch = useDispatch();

    if (updateAvailable) {
        return (
            <div className={classes.root}>
                <Typography variant="h4">Neue Version {fromServiceWorker ? 'verfügbar' : 'wird benötigt.'}</Typography>
                <Typography>Schließe dazu alle Fenster der Stundenplan-App.</Typography>
                <Button onClick={() => window.location.reload(true)} color="primary" variant="contained">
                    Jetzt neu laden
                </Button>
                {fromServiceWorker && (
                    <Button onClick={() => dispatch(ignoreUpdate())} color="primary" variant="outlined">
                        Ignorieren (Kann zu Fehler führen)
                    </Button>
                )}
            </div>
        );
    }
    return children;
}
