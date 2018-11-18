import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Search from './Search';
import Keyboard from './Keyboard';

const styles = theme => ({
    root: {
        display: 'flex',
        width: '100%',
    },
});

class TvAppBar extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <div style={{ flex: 1, marginRight: '2vw' }}></div>
                <Search
                    alwaysOpen
                    open={this.props.open}
                    Keyboard={Keyboard}>
                </Search>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    open: !state.timetable.currentTimeTableId,
});


export default connect(mapStateToProps)(withStyles(styles)(TvAppBar));
