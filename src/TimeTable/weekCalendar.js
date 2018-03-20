import React, {Component} from "react";
import styled from "styled-components";
import muiThemeable from 'material-ui/styles/muiThemeable';

class WeekCalendar extends Component {
  render() {
    return (
        <Container>
            <Year>{this.props.year}</Year>
            <Week>KW {this.props.week}</Week>
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