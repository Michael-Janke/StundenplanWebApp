import React, { Component } from 'react';
import styled from 'styled-components';
import './month.css';
import AppointmentDay from './day';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { ListSubheader } from '@material-ui/core';

const getWeeksOfMonth = (firstDayOfMonth) => {
    let weeks = [];
    let month = firstDayOfMonth.month();
    firstDayOfMonth = firstDayOfMonth.clone().startOf('isoWeek');
    for (let m = 0; m < 6; m++) {
        let week = [];
        const weekOfYear = firstDayOfMonth.week();
        let valid = false;
        for (let i = 0; i < 7; i++) {
            week[i] = firstDayOfMonth.month() === month && firstDayOfMonth.date();
            if (week[i]) {
                valid = true;
            }
            firstDayOfMonth.add(1, 'day');
        }
        if (valid) {
            weeks.push({ week, weekOfYear });
        }
    }
    return weeks;
}

export default class MonthView extends Component {

    renderWeeks(month) {
        const weeks = getWeeksOfMonth(month);
        const dates = this.props.dates.filter(date => date.DATE.month() === month.month());
        return weeks.map((week, i) => {
            let weekDates = dates.filter(date => date.DATE.week() === week.weekOfYear);
            let dayMap = weekDates.map(date => date.DATE.date());
            return (
                <div key={i}>
                    <Week>
                        <WeekOfYear>KW {week.weekOfYear}</WeekOfYear>
                        {week.week.map((day, j) =>
                            <Day key={j}>
                                <DayWrapper hasDate={dayMap.filter(date => day === date).length}>{day}</DayWrapper>
                            </Day>
                        )}
                    </Week>
                    {weekDates.map((date, i) =>
                        <AppointmentDay
                            key={i}
                            date={date.DATE}
                            // onEdit={this.props.isAdmin ? this.handleOnEdit : undefined}
                            // onDelete={this.props.isAdmin ? this.handleOnDelete : undefined}
                            appointments={date.dates} />
                    )}
                </div>
            );
        });
    }


    scrollToMe() {
        this.refs.sticky.scrollToMe();
    }

    render() {
        const month = this.props.startMonth.clone().add(this.props.index, 'month');
        return (
            <Month>
                <Sticky classes>
                    <Header className="sticky-container">
                        <div>
                            <HeaderWeek>{month.format('MMMM')}</HeaderWeek>
                            <HeaderYear>{month.format('YYYY')}</HeaderYear>
                        </div>
                    </Header>
                </Sticky>
                <div key={-0}>
                    <Week>
                        <WeekOfYear></WeekOfYear>
                        {["M", "D", "M", "D", "F", "S", "S"].map((day, j) =>
                            <Day key={j}>
                                <DayWrapper>{day}</DayWrapper>
                            </Day>
                        )}
                    </Week>
                </div>
                {this.renderWeeks(month)}
            </Month>
        );
    }
}

const Sticky = styled(ListSubheader) `
    padding: 0px;
`;

const Header = styled.div`
    background-color: white;
    border-bottom: 1px solid #e0e0e0;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    margin-bottom: 16px;
`;

const WeekOfYear = styled.div`
    font-size: 60%;
    font-weight: 600;
    margin: 3px;
    display: flex;
    align-items: center;
    width: 40px;
    overflow: hidden;
`;

const HeaderYear = styled.div`
    font-size: 70%;
`;
const HeaderWeek = styled.div`
    font-size: 100%;
`;

const DayWrapper = styled.div`
    height: 16px;
    width: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    ${props => props.hasDate && `
        background: ${lightBlue[600]};
        border-radius: 50%;
    `}
`;

const Day = styled.div`
    flex: 1;
    font-size: 65%;
    margin: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Month = styled.ul`
    padding: 0;
`;

const Week = styled.div`
    display: flex;
    height: 48px;
`;