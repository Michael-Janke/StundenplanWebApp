import React, {Component} from "react";
import {connect} from "react-redux";
import styled from "styled-components";


class Main extends Component {
  render() {
    return (
      <div className="app">
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(Main);