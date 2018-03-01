import React, {Component} from "react";
import {connect} from "react-redux";
import RaisedButton from 'material-ui/RaisedButton';
import styled from "styled-components";
import {login} from './actions';
import LogInScreen from './LogInScreen';

class LogIn extends Component {
  render() {
    return (
      <div className="app">
        {this.props.loggedIn && false
          ? this.props.children
          : <LogInScreen login={this.props.login} username={this.props.username}/>}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {loggedIn: state.login.loggedIn};
};

const mapDispatchToProps = dispatch => {
  return {
    login: () => {
      dispatch(login());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);