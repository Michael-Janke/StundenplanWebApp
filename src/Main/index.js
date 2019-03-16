import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadJoinedTeams, loadAssignments } from './actions';
import TimeTable from '../TimeTable';

class Main extends Component {
    constructor(props) {
        super(props);
        props.loadJoinedTeams();
        props.loadAssignments();
    }

    render() {
        return <TimeTable />;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadJoinedTeams: () => dispatch(loadJoinedTeams()),
        loadAssignments: () => dispatch(loadAssignments()),
    };
};

const mapStateToProps = state => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);
