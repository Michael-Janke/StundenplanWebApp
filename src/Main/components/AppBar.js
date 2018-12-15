import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import Search from './Search.js';
import { connect } from 'react-redux';
import styled from 'styled-components';
import grey from '@material-ui/core/colors/grey';
import { toggleDrawer } from '../actions.js';
import Tooltip from '@material-ui/core/Tooltip';
import MailIcon from '@material-ui/icons/Mail';
import Badge from '@material-ui/core/Badge';
import PrintDialog from '../../TimeTable/Print';
import MailDialog from './Mail';


const styles = ({
    icon: {
        color: grey[100]
    },
});

class AppBar extends React.Component {

    state = { printOpen: false, mailOpen: false };

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = event => {
        if (event.ctrlKey && event.keyCode === 80) {
            event.preventDefault();
            this.setState({ printOpen: true });
        }
    }
    
    handleDrawerToggle = () => {
        this.props.toggleDrawer();
    };

    onPrintTimetable = () => {
        // window.setTimeout(window.print, 0);
        this.setState({ printOpen: true });
    }

    handlePrintClose = () => {
        this.setState({ printOpen: false });
    }

    onMailOpen = () => {
        // window.setTimeout(window.print, 0);
        this.setState({ mailOpen: true });
    }

    handleMailClose = () => {
        this.setState({ mailOpen: false });
    }


    render() {
        const { classes, small, large, unreadMessages } = this.props;
        const { printOpen, mailOpen } = this.state;
        return (
            <React.Fragment>
                <Icons style={{ marginLeft: large ? "calc(300px + 2vw - 58px)" : undefined }}>
                    <Search shrinkChildren={small} alwaysOpen={!small}>
                        {small ||
                            <Tooltip id="tooltip-print" title="Stundenplan drucken">
                                <IconButton onClick={this.onPrintTimetable}>
                                    <PrintIcon className={classes.icon} />
                                </IconButton>
                            </Tooltip>
                        }
                        <Tooltip id="tooltip-print" title="Ungelesene Nachrichten">
                            <IconButton onClick={this.onMailOpen}>
                                <Badge badgeContent={unreadMessages} invisible={!unreadMessages} color="secondary">
                                    <MailIcon className={classes.icon} />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        {this.props.children}
                    </Search>
                </Icons>
                <PrintDialog open={printOpen} onClose={this.handlePrintClose} />
                <MailDialog open={mailOpen} onClose={this.handleMailClose} />
            </React.Fragment>
        );
    }
}

const Icons = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

AppBar.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        small: state.browser.lessThan.medium,
        large: state.browser.greaterThan.medium,
        unreadMessages: state.teams.unreadMessages || 0,
    };
};

const mapDispatchToProps = dispatch => ({
    toggleDrawer: () => dispatch(toggleDrawer()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AppBar));