import React, { Component } from 'react';
import styled from 'styled-components';
import { cyan800, orange800 } from 'material-ui/styles/colors';
import Appointment from './appointment';
import moment from 'moment';

export default class Day extends Component {
    render() {
        const { date, appointments, onEdit } = this.props;
        return (
            <Container>
                <LeftHeader>
                    <DayOfMonth isToday={moment().diff(date, 'days') === 0}>{date.format("D")}</DayOfMonth>
                    <WeekdayName>{date.format("dd")}</WeekdayName>
                </LeftHeader>
                <Content>
                    {appointments.map((appointment, i) => (<Appointment {...appointment} onEdit={onEdit && onEdit.bind(null, appointment)} key={i} />))}
                </Content>
            </Container>
        )
    }
}

const Container = styled.div`
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    flex-direction: row;
    padding-top: 2vmin;
    padding-bottom: 2vmin;
    margin-left: .1vmin;
    margin-right: .1vmin;

`;

const LeftHeader = styled.div`
    display: flex;
    flex-direction: column;
`;

const WeekdayName = styled.div`
    font-size: 70%;
`;

const DayOfMonth = styled.div`
    font-size: 100%;
    font-weight: 600;
    color: ${props => props.isToday ? orange800 : cyan800};
`;

const Content = styled.div`
    width: 100%;
    margin-left: 2vmin;
`;