import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import withTheme from '@material-ui/core/styles/withTheme';
import TimeTableGrid from './timeTableGrid';
import indigo from '@material-ui/core/colors/indigo';
import { Paper } from "@material-ui/core";

class View extends Component {
    render() {
        return (
            <Container>
                <AppBar backgroundColor={indigo[600]} />
                {/* {this.props.showDrawer && <Drawer>
                    <Dates />
                </Drawer>} */}

                <ShadowContainer>
                    <TimeTableGrid />
                </ShadowContainer>
            </Container >
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


const ShadowContainer = styled(Paper)`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 6px;
    margin-right: 1vw;
    margin-left: 1vw;
    margin-bottom: 1vw;
    z-index: 1;
    position: relative;
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