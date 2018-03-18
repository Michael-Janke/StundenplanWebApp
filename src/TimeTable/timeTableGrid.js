import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import { grey200, grey600 } from 'material-ui/styles/colors';
import { green100 } from 'material-ui/styles/colors';
import styled from 'styled-components';
import PeriodColumn from './period';
import { WEEKDAY_NAMES } from '../Common/const';

class TimeTableGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        if (props.timetable) {
            this.parse(props.masterdata, props.timetable, props.periods);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.timetable !== nextProps.timetable) {
            this.parse(nextProps.masterdata, nextProps.timetable, nextProps.periods);
        }
    }

    parse(masterdata, timetable, periods) {
        periods = Object.values(periods);
        let data = [];
        for (let x = 0; x < WEEKDAY_NAMES.length; x++) {
            let day = this.readTimetable(timetable, x, periods);
            // if (props.substitutions) {
            //     this.joinSubstitutions(day, props.substitutions.substitutions[x]);
            // }
            this.skipDuplications(day, periods);
            this.translatePeriods(masterdata, day, periods);
            data[x] = day;
        }
        this.state.data = data;
    }

    comparePeriod(current, next) {
        if (!next || !current) return false;
        if (current.length != next.length) return false;
        next = [...next];
        for (let i = 0; i < current.length; i++) {
            for (let j = 0; j < next.length; j++) {
                if (this.compareLesson(current[i], next[j])) {
                    next.splice(j);
                    break;
                }
            }
        }
        return next.length == 0;
    }
    compareLesson(p1, p2) {
        if (p1.TEACHER_ID !== p2.TEACHER_ID
            || p1.SUBJECT_ID !== p2.SUBJECT_ID
            || p1.ROOM_ID !== p2.ROOM_ID)
            return false;
        let classIds1 = p1.CLASS_IDS || [];
        let classIds2 = p2.CLASS_IDS || [];

        if (!(classIds1.length === classIds2.length && classIds1.every((v, i) => classIds2.indexOf(v) >= 0)))
            return false;
        return true;
    }

    skipDuplications(day, periods) {
        if (day.holiday) {
            return;
        }
        for (let y = 0; y < periods.length; y++) {
            let current = day.periods[y];
            current.skip = 0;
            while (y + 1 < periods.length
                && this.comparePeriod(current.lessons, day.periods[y + 1].lessons)) {
                y++;
                delete day.periods[y];
                current.skip++;
            }
            if (current.lessons) {
                for (let i = 0; i < current.lessons.length; i++) {
                    let last = current.lessons[i];
                    for (let j = i + 1; j < current.lessons.length; j++) {
                        let lesson = current.lessons[j];
                        if (lesson.ROOM_ID === last.ROOM_ID
                            && lesson.SUBJECT_ID === last.SUBJECT_ID
                            && lesson.substitutionType === last.substitutionType) {
                            if (!last.TEACHER_IDS) {
                                last = current.lessons[i] = { ...last };
                                last.TEACHER_IDS = [last.TEACHER_ID];
                                last.TEACHER_ID = undefined;
                            }
                            last.TEACHER_IDS.push(lesson.TEACHER_ID);
                            current.lessons.splice(j);
                        }
                    }
                }
            }
        }
    }
    readTimetable(_data, day, periods) {
        let data = [];
        for (let y = 0; y < periods.length; y++) {
            let lessons = (_data[day] || [])[y + 1];
            if (lessons) {
                lessons = [...lessons];
            }
            data[y] = { lessons };
        }
        return { periods: data };
    }

    translatePeriods(masterdata, day, periods) {
        if (day.holiday) {
            return day;
        }
        for (let y = 0; y < periods.length; y++) {
            if (day.periods[y] && day.periods[y].lessons) {
                this.translate(masterdata, day.periods[y]);
            }
        }
    }

    translate(masterdata, period) {
        if (!period) return period;
        period.lessons = period.lessons.map((period) => ({
            substitutionText: period.substitutionText,
            substitutionType: period.substitutionType,
            specificSubstitutionType: period.specificSubstitutionType,
            substitutionRemove: period.substitutionRemove,
            teacher: masterdata.Teacher[period.TEACHER_ID]
                || period.TEACHER_IDS && period.TEACHER_IDS.map((t) => masterdata.Teacher[t]),
            absentTeacher: [],
            subject: masterdata.Subject[period.SUBJECT_ID],
            room: masterdata.Room[period.ROOM_ID],
            classes: (period.CLASS_IDS || []).map((c) => masterdata.Class[c]),
            absentClasses: (period.CLASS_IDS_ABSENT || []).map((c) => masterdata.Class[c])
        }));
        return period;
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
        if (!this.state.data) { return null; }
        let lessons = this.state.data[day].periods[period - 1];
        if (!lessons) {
            return null;
        }
        return (
            <TableRowColumn
                key={day}
                style={{ textAlign: 'center', padding: '0.5vmin', overflow: 'visible', fontSize: '100%'
             }}
                rowSpan={lessons ? lessons.skip + 1 : 0}>
                <PeriodColumn
                    lessons={lessons.lessons}
                    type={this.props.type}
                    avatars={this.props.avatars}
                    small={this.props.small}/>
            </TableRowColumn>
        );
    }

    renderRows() {
        const periodColumnStyle = {
            width: this.props.periodsWidth,
            fontSize: '100%',
            padding: 2,
        };
        return Object.values(this.props.periods).map((period, i) => (
            <TableRow key={i}>
                <TableRowColumn style={periodColumnStyle}>
                    <div style={{ display: 'flex', alignContent: 'space-between', height: '100%' }}>
                        {this.props.showPeriods && this.renderPeriodTimes(period)}
                        {this.renderPeriodHeader(period)}
                    </div>
                </TableRowColumn>
                {WEEKDAY_NAMES.map((name, i) => this.renderPeriodsRow(i, period.PERIOD_TIME_ID))}
            </TableRow>
        ));
    }

    render() {
        const tableHeaderStyle = { color: grey600, fontSize: '85%', textAlign: 'center' };
        return (
            <Table selectable={false}>
                <TableHeader
                    style={{ backgroundColor: grey200 }}
                    displaySelectAll={false}
                    adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={{ boxSizing: 'border-box', width: this.props.periodsWidth }} />
                        {WEEKDAY_NAMES.map((weekday, i) => (
                            <TableHeaderColumn
                                key={i}
                                style={tableHeaderStyle}>
                                {weekday}
                            </TableHeaderColumn>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={false}>
                    {this.renderRows()}
                </TableBody>
            </Table>
        );
    }
}

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




const mapStateToProps = state => {
    return {
        masterdata: state.timetable.masterdata,
        timetable: state.timetable.timetable,
        id: state.timetable.currentTimeTableId,
        type: state.timetable.currentTimeTableType,
        periods: state.timetable.masterdata.Period_Time,
        showPeriods: state.browser.greaterThan.small,
        showDrawer: state.browser.greaterThan.small,
        small: state.browser.is.extraSmall || state.browser.is.medium,
        periodsWidth: state.browser.greaterThan.small ? 70 : 20,
        avatars: state.avatars,
    };
};

export default connect(mapStateToProps)(TimeTableGrid);
