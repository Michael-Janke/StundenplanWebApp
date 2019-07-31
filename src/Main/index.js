import React, { Component } from 'react';
import TimeTable from '../TimeTable';
import { intervalCheckStart, intervalCheckStop } from './intervalCheck';

class Main extends Component {
    componentDidMount() {
        intervalCheckStart();
    }

    componentWillUnmount() {
        intervalCheckStop();
    }

    render() {
        return <TimeTable />;
    }
}

export default Main;
