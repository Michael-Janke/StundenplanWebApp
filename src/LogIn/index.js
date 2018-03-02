import React, {Component} from "react";
import {connect} from "react-redux";
import RaisedButton from 'material-ui/RaisedButton';
import styled from "styled-components";
import LogInScreen from './LogInScreen';

class LogIn extends Component {
  render() {
    return (
      <div className="app">
        {this.props.token
          ? this.props.children
          : <LogInScreen />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {token: state.login.token};
};

export default connect(mapStateToProps)(LogIn);