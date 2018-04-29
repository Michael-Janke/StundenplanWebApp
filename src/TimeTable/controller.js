import React, {Component} from "react";
import {connect} from "react-redux";
import styled from "styled-components";
import {} from "./actions";
import muiThemeable from 'material-ui/styles/muiThemeable';
import {
  WEEKDAY_NAMES,
  DRAWER_WIDTH
} from "../Common/const";
import grey from 'material-ui/colors/grey';

class Controller extends Component {
  render() {
    return (
      <AppBar style={{backgroundColor: this.props.muiTheme.palette.primary1Color}}> 
            <ToolBar>
              {WEEKDAY_NAMES.map((weekDay, i) => <WeekdayHeader key={i}>{weekDay}</WeekdayHeader>)}
            </ToolBar>
            <div style={{width: 100}}> </div> 
      </AppBar>
    );
  }
}

const AppBar = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
`

const ToolBar = styled.div `
  flex:1;
  display:flex;
  flex-direction: row;
  height: 55px;
  margin-top: auto;
  margin-left: ${DRAWER_WIDTH}px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 6px, rgba(0, 0, 0, 0.3) 0px 0px 4px;
  background-color: ${grey[200]};
  color: ${grey[600]};
  align-items: center;
  justify-content: space-around;
  z-index: 1102;
`;


const WeekdayHeader = styled.div `
  font-size:85%;
`;

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

export default connect(mapStateToProps, mapDispatchToProps)(muiThemeable()(Controller));