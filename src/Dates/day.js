import React, { Component } from 'react';
import styled from 'styled-components';

export default class Day extends Component {
    render() {
        const { date } = this.props;
        return (
            <Container>
                <LeftHeader>

                </LeftHeader>

            </Container>
        )
    }
}

const Container = styled.div`
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    flex-direction: row;
`;

const LeftHeader = styled.div`
    width: 30px;
`;

const Content = styled.div`

`;