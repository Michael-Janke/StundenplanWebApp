import React, {Component} from "react";
import styled from "styled-components";
import muiThemeable from 'material-ui/styles/muiThemeable';
import moment from 'moment';

class WeekCalendar extends Component {
  render() {
    return (
        <Container>
            <Year>{moment(this.props.timetableDate).format('YYYY')}</Year>
            <Week>KW {moment(this.props.timetableDate).format('W')}</Week>
        </Container>
    );
  }
}

const Container = styled.div`
    z-index: 1;
`
const Year = styled.div`
    font-size: 70%;
`
const Week = styled.div`
    font-size: 100%;
`

export default muiThemeable()(WeekCalendar); 