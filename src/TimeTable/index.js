import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import withTheme from '@material-ui/core/styles/withTheme';
import TimeTableGrid from './timeTableGrid';
import indigo from '@material-ui/core/colors/indigo';
import { Paper } from "@material-ui/core";
var Substitutions;
if (process.env.REACT_APP_MODE === 'tv') {
    Substitutions = require('./Substitutions').default;
}

class View extends Component {
    render() {
        return (
            <Container>
                <AppBar backgroundColor={indigo[600]} />
                {/* {this.props.showDrawer && <Drawer>
                    <Dates />
                </Drawer>} */}
                {Substitutions ?
                    <ShadowContainer>
                        <Substitutions addDays={0} />
                        <Substitutions addDays={1} />
                    </ShadowContainer>
                    : null}

                <ShadowContainer>
                    <TimeTableGrid small={this.props.small || Substitutions} />
                </ShadowContainer>
            </Container>
        );
    }
}

const Container = styled.div`
    width: 100%;
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
    // margin-bottom: 1vw;
    z-index: 1;
    position: relative;
    max-width: 1200px;  
    height: 100%;
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
    };
};

const mapStateToProps = state => {
    return {
        small: state.browser.lessThan.medium,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(View));