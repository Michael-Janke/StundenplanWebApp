import React, {Component} from "react";
import {connect} from "react-redux";
import styled from "styled-components";
import {ResponsiveDrawer, BodyContainer, ResponsiveAppBar} from 'material-ui-responsive-drawer'
import FlatButton from "material-ui/FlatButton"
import {logout} from "./actions"

class Main extends Component {
  render() {
    return (
      <div>
        <ResponsiveDrawer>
          <div>
            //all your components you want to have in the drawer part
          </div>
        </ResponsiveDrawer>
        <BodyContainer>
          <ResponsiveAppBar
            title={'Wolkenberg-Gymnasium'}
            iconElementRight={<FlatButton label="LogOut" onClick={() => this.props.logout()}/>}/>
          <div>
            //all your components you want to have in the body part
          </div>
        </BodyContainer>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
      logout: () => {
          dispatch(logout());
      }
  };
};

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);