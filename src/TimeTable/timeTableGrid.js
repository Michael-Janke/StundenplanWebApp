import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { grey } from 'material-ui/colors';
import PeriodColumn from './period';
import { WEEKDAY_NAMES } from '../Common/const';
import IconButton from 'material-ui/IconButton';
import BackIcon from '@material-ui/icons/ArrowBack';
import NextIcon from '@material-ui/icons/ArrowForward';
import { NoPrint, Print } from 'react-easy-print';

import { changeWeek } from '../Main/actions';
import makeGetCurrentTimetable from '../Selector/timetable';
import Holiday from './Holiday';
import { withStyles } from 'material-ui';


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
            if (isNextDay) return;
            let colSpan = this.props.currentTimetable.slice(day).filter((dayX) => dayX.holiday === dayObject.holiday).length;
            let date = this.props.date.clone().weekday(0).add(day - 1, 'days');
            return (
                <TableCell key={day} rowSpan={Object.values(this.props.periods).length} style={{ padding: 0 }} colSpan={colSpan}>
                    <Holiday holiday={dayObject.holiday} date={date.format("DD.MM")} />
                </TableCell>
            );
        } else {
            let period = dayObject.periods[periodNumber - 1];
            if (!period) {
                return null;
            }
            return (
                <TableCell
                    key={day}
                    style={{
                        textAlign: 'center', padding: '0.5vmin', overflow: 'visible', fontSize: '100%'
                    }}
                    rowSpan={period ? period.skip + 1 : 0}>
                    <PeriodColumn
                        lessons={period.lessons}
                        type={this.props.type}
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
                {WEEKDAY_NAMES.map((name, i) => this.renderPeriodsColumn(i, period.PERIOD_TIME_ID))}
            </TableRow>
        ));
    }

    render() {
        const { classes } = this.props;
        const tableHeaderStyle = { fontSize: '85%', textAlign: 'center', padding: 0, height: 42 };

        return (
            <div style={{ flexDirection: 'column', display: 'flex', height: '100%' }}>
                <Print main name="TimeTable">
                    <TableToolBar className={classes['table-header']} border={this.props.theme.palette.divider}>

                        <NoPrint>
                            <IconButton onClick={this.props.setPreviousWeek}>
                                <BackIcon />
                            </IconButton>
                            <IconButton onClick={this.props.setNextWeek}>
                                <NextIcon />
                            </IconButton>
                        </NoPrint>
                    </TableToolBar>
                    <div>
                        <GrayoutTable className={classes['table-header']}>
                            <TableHead
                                style={{ fontSize: '100%' }}>
                                <TableRow style={{ height: 48 }}>
                                    <TableCell style={{ ...tableHeaderStyle, width: this.props.periodsWidth, padding: 2 }} />
                                    {[1, 2, 3, 4, 5].map((day, i) => {
                                        let date = this.props.date.clone().weekday(0).add(day - 1, 'days');
                                        return (
                                            <TableCell
                                                key={i}
                                            // style={tableHeaderStyle}
                                            >
                                                {date.format(this.props.small ? 'dd' : 'dddd')}
                                                <br />
                                                {date.format('DD.MM.')}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>
                        </GrayoutTable>
                        <div style={{ maxHeight: `calc(100vh - ${180}px)`, overflowY: 'auto' }}>
                            <GrayoutTable
                                className={classes.table}
                                disabled={this.props.counterChanged}
                            >
                                <TableBody>
                                    {this.renderRows()}
                                </TableBody>
                            </GrayoutTable>
                        </div>
                    </div>
                </Print>
            </div>
        );
    }
}

const styles = theme => ({
    table: {
        backgroundColor: theme.palette.background.default,
    },
    'table-header': {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
    },
    'table-footer': {
        backgroundColor: theme.palette.background.paper,
    }
});

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
    height: 100%;
`;

const TableToolBar = styled.div`
    // background-color: ${grey[200]};
    border-bottom: 1px solid ${props => props.border};
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
            currentTimetable: getCurrentTimetable(state),
            date: state.timetable.timetableDate,
            periods: state.timetable.masterdata.Period_Time,
            id: state.timetable.currentTimeTableId,
            type: state.timetable.currentTimeTableType,
            showDrawer: state.browser.greaterThan.small,
            small: state.browser.is.extraSmall || state.browser.is.medium,
            periodsWidth: (state.browser.is.extraSmall || state.browser.is.medium) ? 20 : 70,
            loading: state.timetable.loadingTimetable || state.timetable.loadingSubstitutions,
            warning: state.user.warning,
            lastCheck: state.user.lastCheck,
            counterChanged: state.timetable.counterChanged,
        }
    }
    return mapStateToProps;
}


export default connect(makeMapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(TimeTableGrid));