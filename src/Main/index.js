import React, { Component } from 'react';
import TimeTable from '../TimeTable';
import { intervalCheckStart, intervalCheckStop } from './intervalCheck';

class Main extends Component {
    constructor(props) {
        super(props);
        intervalCheckStart();
    }

    render() {
        return <TimeTable />;
    }

    componentWillUnmount() {
        intervalCheckStop();
    }
}
export default Main;
