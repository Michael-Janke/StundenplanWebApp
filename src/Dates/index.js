import React, { Component } from "react";
import styled from "styled-components";
import moment from 'moment';
import { Paper } from "material-ui";
import { connect } from 'react-redux';
import MonthView from './month';
import { getDates, deleteDate } from "./actions";
import makeGetCurrentDates from "../Selector/dates";
import AddDialog from "./Dialogs/addDialog";

class Dates extends Component {

    constructor(props) {
        super(props);
        this.props.getDates();
        this.state = {
            ...this.calculateStartDate(props.min, props.max),
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.min !== nextProps.min || this.props.max !== nextProps.max) {
            this.setState(...this.calculateStartDate(nextProps.min, nextProps.max));
        }
        if (this.props.timetableDate.week() !== nextProps.timetableDate.week()) {
            let index = Math.abs(this.state.min.diff(nextProps.timetableDate.clone().startOf('month'), 'month'));
            this.refs[index].scrollToMe();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.min !== nextProps.min || this.props.max !== nextProps.max) {
            return true;
        }
        // dont mess with timetableDate changing 
        if (this.props.dates !== nextProps.dates) {
            return true;
        }
        return false;
    }

    calculateStartDate(min, max) {
        if (!min || !max) {
            return {};
        }
        let minMoment = moment().year(min.year).week(min.week).startOf('month');
        let maxMoment = moment().year(max.year).week(max.week).startOf('month');
        return {
            min: minMoment, max: maxMoment,
            monthCount: Math.abs(minMoment.diff(maxMoment, 'month')),
        }
    }

    handleOnEdit = (appointment) => {
        this.refs.addDialog.getWrappedInstance().open(appointment);
    }

    handleOnDelete = (appointment) => {
        this.props.deleteDate(appointment);
    }

    handleOnAdd = () => {
        this.refs.addDialog.getWrappedInstance().open();
    }

    renderMonths() {
        let months = [];
        const props = { isAdmin: this.props.isAdmin };
        for (let i = 0; i < this.state.monthCount; i++) {
            months.push(
                <MonthView
                    ref={i}
                    startMonth={this.state.min}
                    index={i}
                    dates={this.props.dates}
                    key={i}
                    {...props} />
            )
        }
        return months;
    }

    render() {
        return (
            <Container>
                <Content className="scroll-area">
                    {this.renderMonths()}
                </Content>
                <AddDialog ref="addDialog" />
            </Container>
        );
    }
}
const Content = styled.div`
    overflow: auto;
    position: relative;
    max-height: calc(100vh - 200px);
    padding-right: 8px;
    z-index: 0;
    /* width */
    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #888;
        margin-top: 100px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;


const Container = styled(Paper) `
    margin-left: 1vw;
    margin-right: 1vw;
    margin-top: 20px;
    padding: 8px 16px;
    padding-right: 0px;
    z-index: 1;
`;

const makeMapStateToProps = () => {
    const getCurrentDates = makeGetCurrentDates();
    const mapStateToProps = (state, props) => {
        return {
            timetableDate: state.timetable.timetableDate,
            min: state.timetable.masterdata.minMaxDates.min,
            max: state.timetable.masterdata.minMaxDates.max,
            dates: getCurrentDates(state),
            isAdmin: state.user.scope === 'admin'
        }
    }
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
    getDates: () => dispatch(getDates()),
    deleteDate: (date) => dispatch(deleteDate(date)),
});

export default connect(makeMapStateToProps, mapDispatchToProps)(Dates); 