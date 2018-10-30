import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    root: {

    }
});

class Supervisions extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                test
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    supervisions: state.substitutions.supervisions,
});

export default withStyles(styles)(connect(mapStateToProps)(Supervisions));