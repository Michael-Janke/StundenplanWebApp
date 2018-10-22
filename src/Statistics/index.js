import React from 'react';
import { connect } from 'react-redux';
import { withStyles, Typography } from '@material-ui/core';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Tooltip from 'recharts/lib/component/Tooltip';
import Legend from 'recharts/lib/component/Legend';
import moment from 'moment';

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
    }
});

class Statistics extends React.Component {

    state = {
        week: 0,
        year: 2018,
    }

    componentWillMount() {
        this.props.loadLogIns(this.state.week, this.state.year);
    }

    render() {
        const { classes, logIns } = this.props;
        const data = logIns ? logIns.map(entry => ({ date: moment(entry.DATE).format("DD.MM"), count: entry.COUNT })) : [];
        return (
            <div className={classes.root}>
                <Typography variant="h2">Anmeldungen</Typography>
                <ResponsiveContainer width="99%" height={320}>
                    <LineChart data={data}>
                        <Line type="linear" dataKey="count" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Legend />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    logIns: state.admin.LogIn,
});
const mapDispatchToProps = dispatch => ({
    loadLogIns: (week, year) => dispatch({ type: 'GET_LOGIN_STATISTICS', payload: { action: 'LogIn', week, year } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Statistics));