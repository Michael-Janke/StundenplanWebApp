import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    TableFooter
} from 'material-ui/Table';
import { grey100, grey200, grey600, orange500 } from 'material-ui/styles/colors';
import { green100 } from 'material-ui/styles/colors';
import styled from 'styled-components';
import PeriodColumn from './period';
import { WEEKDAY_NAMES, getSpecificSubstitutionType } from '../Common/const';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import NextIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import { changeWeek } from '../Main/actions';
import { NoPrint, Print } from 'react-easy-print';

class TimeTableGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        if (props.timetable) {
            this.parse(props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.timetable !== nextProps.timetable
            || this.props.substitutions !== nextProps.substitutions) {
            this.parse(nextProps);
        }
    }

    parse(props) {
        let { masterdata, timetable, substitutions, periods } = props;
        periods = Object.values(periods);
        let data = [];
        for (let x = 0; x < WEEKDAY_NAMES.length; x++) {
            let day = this.readTimetable(timetable, x, periods);
            if (substitutions) {
                this.joinSubstitutions(day, substitutions.substitutions[x]);
            }
            this.skipDuplications(day, periods);
            this.translatePeriods(masterdata, day, periods);
            data[x] = day;
        }
        this.state.data = data;
    }

    joinSubstitutions(day, subOnDay) {
        if (!subOnDay) return;
        if (subOnDay.holiday) {
            day.holiday = subOnDay.holiday;
            day.periods = undefined;
        } else if (subOnDay.substitutions && day.periods) {

            subOnDay.substitutions.forEach((substitution) => {
                let period = day.periods[substitution.PERIOD - 1];
                if (!period) return;
                let lessons = period.lessons;
                if (lessons) {
                    for (let i = 0; i < lessons.length; i++) {
                        let lesson = lessons[i];
                        if (parseInt(lesson.TIMETABLE_ID) === substitution.TIMETABLE_ID) {
                            let remove = !!['ROOM', 'TEACHER'].find((key) =>
                                this.props.type === key.toLowerCase()
                                && substitution[key + "_ID"] === lesson[key + "_ID"]
                                && substitution[key + "_ID_NEW"]
                                && lesson[key + "_ID"] !== substitution[key + "_ID_NEW"]
                            );

                            lessons[i] = {
                                substitutionRemove: remove,
                                substitutionType: substitution.TYPE,
                                substitutionText: substitution.TEXT,
                                specificSubstitutionType: getSpecificSubstitutionType(substitution),
                                CLASS_IDS: substitution.CLASS_IDS_NEW.length
                                    ? substitution.CLASS_IDS_NEW : substitution.CLASS_IDS,
                                CLASS_IDS_ABSENT: substitution.CLASS_IDS_ABSENT,
                                TEACHER_ID: substitution.TEACHER_ID_NEW || lesson.TEACHER_ID,
                                SUBJECT_ID: substitution.SUBJECT_ID_NEW || lesson.SUBJECT_ID,
                                ROOM_ID: substitution.ROOM_ID_NEW || lesson.ROOM_ID,

                            };
                            return;
                        }
                    }
                }
                if (!lessons) {
                    period.lessons = lessons = [];
                }
                lessons.push({
                    substitutionText: substitution.TEXT,
                    substitutionRemove:
                        substitution.TEACHER_ID === this.props.id
                        && substitution.TEACHER_ID !== this.props.id,
                    substitutionType: substitution.TYPE,
                    CLASS_IDS: substitution.CLASS_IDS_NEW,
                    TEACHER_ID: substitution.TEACHER_ID_NEW,
                    SUBJECT_ID: substitution.SUBJECT_ID_NEW,
                    ROOM_ID: substitution.ROOM_ID_NEW,
                    specificSubstitutionType: getSpecificSubstitutionType(substitution),
                });
            });
        }

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
                    let last = current.lessons[i] = { ...current.lessons[i] };
                    last.TEACHER_IDS = [last.TEACHER_ID];
                    delete last.TEACHER_ID;
                    for (let j = i + 1; j < current.lessons.length; j++) {
                        let lesson = current.lessons[j];
                        if (lesson.ROOM_ID === last.ROOM_ID
                            && lesson.SUBJECT_ID === last.SUBJECT_ID
                            && lesson.substitutionType === last.substitutionType) {
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
            teacher: period.TEACHER_IDS.map((t) => masterdata.Teacher[t]),
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
        if (!this.state.data) { return <TableRowColumn key={day} />; }
        let dayObject = this.state.data[day];
        if (dayObject.holiday) {
            return (
                <TableRowColumn key={day}>
                    {dayObject.holiday}
                </TableRowColumn>
            );
        } else {
            let lessons = dayObject.periods[period - 1];
            if (!lessons) {
                return null;
            }
            return (
                <TableRowColumn
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
                </TableRowColumn>
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
                <TableRowColumn style={periodColumnStyle}>
                    <div style={{ display: 'flex', alignContent: 'space-between', height: '100%' }}>
                        {!this.props.small && this.renderPeriodTimes(period)}
                        {this.renderPeriodHeader(period)}
                    </div>
                </TableRowColumn>
                {WEEKDAY_NAMES.map((name, i) => this.renderPeriodsRow(i, period.PERIOD_TIME_ID))}
            </TableRow>
        ));
    }

    render() {
        const tableHeaderStyle = { color: grey600, fontSize: '85%', textAlign: 'center', padding: 0, height: 42 };
        return (
            <div style={{ flexDirection: 'column', display: 'flex', height: '100%', maxHeight: 'calc(100vh - 82px)' }}>
                {!this.props.showDrawer ? <TableToolBar>
                    <IconButton primary={true} onClick={() => this.props.setPreviousWeek()}>
                        <BackIcon />
                    </IconButton>
                    <IconButton primary={true} onClick={() => this.props.setNextWeek()}>
                        <NextIcon />
                    </IconButton>
                </TableToolBar> : null}
                <Print main name="TimeTable">
                    <Table selectable={false} wrapperStyle={{ flexDirection: 'column', display: 'flex', height: '100%', flex: 1 }} >
                        <TableHeader
                            style={{ backgroundColor: grey200, fontSize: '100%' }}
                            displaySelectAll={false}
                            adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn style={{ ...tableHeaderStyle, width: this.props.periodsWidth, padding: 2 }} />
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

                        <TableFooter
                            adjustForCheckbox={false}
                        >
                            <NoPrint>
                                <TableRow>
                                    <TableRowColumn colSpan="6" style={{ textAlign: 'right' }} >
                                        <IconButton primary={true} onClick={() => this.props.setPreviousWeek()}>
                                            <BackIcon />
                                        </IconButton>
                                        <IconButton primary={true} onClick={() => this.props.setNextWeek()}>
                                            <NextIcon />
                                        </IconButton>
                                    </TableRowColumn>
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
    background-color: ${grey200};
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

const mapStateToProps = state => {
    return {
        masterdata: state.timetable.masterdata,
        timetable: state.timetable.timetable,
        substitutions: state.timetable.substitutions,
        id: state.timetable.currentTimeTableId,
        type: state.timetable.currentTimeTableType,
        periods: state.timetable.masterdata.Period_Time,
        small: state.browser.greaterThan.small,
        showDrawer: state.browser.greaterThan.small,
        small: state.browser.is.extraSmall || state.browser.is.medium,
        periodsWidth: (state.browser.is.extraSmall || state.browser.is.medium) ? 20 : 70,
        loading: state.timetable.loadingTimetable || state.timetable.loadingSubstitutions,
        avatars: state.avatars,
        warning: state.user.warning,
        lastCheck: state.user.lastCheck
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeTableGrid);
