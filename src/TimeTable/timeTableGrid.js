import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';
import { grey } from 'material-ui/colors';
import PeriodColumn from './period';
import { WEEKDAY_NAMES, getSpecificSubstitutionType } from '../Common/const';
import WarningIcon from 'material-ui-icons/Warning';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui-icons/ArrowBack';
import NextIcon from 'material-ui-icons/ArrowForward';
import { NoPrint, Print } from 'react-easy-print';

import { changeWeek } from '../Main/actions';
import makeGetCurrentTimetable from '../Selector/timetable';
import Holiday from './Holiday';


class TimeTableGrid extends Component {

    renderPeriodTimes(period) {
        const lpad2 = (number) => (number < 10 ? '0' : '') + number;
        return (
            <Times key={period.PERIOD_TIME_ID}>
                <Time>{Math.floor(period.START_TIME / 100)}:{lpad2(period.START_TIME % 100)}</Time>
                <Time>{Math.floor(period.END_TIME / 100)}:{lpad2(period.END_TIME % 100)}</Time>
            </Times>
        )
    }

    renderPeriodHeader(period) {
        return (
            <Periods key={-period.PERIOD_TIME_ID}>
                <Period>{period.PERIOD_TIME_ID - 1}.</Period>
            </Periods>
        )
    }

    renderPeriodsColumn(day, periodNumber) {
        if (!this.props.currentTimetable) { return <TableCell key={day} />; }
        let dayObject = this.props.currentTimetable[day];
        if (dayObject.holiday) {
            if (periodNumber !== 1) return;
            let isNextDay = (this.props.currentTimetable[day - 1] || {}).holiday === dayObject.holiday;
            return [
                <TableCell key={day} colSpan={4} rowSpan={0} style={{ padding: 0, height: 1 }}>
                    <Holiday holiday={dayObject.holiday} date={dayObject.date.format("dd.mm")} noText={isNextDay} />
                </TableCell>
            ];
        } else {
            let period = dayObject.periods[periodNumber - 1];
            let absences = (dayObject.absences || [])[periodNumber];
            if (!period) {
                return null;
            }
            return [
                <TableCell
                    key={day}
                    colSpan={absences ? 3 : 4}
                    style={{
                        textAlign: 'center', padding: '0.5vmin', overflow: 'visible', fontSize: '100%'
                    }}
                    rowSpan={period ? period.skip + 1 : 0}>
                    <PeriodColumn
                        lessons={period.lessons}
                        type={this.props.type}
                        avatars={this.props.avatars}
                        small={this.props.small} />
                </TableCell>,
                absences && absences.first &&
                <TableCell
                    key={"absence" + day}
                    colSpan={1}
                    rowSpan={absences.skip}
                    style={{
                        padding: 0,
                    }}>
                    <div style={{ wordWrap: 'break-word' }}>{absences.text}</div>
                </TableCell>
            ];
        }
    }

    renderRows() {
        if (!this.props.id || !this.props.type || this.props.loading) {
            return null;
        }
        const periodColumnStyle = {
            width: this.props.periodsWidth,
            fontSize: '100%',
            padding: 2,
        };
        return Object.values(this.props.periods).map((period, i) => (
            <TableRow key={i}>
                <TableCell style={periodColumnStyle}>
                    <div style={{ display: 'flex', alignContent: 'space-between', height: '100%' }}>
                        {!this.props.small && this.renderPeriodTimes(period)}
                        {this.renderPeriodHeader(period)}
                    </div>
                </TableCell>
                {[].concat.apply([],
                    WEEKDAY_NAMES.map((name, i) => this.renderPeriodsColumn(i, period.PERIOD_TIME_ID))
                )}
            </TableRow>
        ));
    }

    render() {
        const tableHeaderStyle = { color: grey[600], fontSize: '85%', textAlign: 'center', padding: 0, height: 42 };
        const headerHeight = !this.props.showDrawer ? 128 : 82;
        return (
            <div style={{ flexDirection: 'column', display: 'flex', height: '100%' }}>
                {!this.props.showDrawer ? <TableToolBar>
                    <IconButton primary={true} onClick={this.props.setPreviousWeek}>
                        <BackIcon />
                    </IconButton>
                    <IconButton primary={true} onClick={this.props.setNextWeek}>
                        <NextIcon />
                    </IconButton>
                </TableToolBar> : null}
                <Print main name="TimeTable">
                    <div style={{ flexDirection: 'column', display: 'flex', height: '100%', flex: 1, maxHeight: `calc(100vh - ${headerHeight}px)` }}>
                        <GrayoutTable
                            disabled={this.props.counterChanged}
                            selectable={false}

                        >
                            <TableHead
                                style={{ backgroundColor: grey[200], fontSize: '100%' }}
                                displaySelectAll={false}
                                adjustForCheckbox={false}>
                                <TableRow>
                                    <TableCell style={{ ...tableHeaderStyle, width: this.props.periodsWidth, padding: 2 }} />
                                    {this.props.currentTimetable && this.props.currentTimetable.map((day, i) => (
                                        <TableCell
                                            key={i}
                                            colspan={4}
                                            style={tableHeaderStyle}>
                                            {day.date.format(this.props.small ? 'dd' : 'dddd')}
                                            <br />
                                            {day.date.format('DD.MM.')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody
                                displayRowCheckbox={false}>
                                {this.renderRows()}
                            </TableBody>

                            {this.props.showDrawer && <TableFooter
                                adjustForCheckbox={false}
                            >
                                <TableRow>
                                    <TableRow colSpan="6" style={{ textAlign: 'right' }} >
                                        <NoPrint>
                                            <IconButton onClick={this.props.setPreviousWeek}>
                                                <BackIcon />
                                            </IconButton>
                                            <IconButton onClick={this.props.setNextWeek}>
                                                <NextIcon />
                                            </IconButton>
                                        </NoPrint>
                                    </TableRow>
                                </TableRow>
                            </TableFooter>}

                        </GrayoutTable>
                    </div>
                </Print>
            </div>
        );
    }
}

const GrayoutTable = styled(Table) `
    ${props => props.disabled && `
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: grayscale(100%);
        filter: gray;`
    }
    table-layout: fixed;
    width: 100%;
`;

const TableToolBar = styled.div`
    background-color: ${grey[200]};
    border-bottom: 1px solid rgb(224, 224, 224);
    height: 48px; 
    text-align: right;
    display: table;
    width: 100%;
`

const Times = styled.div`
    font-size:50%;
    flex:1;
    display: flex;
    flex-direction: column;
    padding: 1vmin;
    justify-content: center;
`;
const Time = styled.div`
        
`;
const Periods = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: bold;
    padding-left: 3px;
    flex:1;
`;
const Period = styled.div`
        
`;

const mapDispatchToProps = dispatch => {
    return {
        setNextWeek: () => dispatch(changeWeek(1)),
        setPreviousWeek: () => dispatch(changeWeek(-1)),
    };
};

const makeMapStateToProps = () => {
    const getCurrentTimetable = makeGetCurrentTimetable()
    const mapStateToProps = (state, props) => {
        return {
            currentTimetable: getCurrentTimetable(state, props),
            date: state.timetable.timetableDate,
            periods: state.timetable.masterdata.Period_Time,
            id: state.timetable.currentTimeTableId,
            type: state.timetable.currentTimeTableType,
            showDrawer: state.browser.greaterThan.small,
            small: state.browser.is.extraSmall || state.browser.is.medium,
            periodsWidth: (state.browser.is.extraSmall || state.browser.is.medium) ? 20 : 70,
            loading: state.timetable.loadingTimetable || state.timetable.loadingSubstitutions,
            avatars: state.avatars,
            warning: state.user.warning,
            lastCheck: state.user.lastCheck,
            counterChanged: state.timetable.counterChanged,
        }
    }
    return mapStateToProps;
}


export default connect(makeMapStateToProps, mapDispatchToProps)(TimeTableGrid);