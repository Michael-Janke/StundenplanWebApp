import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/SwipeableDrawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';
import CalendarIcon from '@material-ui/icons/Event';
import NextIcon from '@material-ui/icons/ArrowForward';
import FeedbackIcon from '@material-ui/icons/Feedback';
import PrintIcon from '@material-ui/icons/Print';
import LampIcon from '@material-ui/icons/LightbulbOutline';
import SearchIcon from '@material-ui/icons/Search';
import SearchBar from './SearchBar';
import { connect } from 'react-redux';
import { changeWeek, showError } from '../actions';
import styled from 'styled-components';
import UserSettingsMenu from './UserSettingsMenu';
import grey from 'material-ui/colors/grey';
import { DRAWER_WIDTH } from '../../Common/const';
import ProfilePicture from './ProfilePicture';
import Feedback from './Feedback';
import Transition from 'react-transition-group/Transition';
import indigo from 'material-ui/colors/indigo';

const styles = theme => ({
    root: {
        // flexGrow: 1,
        // zIndex: 1,
        overflow: 'hidden',
        // position: 'relative',
        display: 'flex',
        width: '100%',

    },
    appBar: {
        backgroundColor: indigo[600],
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: DRAWER_WIDTH,

    },
    content: {
        backgroundColor: theme.palette.background.default,
    },
    icon: {
        color: grey[100]
    }
});

class ResponsiveDrawer extends React.Component {
    state = {
        mobileOpen: false,
        searchOpen: false,
    };

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    onPrintTimetable = () => {
        window.setTimeout(window.print, 0);
    }

    handleCalendar = () => {
        this.refs.calendar.getWrappedInstance().open();
    }

    handleFeedback = () => {
        this.refs.feedback.getWrappedInstance().open();
    }
    handleSearch = () => {
        this.setState({ searchOpen: !this.state.searchOpen });
    }

    render() {
        const { classes, theme, small } = this.props;

        const drawer = (
            <div>
                <ProfilePicture />
                <Divider />
            </div>
        );
        return (
            <div className={classes.root}>
                <AppBar className={classes.appBar} style={{ boxShadow: 'none' }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerToggle}
                            className={classes.navIconHide}
                        >
                            <MenuIcon />
                        </IconButton>
                        <SearchBar />

                        <Icons>
                            {small || <IconButton tooltip="Theme ändern" onClick={this.props.onThemeToggle}>
                                <LampIcon className={classes.icon} />
                            </IconButton>}
                            {small || <IconButton tooltip="Feedback" onClick={this.handleFeedback}>
                                <FeedbackIcon className={classes.icon} />
                            </IconButton>}
                            {small || <IconButton tooltip="Voherige Woche" onClick={this.props.setPreviousWeek}>
                                <BackIcon className={classes.icon} />
                            </IconButton>}
                            {small && <IconButton tooltip="Kalendar öffnen">
                                <CalendarIcon className={classes.icon} />
                            </IconButton>}
                            {small || <IconButton tooltip="Nächste Woche" onClick={this.props.setNextWeek}>
                                <NextIcon className={classes.icon} />
                            </IconButton>}
                            {small || <IconButton tooltip="Stundenplan drucken" onClick={this.onPrintTimetable}>
                                <PrintIcon className={classes.icon} />
                            </IconButton>}
                            <UserSettingsMenu />
                        </Icons>
                    </Toolbar>
                    <Feedback ref="feedback" />
                </AppBar>
                <Drawer
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={this.state.mobileOpen}
                    onClose={this.handleDrawerToggle}
                    onOpen={this.handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer}
                </Drawer>
                <div className={classes.toolbar} />
            </div >
        );
    }
}

const Icons = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`


ResponsiveDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => {
    return {
        showError: (text) => { dispatch(showError(text)); },
        setNextWeek: () => dispatch(changeWeek(1)),
        setPreviousWeek: () => dispatch(changeWeek(-1)),
    };
};

const mapStateToProps = state => {
    return {
        avatars: state.avatars,
        upn: state.user.upn,
        small: state.browser.lessThan.medium
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ResponsiveDrawer));