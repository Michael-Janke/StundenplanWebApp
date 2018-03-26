import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { DRAWER_WIDTH } from "../Common/const";
import { grey200, grey600} from 'material-ui/styles/colors';
import muiThemeable from 'material-ui/styles/muiThemeable';
import TimeTableGrid from './timeTableGrid';
import WeekCalendar from './weekCalendar';

class View extends Component {

    renderPeriodHeader(period) {
        return (
            <Periods key={period.PERIOD_TIME_ID}>
                <Period>{period.PERIOD_TIME_ID - 1}.</Period>
            </Periods>
        )
    }

    renderPeriodTimes(period) {
        const lpad2 = (number) => (number < 10 ? '0' : '') + number;
        return (
            <Times key={period.PERIOD_TIME_ID}>
                <Time>{Math.floor(period.START_TIME / 100)}:{lpad2(period.START_TIME % 100)}</Time>
                <Time>{Math.floor(period.END_TIME / 100)}:{lpad2(period.END_TIME % 100)}</Time>
            </Times>
        )
    }

    renderHeaderColumn() {
        return (
            <HeaderColumn>
                {Object.values(this.props.periods).map(this.renderPeriodHeader, this)}
            </HeaderColumn>
        );
    }

    renderPeriodTimesColumn() {
        if (!this.props.showPeriods)
            return null;

        return (
            <HeaderColumn>
                {Object.values(this.props.periods).map(this.renderPeriodTimes, this)}
            </HeaderColumn>
        );
    }

    renderPeriod(period) {
        return (<Cell key={period.PERIOD_TIME_ID} />);
    }

    renderWeekDay(weekDay) {
        return (<WeekDayColumn key={weekDay}>
            {Object.values(this.props.periods).map(this.renderPeriod, this)}
        </WeekDayColumn>
        )
    }

    render() {
        const drawerMargin = this.props.showDrawer ? undefined : '1vw';
        return (
            <Container>
                <AppBar style={{ backgroundColor: this.props.muiTheme.palette.primary1Color }}>
                    <ShadowContainerEmu />
                </AppBar>
                {this.props.showDrawer && <Drawer>
                    <WeekCalendar selectedDate={this.props.timetableDate} />
                </Drawer>}
                <ShadowContainer style={{marginLeft: drawerMargin, marginRight: drawerMargin}}>
                    <ShadowBox>
                        <TimeTableGrid/>
                    </ShadowBox>
                </ShadowContainer>
            </Container>
        );
    }
}

const Container = styled.div`
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 100%;
    position: relative;
    color: ${grey600};
`

const Drawer = styled.div`
    width: ${DRAWER_WIDTH}px;
    min-width: ${DRAWER_WIDTH}px;
`

const ShadowContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 6px;
    margin-right: 1vw;
    margin-bottom: 1vw;
    max-width: 1200px;
    z-index: 1;
`
const ShadowBox = styled.div`
    background-color: white;
    box-shadow: rgba(0,0,0,0.3) 0px 0px 10px;
`
const ShadowContainerEmu = styled.div`
    margin-left: ${DRAWER_WIDTH}px;
    margin-right: 1vw;
    max-width: 1200px;
    width:100%;
    height: 1px;
`
const AppBar = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 104px;
    position: absolute;
`
const HeaderColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0.5;
`

const WeekDayColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex: 2
`
const Cell = styled.div`
    display: flex;
    flex: 1;
    border-bottom: solid 1px ${grey200};
`
const Times = styled.div`
    font-size:50%;
    flex:1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1vmin;
    border-bottom: solid 1px ${grey200};
`;
const Time = styled.div`

`;
const Periods = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: bold;
    flex:1;
    border-bottom: solid 1px ${grey200};
    padding: 5px;
`;
const Period = styled.div`

`;


const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
            dispatch();
        }
    };
};

const mapStateToProps = state => {
    return {
        masterdata: state.timetable.masterdata,
        timetableDate: state.timetable.timetableDate,
        periods: state.timetable.masterdata.Period_Time,
        showPeriods: state.browser.greaterThan.small,
        showDrawer: state.browser.greaterThan.small,
        mediaType: state.browser.mediaType,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(muiThemeable()(View));