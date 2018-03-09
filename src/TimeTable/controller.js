import React, {Component} from "react";
import {connect} from "react-redux";
import styled from "styled-components";
import {} from "./actions";

class Controller extends Component {
  render() {
    return (
      <div>
        Controller
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Controller);