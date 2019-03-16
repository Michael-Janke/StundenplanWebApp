import React from 'react';
import styled from 'styled-components';
import green from '@material-ui/core/colors/green';
import easterImg from './easter.jpg';
import bridgeImg from './bridge.jpg';
import firstMayImg from './firstMay.jpg';
import summerImg from './summer.jpg';
import autumnImg from './autumn.jpg';
import xmasImg from './xmas.jpg';
import winterImg from './winter.jpg';
import germanImg from './german.jpg';
import ascentionImg from './ascention.jpg';
import flowerImg from './flower.jpg';

const holidayImageMap = {
    Oster: easterImg,
    Ferientag: bridgeImg,
    '01.05': firstMayImg,
    Sommer: summerImg,
    Herbst: autumnImg,
    Weihn: xmasImg,
    Winter: winterImg,
    '3.10': germanImg,
    Himmel: ascentionImg,
    Pfings: flowerImg,
};

class Holiday extends React.PureComponent {
    render() {
        var img = bridgeImg;
        for (var key in holidayImageMap) {
            if (this.props.holiday.indexOf(key) >= 0) {
                img = holidayImageMap[key];
            }
            if (this.props.date && this.props.date.indexOf(key) >= 0) {
                img = holidayImageMap[key];
            }
        }
        return (
            <Container img={img}>
                <Text>{this.props.holiday}</Text>
            </Container>
        );
    }
}

const Container = styled.div`
    background-color: ${green[100]};
    display: flex;
    height: 100%;
    background: url(${props => props.img}) no-repeat center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    -moz-box-shadow: inset 0 0 5px #ffffff;
    -webkit-box-shadow: inset 0 0 5px #ffffff;
    box-shadow: inset 0 0 5px #ffffff;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -ms-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
`;

const Text = styled.div`
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    margin-top: 5vh;
    margin-right: 2vw;
    margin-bottom: auto;
    width: 100%;
    padding: 2vmin;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-word;
`;

export default Holiday;
