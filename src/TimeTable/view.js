import React, {Component} from "react";
import {connect} from "react-redux";
import styled from "styled-components";
import {} from "./actions";

class View extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      groups: []
    }
  }

  componentDidMount() {
    
  }
  
  render() {
    
    return (
      <div>
        eff
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
      logout: () => {
          dispatch();
      }
  };
};

const mapStateToProps = state => {
  return {
    masterdata: state.timetable.masterdata,
    params: state.timetable.params
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);