import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';
import { grey } from 'material-ui/colors';
import styled from 'styled-components';
import PeriodColumn from './period';
import { WEEKDAY_NAMES, getSpecificSubstitutionType } from '../Common/const';
import WarningIcon from 'material-ui-icons/Warning';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui-icons/ArrowBack';
import NextIcon from 'material-ui-icons/ArrowForward';
import { changeWeek } from '../Main/actions';
import { NoPrint, Print } from 'react-easy-print';
import makeGetCurrentTimetable from '../Selector/timetable';

class TimeTableGrid extends Component {

    constructor(props) {
        super(props);
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
    renderPeriodHeader(period) {
        return (
            <Periods key={-period.PERIOD_TIME_ID}>
                <Period>{period.PERIOD_TIME_ID - 1}.</Period>
            </Periods>
        )
    }

    renderPeriodsRow(day, period) {
        if (!this.props.currentTimetable) { return <TableRowColumn key={day} />; }
        let dayObject = this.props.currentTimetable[day];
        if (dayObject.holiday) {
            return (
                <TableCell key={day}>
                    {dayObject.holiday}
                </TableCell>
            );
        } else {
            let lessons = dayObject.periods[period - 1];
            if (!lessons) {
                return null;
            }
            return (
                <TableCell
                    key={day}
                    style={{
                        textAlign: 'center', padding: '0.5vmin', overflow: 'visible', fontSize: '100%'
                    }}
                    rowSpan={lessons ? lessons.skip + 1 : 0}>
                    <PeriodColumn
                        lessons={lessons.lessons}
                        type={this.props.type}
                        avatars={this.props.avatars}
                        small={this.props.small} />
                </TableCell>
            );
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
                {WEEKDAY_NAMES.map((name, i) => this.renderPeriodsRow(i, period.PERIOD_TIME_ID))}
            </TableRow>
        ));
    }

    render() {
        const tableHeaderStyle = { color: grey[600], fontSize: '85%', textAlign: 'center', padding: 0, height: 42 };
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
                    <Table selectable={false} wrapperStyle={{ flexDirection: 'column', display: 'flex', height: '100%', flex: 1, maxHeight: 'calc(100vh - 82px)' }} >
                        <TableHead
                            style={{ backgroundColor: grey[200], fontSize: '100%' }}
                            displaySelectAll={false}
                            adjustForCheckbox={false}>
                            <TableRow>
                                <TableCell style={{ ...tableHeaderStyle, width: this.props.periodsWidth, padding: 2 }} />
                                {WEEKDAY_NAMES.map((weekday, i) => (
                                    <TableCell
                                        key={i}
                                        style={tableHeaderStyle}>
                                        {weekday}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody
                            displayRowCheckbox={false}>
                            {this.renderRows()}
                        </TableBody>

                        <TableFooter
                            adjustForCheckbox={false}
                        >
                            <NoPrint>
                                <TableRow>
                                    <TableCell colSpan="6" style={{ textAlign: 'right' }} >
                                        <IconButton primary={true} onClick={this.props.setPreviousWeek}>
                                            <BackIcon />
                                        </IconButton>
                                        <IconButton primary={true} onClick={this.props.setNextWeek}>
                                            <NextIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            </NoPrint>
                        </TableFooter>

                    </Table>
                </Print>
            </div>
        );
    }
}

const TableToolBar = styled.div`
    background-color: ${grey[200]};
    border-bottom: 1px solid rgb(224, 224, 224);
    height: 48px; 
    text-align: right;
    display: table;
    width: 100%;
`

const WarningText = styled.div`
    width: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 70%;
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
            periods: state.timetable.masterdata.Period_Time,
            id: state.timetable.currentTimeTableId,
            type: state.timetable.currentTimeTableType,
            small: state.browser.greaterThan.small,
            showDrawer: state.browser.greaterThan.small,
            small: state.browser.is.extraSmall || state.browser.is.medium,
            periodsWidth: (state.browser.is.extraSmall || state.browser.is.medium) ? 20 : 70,
            loading: state.timetable.loadingTimetable || state.timetable.loadingSubstitutions,
            avatars: state.avatars,
            warning: state.user.warning,
            lastCheck: state.user.lastCheck
        }
    }
    return mapStateToProps;
}


export default connect(makeMapStateToProps, mapDispatchToProps)(TimeTableGrid);
