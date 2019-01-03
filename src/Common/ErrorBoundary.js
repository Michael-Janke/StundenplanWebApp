import React from 'react';
import { withStyles, Typography } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

const styles = theme => ({
    root: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
})

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    componentDidCatch(error, info) {
        this.setState({ error: { error, info } });
    }

    render() {
        const { error } = this.state;
        const { classes } = this.props;
        if (error) {
            return (
                <div className={classes.root}>
                    <Typography gutterBottom><ErrorIcon color="error" /></Typography>
                    <Typography variant="body1" color="textPrimary">Ein Fehler ist aufgetreten</Typography>
                    <Typography variant="body2" color="textSecondary">Bitte versuche es später erneut</Typography>
                </div>
            );
        }
        return this.props.children;
    }
}

export default withStyles(styles)(ErrorBoundary);