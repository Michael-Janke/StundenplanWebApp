import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { DRAWER_WIDTH } from "../Common/const";
import withTheme from 'material-ui/styles/withTheme';
import TimeTableGrid from './timeTableGrid';
import Dates from '../Dates';
import indigo from 'material-ui/colors/indigo';

class View extends Component {
    render() {
        const drawerMargin = this.props.showDrawer ? 48 : undefined;
        return (
            <Container>
                <AppBar backgroundColor={indigo[600]}/>
                {/* {this.props.showDrawer && <Drawer>
                    <Dates />
                </Drawer>} */}
                
                <ShadowContainer>
                    <ShadowBox style={{ marginTop: drawerMargin }}>
                        <TimeTableGrid />
                    </ShadowBox>
                </ShadowContainer>
            </Container>
        );
    }
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    background-color: ${props => props.backgroundColor};
`

const Drawer = styled.div`
    min-width: ${DRAWER_WIDTH}px;
    z-index: 1;
`

const ShadowContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 6px;
    margin-right: 1vw;
    margin-bottom: 1vw;
    z-index: 1;
    position: relative;
`
const ShadowBox = styled.div`
    box-shadow: rgba(0,0,0,0.3) 0px 0px 10px;
    max-width: 1200px;
`
// const ShadowContainerEmu = styled.div`
//     margin-left: ${DRAWER_WIDTH}px;
//     margin-right: 1vw;
//     max-width: 1200px;
//     width:100%;
//     height: 1px;
// `
const AppBar = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 104px;
    position: absolute;
    background-color: ${props => props.backgroundColor};

`


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
        timetableDate: state.timetable.timetableDate,
        periods: state.timetable.masterdata.Period_Time,
        showPeriods: state.browser.greaterThan.small,
        showDrawer: state.browser.greaterThan.small,
        mediaType: state.browser.mediaType,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(View));