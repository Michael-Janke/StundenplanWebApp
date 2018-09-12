import React, { PureComponent } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import withTheme from '@material-ui/core/styles/withTheme';
import TimeTableGrid from './timeTableGrid';
import indigo from '@material-ui/core/colors/indigo';
import { Paper } from "@material-ui/core";
import Dates from "../Dates";
import ErrorBoundary from "../Common/ErrorBoundary";

var Substitutions;
if (process.env.REACT_APP_MODE === 'tv') {
    Substitutions = require('./Substitutions').default;
}

class View extends PureComponent {
    render() {
        const { showCalendar, small } = this.props;
        return (
            <Container>
                <AppBar backgroundColor={indigo[600]} />
                {showCalendar && !small &&
                    <ShadowContainer style={{width:300, flex:'none'}}>
                        <ErrorBoundary>
                            <Dates />
                        </ErrorBoundary>
                    </ShadowContainer>
                }
                {Substitutions ?
                    <ShadowContainer>
                        <Substitutions addDays={0} />
                        <Substitutions addDays={1} />
                    </ShadowContainer>
                    : null}
                <Column>
                    <ShadowContainer style={{marginRight: '1vw'}}>
                        <ErrorBoundary>
                            <TimeTableGrid />
                        </ErrorBoundary>    
                    </ShadowContainer>
                    {showCalendar && small &&
                        <ShadowContainer>
                            <ErrorBoundary>
                                <Dates singleMonth />
                            </ErrorBoundary>
                        </ShadowContainer>
                    }
                </Column>
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
const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const ShadowContainer = styled(Paper)`
    display: flex;
    flex-direction: row;
    margin-left: 1vw;
    position: relative;
    max-width: 800px;  
    margin-bottom: 10px;
`
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
        showCalendar: process.env.REACT_APP_MODE !== 'tv',
        small: state.browser.lessThan.medium
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(View));