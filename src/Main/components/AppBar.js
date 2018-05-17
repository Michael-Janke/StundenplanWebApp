import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';
import CalendarIcon from '@material-ui/icons/Event';
import SearchIcon from '@material-ui/icons/Search';
import NextIcon from '@material-ui/icons/ArrowForward';
import FeedbackIcon from '@material-ui/icons/Feedback';
import PrintIcon from '@material-ui/icons/Print';
import LampIcon from '@material-ui/icons/LightbulbOutline';
import Search from '../../TimeTable/search.js';
import { connect } from 'react-redux';
import { changeWeek, showError } from '../actions';
import styled from 'styled-components';
import UserSettingsMenu from './UserSettingsMenu';
import grey from '@material-ui/core/colors/grey';
import { DRAWER_WIDTH } from '../../Common/const';
import ProfilePicture from './ProfilePicture';
import Feedback from './Feedback';
import indigo from '@material-ui/core/colors/indigo';
import { Tooltip } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

function LampOnIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="m9,21c0,0.55 0.45,1 1,1l4,0c0.55,0 1,-0.45 1,-1l0,-1l-6,0l0,1zm3,-19c-3.86,0 -7,3.14 -7,7c0,2.38 1.19,4.47 3,5.74l0,2.26c0,0.55 0.45,1 1,1l6,0c0.55,0 1,-0.45 1,-1l0,-2.26c1.81,-1.27 3,-3.36 3,-5.74c0,-3.86 -3.14,-7 -7,-7z" />
        </SvgIcon>
    );
}
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
        const LampComponent = theme.palette.type === 'dark' ? LampOnIcon : LampIcon;
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

                        <Icons>
                            <Tooltip id="tooltip-theme" title="Suchen">
                                <IconButton onClick={this.handleSearch}>
                                    <SearchIcon className={classes.icon} />
                                </IconButton>
                            </Tooltip>
                            {small ||
                                <Tooltip id="tooltip-theme" title="Theme ändern">
                                    <IconButton onClick={this.props.onThemeToggle}>
                                        <LampComponent className={classes.icon} />
                                    </IconButton>
                                </Tooltip>
                            }
                            {small ||
                                <Tooltip id="tooltip-feedback" title="Feedback">
                                    <IconButton onClick={this.handleFeedback}>
                                        <FeedbackIcon className={classes.icon} />
                                    </IconButton>
                                </Tooltip>
                            }
                            {small ||
                                <Tooltip id="tooltip-prev" title="Voherige Woche">
                                    <IconButton onClick={this.props.setPreviousWeek}>
                                        <BackIcon className={classes.icon} />
                                    </IconButton>
                                </Tooltip>
                            }
                            {small &&
                                <Tooltip id="tooltip-calendar" title="Kalendar öffnen">
                                    <IconButton>
                                        <CalendarIcon className={classes.icon} />
                                    </IconButton>
                                </Tooltip>
                            }
                            {small ||
                                <Tooltip id="tooltip-next" title="Nächste Woche">
                                    <IconButton onClick={this.props.setNextWeek}>
                                        <NextIcon className={classes.icon} />
                                    </IconButton>
                                </Tooltip>
                            }
                            {small ||
                                <Tooltip id="tooltip-print" title="Stundenplan drucken">
                                    <IconButton onClick={this.onPrintTimetable}>
                                        <PrintIcon className={classes.icon} />
                                    </IconButton>
                                </Tooltip>
                            }
                            <UserSettingsMenu />
                        </Icons>
                    </Toolbar>
                    <Search open={this.state.searchOpen} onClose={this.handleSearch}/>
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
                width: 100%;
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