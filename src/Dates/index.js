import React, { Component } from "react";
import styled from "styled-components";
import muiThemeable from 'material-ui/styles/muiThemeable';
import moment from 'moment';
import { Paper } from "material-ui";
import { connect } from 'react-redux';
import Day from './day';


class WeekCalendar extends Component {
    render() {
        console.log(this.props.muiTheme);
        return (
            <Container>
                <Header>
                    <Year>{moment(this.props.timetableDate).format('YYYY')}</Year>
                    <Week>KW {moment(this.props.timetableDate).format('W')}</Week>
                </Header>
                <Content>
                    <Day date={moment()}></Day>
                </Content>
            </Container>
        );
    }
}
const Content = styled.div`
    height: 100%;
    overflow: auto;
`;

const Header = styled.div`
    border-bottom: 1px solid #e0e0e0;
`;

const Container = styled(Paper) `
    z-index: 1;
    margin-left: 1vw;
    margin-right: 1vw;
    padding: 16px;
    height: 100%;
`
const Year = styled.div`
    font-size: 70%;
`
const Week = styled.div`
    font-size: 100%;
`
const mapStateToProps = (state) => ({
    timetableDate: state.timetable.timetableDate,
});

export default connect(mapStateToProps)(muiThemeable()(WeekCalendar)); 