import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { DRAWER_WIDTH } from "../Common/const";
import { grey } from 'material-ui/colors';
import withTheme from 'material-ui/styles/withTheme';
import TimeTableGrid from './timeTableGrid';
import Dates from '../Dates';

class View extends Component {
    render() {
        const drawerMargin = this.props.showDrawer ? undefined : '1vw';
        return (
            <Container>
                <AppBar style={{ backgroundColor: this.props.theme.palette.primary1Color }}>
                    <ShadowContainerEmu />
                </AppBar>
                {this.props.showDrawer && <Drawer>
                    <Dates />
                </Drawer>}
                
                <ShadowContainer style={{ marginLeft: drawerMargin, marginRight: drawerMargin }}>
                    <ShadowBox>
                        <TimeTableGrid />
                    </ShadowBox>
                </ShadowContainer>
            </Container>
        );
    }
}

const Container = styled.div`
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 100%;
    position: relative;
    color: ${grey[600]};
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
`
const ShadowBox = styled.div`
    background-color: white;
    box-shadow: rgba(0,0,0,0.3) 0px 0px 10px;
    max-width: 1200px;
`
const ShadowContainerEmu = styled.div`
    margin-left: ${DRAWER_WIDTH}px;
    margin-right: 1vw;
    max-width: 1200px;
    width:100%;
    height: 1px;
`
const AppBar = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 104px;
    position: absolute;
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