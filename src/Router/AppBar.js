import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBarComponent from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Apps';
import { connect } from 'react-redux';
import ArrowBack from '@material-ui/icons/ArrowBack';

import UserSettingsMenu from '../Main/components/UserSettingsMenu';
import indigo from '@material-ui/core/colors/indigo';
import { toggleDrawer } from '../Main/actions';
import { withRouter } from 'react-router-dom';
import { Typography, RootRef } from '@material-ui/core';

const styles = {
    toolbar: {
        minHeight: 64,
        justifyContent: 'space-between',
    },
    title: {
        width: '100%',
    },
    drawer: {
        marginRight: 20,
    },
};

const ColoredAppBar = withStyles(theme => ({
    root: {
        paddingLeft: 10,
        paddingRight: 10,
        zIndex: theme.zIndex.modal,
        transition: theme.transitions.create('box-shadow'),
    },
    colorDefault: {
        backgroundColor: indigo[600],
        color: 'white',
    },
}))(AppBarComponent);

class AppBar extends React.Component {
    state = { boxShadow: false };

    handleDrawerToggle = () => {
        this.props.toggleDrawer();
    };

    handleRootRef = ref => {
        if (this.body) {
            this.body.removeEventListener('scroll', this.handleScroll);
        }
        this.body = ref;
        if (this.body) {
            this.body.addEventListener('scroll', this.handleScroll);
        }
    };
    handleScroll = e => {
        const boxShadow = this.state.boxShadow;
        const scrollTop = Boolean(e.target.scrollTop !== 0);
        if (boxShadow !== scrollTop) {
            this.setState({ boxShadow: scrollTop });
        }
    };

    render() {
        const { classes, history, title, back, noBoxShadow, appBarComponent: AppBarComp } = this.props;
        const content = <UserSettingsMenu />;
        const appBarStyles = noBoxShadow && !this.state.boxShadow ? { boxShadow: 'none' } : null;
        var state = {
            back,
            title,
        };

        return (
            <>
                <ColoredAppBar className={classes.appBar} style={appBarStyles} color="default">
                    <Toolbar disableGutters variant="dense" className={classes.toolbar}>
                        {state && state.back ? (
                            <IconButton
                                color="inherit"
                                aria-label="go back"
                                className={classes.drawer}
                                onClick={history.goBack}
                            >
                                <ArrowBack />
                            </IconButton>
                        ) : (
                            <IconButton
                                color="inherit"
                                className={classes.drawer}
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        {state && state.title && (
                            <Typography variant="h6" color="inherit" className={classes.title}>
                                {state.title}
                            </Typography>
                        )}
                        {React.createElement(AppBarComp || React.Fragment, null, content)}
                    </Toolbar>
                </ColoredAppBar>

                <div className={classes.toolbar} />
                <RootRef rootRef={this.handleRootRef}>{this.props.children}</RootRef>
            </>
        );
    }
}
AppBar.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        small: state.browser.lessThan.medium,
        large: state.browser.greaterThan.medium,
    };
};

const mapDispatchToProps = dispatch => ({
    toggleDrawer: () => dispatch(toggleDrawer()),
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withStyles(styles, { withTheme: true })(AppBar))
);
