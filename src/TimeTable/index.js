import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { loadMasterData, refreshMasterData } from "./actions";
import View from './view';
import Controller from './controller';
import moment from 'moment';

class TimeTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      params: {
        week: moment().week(),
        year: moment().year()
      }
    };
    props.needsUpdate && props.loadMasterData();
  }

  componentWillUpdate(nextProps) {
    if (!this.props.needsUpdate && nextProps.needsUpdate) {
      nextProps.loadMasterData();
    }
  }

  render() {
    return (
      <ColumnLayout>
        <View params />
      </ColumnLayout>
    );
  }
}

const ColumnLayout = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
`;

const mapDispatchToProps = dispatch => {
  return {
    loadMasterData: () => {
      dispatch(loadMasterData());
    }
  };
};

const mapStateToProps = state => {
  return {
    masterdata: state.timetable.masterdata,
    needsUpdate: state.user.counterChanged,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeTable);