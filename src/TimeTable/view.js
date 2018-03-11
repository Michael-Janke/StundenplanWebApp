import React, {
    Component
} from "react";
import {
    connect
} from "react-redux";
import styled from "styled-components";
import { } from "./actions";
import {
    WEEKDAY_NAMES,
    DRAWER_WIDTH
} from "../Common/const";
import { grey200, grey600 } from 'material-ui/styles/colors'

import muiThemeable from 'material-ui/styles/muiThemeable';
import TimeTable from './index';

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
        const maxHeight = {
            extraSmall: undefined,
            small: undefined,
            medium: 400,
            large: 600,
            infinity: 800
        }[this.props.mediaType];
        const maxWidth = {
            extraSmall: undefined,
            small: undefined,
            medium: 600,
            large: 800,
            infinity: 1000
        }[this.props.mediaType];
        const drawerMargin = this.props.showDrawer ? undefined : '5vw';
        return (
            <Container>
                <AppBar style={{ backgroundColor: this.props.muiTheme.palette.primary1Color }}>
                </AppBar>
                <ShadowContainer style={{ marginLeft: drawerMargin }}>
                    <ToolBar>
                        <EmptyHeader>

                        </EmptyHeader>
                        {WEEKDAY_NAMES.map((weekDay, i) => <WeekdayHeader key={i}>{weekDay}</WeekdayHeader>)}
                    </ToolBar>
                    <Grid>
                        {this.renderPeriodTimesColumn()}
                        {this.renderHeaderColumn()}
                        <Ancor>
                            <TimeTableGrid>
                                {WEEKDAY_NAMES.map(this.renderWeekDay, this)}
                            </TimeTableGrid>
                            <TimeTableContainer>
                                {this.props.children}
                            </TimeTableContainer>
                        </Ancor>
                    </Grid>
                </ShadowContainer>
            </Container>
        );
    }
}

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    color: ${grey600};
`
const ShadowContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    box-shadow: rgba(0,0,0,0.3) 0px 0px 10px;
    margin-top: auto;
    margin-left: ${DRAWER_WIDTH}px;
    margin-right: 5vw;
    max-width: 1200px;
`

const AppBar = styled.div`
    display: flex;
    width: 100%;
    height: 64px;
    position: absolute;
`

const ToolBar = styled.div`
    flex:1;
    display:flex;
    flex-direction: row;
    height: 55px;
    margin-top: 9px;
    background-color: ${grey200};
    align-items: center;
    justify-content: space-around;
    z-index: 1;
`;


const WeekdayHeader = styled.div`
    font-size:85%;
    flex: 2;
    text-align: center;
`;

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
const EmptyHeader = styled.div`
    flex:1;
`;

const Grid = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: white;
    min-height: 500px;
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

const Ancor = styled.div`
    position:relative;
    flex:10;
    width:100%;
`
const TimeTableGrid = styled.div`
    position:absolute;
    top:0;
    height: 100%;
    width: 100%;
    display:flex;
    flex-direction: row;    
`
const TimeTableContainer = styled.div`
    min-height: 100%;
    width: 100%;  
`

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
        periods: state.timetable.masterdata.Period_Time,
        showPeriods: state.browser.greaterThan.small,
        showDrawer: state.browser.greaterThan.small,
        mediaType: state.browser.mediaType
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(muiThemeable()(View));