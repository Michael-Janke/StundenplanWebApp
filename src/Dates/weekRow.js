import React, { Component } from 'react';
import styled from 'styled-components';

export default class WeekRow extends Component {

    render() {
        const { startOfWeek } = this.props;
        return (
            <Row>

            </Row>
        );
    }
}

const Row = styled.div`
    display: flex;
`;