import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadJoinedTeams } from './actions';
import TimeTable from '../TimeTable';
import { intervalCheckStart, intervalCheckStop } from './intervalCheck';

class Main extends Component {
    constructor(props) {
        super(props);
        props.loadJoinedTeams();
        intervalCheckStart();
    }

    render() {
        return <TimeTable />;
    }

    componentWillUnmount() {
        intervalCheckStop();
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadJoinedTeams: () => dispatch(loadJoinedTeams()),
    };
};

const mapStateToProps = state => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);
