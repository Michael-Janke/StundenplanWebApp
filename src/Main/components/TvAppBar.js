import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { withStyles } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import Search from './Search';

const styles = theme => ({
    root: {
        overflow: 'hidden',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        backgroundColor: indigo[600],
        padding: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'row',
    },

    toolbar: theme.mixins.toolbar,

});

class TvAppBar extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar className={classes.appBar} style={{ boxShadow: 'none' }}>
                    <div style={{ flex: 1 }}/>    
                    <Search />
                </AppBar>
                <div className={classes.toolbar} />
            </div>
        );
    }
}

export default withStyles(styles)(TvAppBar);
