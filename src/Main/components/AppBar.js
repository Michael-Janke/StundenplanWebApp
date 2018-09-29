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
import  Tooltip from '@material-ui/core/Tooltip';

const styles = ({
    icon: {
        color: grey[100]
    },
});

class ResponsiveDrawer extends React.Component {

    handleDrawerToggle = () => {
        this.props.toggleDrawer();
    };

    onPrintTimetable = () => {
        window.setTimeout(window.print, 0);
    }

    handleCalendar = () => {
        this.refs.calendar.getWrappedInstance().open();
    }

    render() {
        const { classes, small, large } = this.props;

        return (
            <Icons style={{ marginLeft: large ? "calc(300px + 2vw - 58px)" : undefined }}>
                <Search shrinkChildren={small} alwaysOpen={!small}>
                    {small ||
                        <Tooltip id="tooltip-print" title="Stundenplan drucken">
                            <IconButton onClick={this.onPrintTimetable}>
                                <PrintIcon className={classes.icon} />
                            </IconButton>
                        </Tooltip>
                    }
                    {this.props.children}
                </Search>
            </Icons>
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

const mapStateToProps = state => {
    return {
        small: state.browser.lessThan.medium,
        large: state.browser.greaterThan.medium,
    };
};

const mapDispatchToProps = dispatch => ({
    toggleDrawer: () => dispatch(toggleDrawer()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ResponsiveDrawer));