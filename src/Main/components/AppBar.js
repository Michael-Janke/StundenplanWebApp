import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';
import CalendarIcon from '@material-ui/icons/Event';
import NextIcon from '@material-ui/icons/ArrowForward';
import FeedbackIcon from '@material-ui/icons/Feedback';
import PrintIcon from '@material-ui/icons/Print';
import Search from './Search.js';
import { connect } from 'react-redux';
import { changeWeek, showError } from '../actions';
import styled from 'styled-components';
import UserSettingsMenu from './UserSettingsMenu';
import grey from '@material-ui/core/colors/grey';
import ProfilePicture from './ProfilePicture';
import Feedback from './Feedback';
import indigo from '@material-ui/core/colors/indigo';
import OfficeIcons from '../../Common/office-icons';
import Waffle from './Waffle.js';

const Tooltip = ({ children }) => children;

const styles = theme => ({
    root: {
        overflow: 'hidden',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        backgroundColor: indigo[600],
    },
    toolbar: theme.mixins.toolbar,
    drawer: {
        width: 300,

    },
    icon: {
        color: grey[100]
    },
    links: {
        padding: theme.spacing.unit * 2,
    },
    linksHeader: {
        color: grey[600],
        paddingBottom: theme.spacing.unit,
    },
    linksList: {
        display: 'flex',
        flexWrap: 'wrap',
    }
});

class ResponsiveDrawer extends React.Component {
    state = {
        mobileOpen: false,
        searchOpen: false,
        feedbackOpen: false,
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

    handleFeedback = (open) => {
        this.setState({ feedbackOpen: !!open });
    }


    handleSearch = () => {
        this.setState({ searchOpen: !this.state.searchOpen });
    }

    render() {
        const { classes, theme, small } = this.props;

        const links = (
            <div className={classes.links}>
                <div className={classes.linksHeader}>
                    Apps
                </div>
                <div className={classes.linksList}>
                    {Object.entries(OfficeIcons).map(([key, value], i) => {
                        return (
                            <Waffle name={key} waffle={value} key={i} />
                        );
                    })}
                </div>
            </div>
        );
        const drawer = (
            <div className={classes.drawer}>
                <ProfilePicture />
                <Divider />
                {links}
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
                        >
                            <MenuIcon />
                        </IconButton>

                        <Icons>
                            <Search shrinkChildren={small} alwaysOpen={!small}>
                                {/* {small ||
                                    <Tooltip id="tooltip-theme" title="Theme ändern">
                                        <IconButton onClick={this.props.onThemeToggle}>
                                            <LampComponent className={classes.icon} />
                                        </IconButton>
                                    </Tooltip>
                                } */}

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
                                <Tooltip id="tooltip-feedback" title="Feedback">
                                    <IconButton onClick={this.handleFeedback}>
                                        <FeedbackIcon className={classes.icon} />
                                    </IconButton>
                                </Tooltip>
                                {small ||
                                    <Tooltip id="tooltip-print" title="Stundenplan drucken">
                                        <IconButton onClick={this.onPrintTimetable}>
                                            <PrintIcon className={classes.icon} />
                                        </IconButton>
                                    </Tooltip>
                                }
                                <UserSettingsMenu />
                            </Search>
                        </Icons>
                    </Toolbar>
                    <Feedback open={this.state.feedbackOpen} onClose={this.handleFeedback} />
                </AppBar>
                <Drawer
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={this.state.mobileOpen}
                    onClose={this.handleDrawerToggle}
                    onOpen={this.handleDrawerToggle}

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
`;


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
        small: state.browser.lessThan.medium,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ResponsiveDrawer));