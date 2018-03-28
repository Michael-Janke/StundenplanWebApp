import React, { Component } from "react";
import styled from "styled-components";
import { green100 } from 'material-ui/styles/colors';
import easterImg from './easter.jpg';
import bridgeImg from './bridge.jpg';
import firstMayImg from './firstMay.jpg';
import summerImg from './summer.jpg';
import autumnImg from './autumn.jpg';
import xmasImg from './xmas.jpg';
import winterImg from './winter.jpg';
import germanImg from './german.jpg';

const holidayImageMap = {
  "Oster":easterImg,
  "Ferientag":bridgeImg,
  "1.5.":firstMayImg,
  "Sommer":summerImg,
  "Herbst":autumnImg,
  "Weihn":xmasImg,
  "Winter":winterImg,
  "3.10":germanImg,
}

class Holiday extends Component {
  render() {
    var img = bridgeImg;
    for(var key in holidayImageMap) {
      if(this.props.holiday.indexOf(key) >= 0 || this.props.date.indexOf(key) !== -1) {
        img = holidayImageMap[key];
      }
    }
    return (
      <Container img={img}>
        {this.props.noText || <Text>{this.props.holiday}</Text>}
      </Container>
    );
  }
}

const Container = styled.div`
    background-color: ${green100};
    display: flex;
    height: 100%; 
    background: url(${(props) => props.img}) no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    -moz-box-shadow:    inset 0 0 5px #FFFFFF;
    -webkit-box-shadow: inset 0 0 5px #FFFFFF;
    box-shadow:         inset 0 0 5px #FFFFFF;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -ms-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
`;

const Text = styled.div`
    background-color: rgba(0,0,0,0.7);
    color: white;
    margin-top: 5vh;
    margin-right: 2vw;
    margin-bottom: auto;
    width: 100%;
    padding: 2vmin;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
`;

export default Holiday;