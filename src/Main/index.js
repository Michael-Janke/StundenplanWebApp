import React, {Component} from "react";
import {connect} from "react-redux";
import styled from "styled-components";
import {ResponsiveDrawer, BodyContainer, ResponsiveAppBar} from 'material-ui-responsive-drawer'
import FlatButton from "material-ui/FlatButton"
import Snackbar from 'material-ui/Snackbar';
import {loadMe, clearErrors} from "./actions"
import TimeTable from "../TimeTable"
import ProfilePicture from "./profilePicture"

class Main extends Component {

  constructor(props) {
    super(props);
    props.loadMe();
  }
  
  render() {
    return (
      <div>
        <ResponsiveDrawer>
          <ProfilePicture />
        </ResponsiveDrawer>
        <BodyContainer style={{display:'flex'}}>
          <ResponsiveAppBar
            titleStyle={{fontSize: '145%'}}
            title={'Wolkenberg-Gymnasium'}
            iconElementRight={<FlatButton label="LogOut" onClick={() => this.props.logout()}/>}/>
          <div style={{marginTop: 64, background: '#F0F0F0', flex:1}}>
            <TimeTable/>
          </div>
        </BodyContainer>
        <Snackbar
          open={!!this.props.error}
          message={"Error: " + this.props.error}
          autoHideDuration={15000}
          contentStyle={{color:'red'}}
          onRequestClose={this.props.clearErrors}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadMe: () => {
          dispatch(loadMe());
      },
    clearErrors: () => {
      dispatch(clearErrors());
  },
  };
};

const mapStateToProps = state => {
  return {
    loading: state.user.loading,
    error: state.error.error,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);