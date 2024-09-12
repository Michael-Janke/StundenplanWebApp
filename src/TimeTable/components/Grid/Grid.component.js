import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PeriodColumn from '../../period';
import { WEEKDAY_NAMES } from '../../../Common/const';
import { setTimeTable, retryTimetable } from '../../../Main/actions';
import Holiday from '../../Holiday';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import RoomList from '../../roomlist';
import Supervision from '../../supervision';
import Absence from '../../absence';
import PeriodCell from '../periodCell';
import Offline from './offline';
import OfflineLesson from './OfflineLesson';
import { grey } from '@material-ui/core/colors';
import Event from './Event';
import Assignment from './Assignment';

const padding = (small) => ({
    paddingLeft: small ? 2 : 4,
    paddingTop: small ? 2 : 4,
    paddingBottom: small ? 2 : 4,
    paddingRight: 2,
});

class TimeTableGrid extends React.Component {
    periodTime(timeAsNumber) {
        const lpad2 = (number) => (number < 10 ? '0' : '') + number;
        return Math.floor(timeAsNumber / 100) + ':' + lpad2(timeAsNumber % 100);
    }

    renderPeriodTimes(period) {
        return (
            <Times key={period.PERIOD_TIME_ID}>
                <Time>{this.periodTime(period.START_TIME)}</Time>
                <Time>{this.periodTime(period.END_TIME)}</Time>
            </Times>
        );
    }

    renderPeriodHeader(period) {
        return (
            <Periods>
                <Tooltip
                    placement="right"
                    title={this.periodTime(period.START_TIME) + ' - ' + this.periodTime(period.END_TIME)}
                >
                    <Period>{period.PERIOD_TIME_ID}.</Period>
                </Tooltip>
            </Periods>
        );
    }

    renderPeriodsColumn(day, periodNumber) {
        const { currentTimetable, periods, type, small, date, setTimeTable } = this.props;

        if (!currentTimetable) {
            return (
                <TableCell
                    key={day}
                    rowSpan={1}
                    style={{
                        textAlign: 'center',
                        ...padding(small),
                        overflow: 'visible',
                        fontSize: '100%',
                        color: grey[500],
                    }}
                >
                    <div style={{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {periodNumber > 1 && periodNumber < 10 - ((day * 2) % 3) && (
                            <OfflineLesson day={day} periodNumber={periodNumber} />
                        )}
                    </div>
                </TableCell>
            );
        }
        let dayObject = currentTimetable[day];
        if (dayObject.holiday) {
            if (periodNumber !== 1) return;
            let isNextDay = (currentTimetable[day - 1] || {}).holiday === dayObject.holiday;
            if (isNextDay) return;
            let colSpan = currentTimetable.slice(day).filter((dayX) => dayX.holiday === dayObject.holiday).length;
            let mDate = date ? date.clone().weekday(0).add(day, 'days').format('DD.MM') : null;
            return (
                <TableCell key={day} rowSpan={Object.values(periods).length} style={{ padding: 0 }} colSpan={colSpan}>
                    <Holiday holiday={dayObject.holiday} date={mDate} />
                </TableCell>
            );
        } else {
            let period = dayObject.periods[periodNumber - 1];
            if (!period) {
                return null;
            }
            let time = periods[periodNumber].START_TIME;
            let periodDate =
                date &&
                date
                    .clone()
                    .weekday(day)
                    .hour(Math.floor(time / 100))
                    .minute(time % 100);
            return (
                <TableCell
                    key={day}
                    style={{
                        textAlign: 'center',
                        ...padding(small),
                        overflow: 'visible',
                        fontSize: '100%',
                    }}
                    rowSpan={(period.skip || 0) + 1}
                >
                    {period.freeRooms ? (
                        <RoomList rooms={period.freeRooms} />
                    ) : (
                        <PeriodColumn
                            lessons={period.lessons}
                            date={periodDate}
                            type={type}
                            small={small}
                            setTimeTable={setTimeTable}
                        >
                            {period.supervision && <Supervision supervision={period.supervision} />}
                        </PeriodColumn>
                    )}
                </TableCell>
            );
        }
    }

    renderRows() {
        const { small, periods, currentPeriod } = this.props;
        return [
            this.renderAbsences(),
            this.renderUnmatchedAssignments(),
            this.renderEvents(),
            ...Object.values(periods).map((period) => {
                const isCurrentPriod = currentPeriod === period;
                return (
                    <TableRow style={{ height: '100%' }} key={period.PERIOD_TIME_ID}>
                        <PeriodCell small={small} now={isCurrentPriod}>
                            <div style={{ display: 'flex', alignContent: 'space-between' }}>
                                {small || this.renderPeriodTimes(period)}
                                {this.renderPeriodHeader(period)}
                            </div>
                        </PeriodCell>
                        {WEEKDAY_NAMES.map((name, i) => this.renderPeriodsColumn(i, period.PERIOD_TIME_ID))}
                    </TableRow>
                );
            }),
        ];
    }

    renderUnmatchedAssignments() {
        const { currentTimetable: timetable, small, me } = this.props;
        if (!timetable || !me || !timetable.some((day) => !!day.unmatchedAssignments.length)) {
            return null;
        }
        return (
            <TableRow style={{ height: 'unset' }} key="Assignments">
                <PeriodCell small={small}>
                    <Times>{small ? 'HA' : 'Aufgaben'}</Times>
                </PeriodCell>
                {WEEKDAY_NAMES.map((name, i) => {
                    const day = timetable[i];
                    return (
                        <TableCell key={i} style={{ ...padding(small), fontSize: '100%' }}>
                            {day.unmatchedAssignments &&
                                day.unmatchedAssignments.map((assignment) => (
                                    <Assignment key={assignment.id} assignment={assignment} />
                                ))}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    }

    renderEvents() {
        const { currentTimetable: timetable, small, me } = this.props;

        if (!timetable) {
            return null;
        }

        const showMyEvents = me && timetable.some((day) => !!day.events.length);
        const showGlobalEvents = !showMyEvents && timetable.some((day) => !!day.globalEvents.length);

        if (!showMyEvents && !showGlobalEvents) {
            return null;
        }
        return (
            <TableRow style={{ height: 'unset' }} key="Events">
                <PeriodCell small={small}>
                    <Times>{small ? 'Besp.' : 'Besprechungen'}</Times>
                </PeriodCell>
                {WEEKDAY_NAMES.map((name, i) => {
                    const day = timetable[i];
                    return (
                        <TableCell key={name} style={{ ...padding(small), fontSize: '100%', verticalAlign: 'top' }}>
                            {showMyEvents && day.events.map((event) => <Event key={event.id} event={event} />)}
                            {showGlobalEvents &&
                                day.globalEvents.map((event) => (
                                    <Event
                                        key={event.EVENT_ID}
                                        event={{
                                            start: { dateTime: event.DATE_FROM.date },
                                            end: { dateTime: event.DATE_TO.date },
                                            name: event.ORGANIZER,
                                            subject: event.SUBJECT,
                                        }}
                                    />
                                ))}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    }

    renderAbsences() {
        const { type, id, small, currentTimetable: timetable, offline } = this.props;
        if (!type || !id || offline) {
            return null;
        }
        if (!timetable) {
            return;
        }
        const absences = WEEKDAY_NAMES.map((name, i) => timetable[i]);
        if (absences.every((day) => !day.absences)) {
            return null;
        }

        return (
            <TableRow style={{ height: 'unset' }} key="Absence">
                <PeriodCell small={small} />
                {WEEKDAY_NAMES.map((name, i) => {
                    const day = timetable[i];
                    return (
                        <TableCell key={i} style={{ padding: 0, fontSize: '100%' }}>
                            {day.absences &&
                                day.absences.map((absence) => <Absence key={absence.ABSENCE_ID} absence={absence} />)}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    }

    render() {
        const { classes, offline, currentTimetable: timetable, retry } = this.props;
        return (
            <Offline retry={retry} in={offline && !timetable} className={classes.root}>
                <Table className={classes.table}>
                    <TableBody>{this.renderRows()}</TableBody>
                </Table>
            </Offline>
        );
    }
}

const styles = (theme) => ({
    root: {
        position: 'relative',
    },
    table: {
        backgroundColor: theme.palette.background.default,
        flexShrink: 0,
        height: 0,
        tableLayout: 'fixed',
        width: '100%',
        borderCollapse: 'separate',
    },
});

const Times = styled.div`
    font-size: 50%;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1vmin;
    justify-content: center;
`;
const Time = styled.div``;
const Periods = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: bold;
    padding-left: 3px;
    flex: 1;
`;
const Period = styled.div`
    color: ${grey[500]};
`;

const mapDispatchToProps = (dispatch) => {
    return {
        setTimeTable: (type, id) => dispatch(setTimeTable(type, id)),
        retry: () => dispatch(retryTimetable()),
    };
};

export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(TimeTableGrid));
