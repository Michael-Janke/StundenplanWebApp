import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import indigo from '@material-ui/core/colors/indigo';
import Search from './Search';

import SvgIcon from '@material-ui/core/SvgIcon';
import LampIcon from '@material-ui/icons/LightbulbOutline';
import { setTimeTable } from '../actions';
import Keyboard from './Keyboard';

function LampOnIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="m9,21c0,0.55 0.45,1 1,1l4,0c0.55,0 1,-0.45 1,-1l0,-1l-6,0l0,1zm3,-19c-3.86,0 -7,3.14 -7,7c0,2.38 1.19,4.47 3,5.74l0,2.26c0,0.55 0.45,1 1,1l6,0c0.55,0 1,-0.45 1,-1l0,-2.26c1.81,-1.27 3,-3.36 3,-5.74c0,-3.86 -3.14,-7 -7,-7z" />
        </SvgIcon>
    );
}

const styles = theme => ({
    root: {
        display: 'flex',
        width: '100%',
    },
    appBar: {
        backgroundColor: indigo[600],
        padding: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'row',
    },
    icon: {
        color: 'white',
    },

    toolbar: theme.mixins.toolbar,

});

class TvAppBar extends React.Component {
    render() {
        const { classes, theme } = this.props;
        const LampComponent = theme.palette.type === 'dark' ? LampOnIcon : LampIcon;
        return (
            <div className={classes.root}>
                <div style={{ flex: 1 }}></div>
                <Search
                    alwaysOpen
                    open={this.props.open}
                    Keyboard={Keyboard}>
                    <Tooltip id="tooltip-theme" title="Theme ändern">
                        <IconButton onClick={this.props.onThemeToggle}>
                            <LampComponent className={classes.icon} />
                        </IconButton>
                    </Tooltip>
                </Search>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    open: !state.timetable.currentTimeTableId,
});

const mapDispatchToProps = (dispatch) => ({
    clearTimetable: () => {
        dispatch(setTimeTable(null, 0));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(TvAppBar));
