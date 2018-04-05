import React, { Component } from "react";
import styled from "styled-components";
import muiThemeable from 'material-ui/styles/muiThemeable';
import moment from 'moment';
import { Paper } from "material-ui";
import { connect } from 'react-redux';
import Day from './day';
import { getDates, deleteDate } from "./actions";
import makeGetCurrentDates from "../Selector/dates";
import IconButton from "material-ui/IconButton/IconButton";
import AddIcon from "material-ui/svg-icons/content/add";
import AddDialog from "./Dialogs/addDialog";

class Dates extends Component {

    constructor(props) {
        super(props);
        this.props.getDates();
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

    render() {
        return (
            <Container>
                <Header>
                    <div>
                        <Year>{moment(this.props.timetableDate).format('YYYY')}</Year>
                        <Week>KW {moment(this.props.timetableDate).format('W')}</Week>
                    </div>
                    {this.props.isAdmin &&
                        <IconButton onClick={this.handleOnAdd}>
                            <AddIcon />
                        </IconButton>
                    }    
                </Header>
                <Content>
                    {this.props.dates.map((date, i) =>
                        <Day
                            key={i}
                            date={date.DATE}
                            onEdit={this.props.isAdmin ? this.handleOnEdit : undefined}
                            onDelete={this.props.isAdmin ? this.handleOnDelete : undefined}
                            appointments={date.dates} />
                    )}
                </Content>
                <AddDialog ref="addDialog" />
            </Container>
        );
    }
}
const Content = styled.div`
    overflow: auto;
    padding: 8px 16px;
    max-height: calc(100vh - 200px);
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
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;

const Header = styled.div`
    border-bottom: 1px solid #e0e0e0;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
`;

const Container = styled(Paper) `
    z-index: 1;
    margin-left: 1vw;
    margin-right: 1vw;
    margin-top: 20px;
`;
const Year = styled.div`
    font-size: 70%;
`;
const Week = styled.div`
    font-size: 100%;
`;
const makeMapStateToProps = () => {
    const getCurrentDates = makeGetCurrentDates();
    const mapStateToProps = (state, props) => {
        return {
            timetableDate: state.timetable.timetableDate,
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

export default connect(makeMapStateToProps, mapDispatchToProps)(muiThemeable()(Dates)); 