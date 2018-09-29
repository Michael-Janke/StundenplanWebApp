import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import withTheme from '@material-ui/core/styles/withTheme';
import TimeTableGrid from './timeTableGrid';
import indigo from '@material-ui/core/colors/indigo';
import { Paper } from "@material-ui/core";
import Dates from "../Dates";
import ErrorBoundary from "../Common/ErrorBoundary";

const isTv = process.env.REACT_APP_MODE === 'tv';
var View;

if(isTv) {
    let Substitutions = require('./Substitutions').default;
    View = ({ small }) => (
        <Container>
            <AppBar backgroundColor={indigo[600]} />
            <ContainerFlex>
                {!small &&
                    <ShadowContainer style={{ width: 300, flex: 'none' }}>
                        <ErrorBoundary>
                            <Dates />
                        </ErrorBoundary>
                    </ShadowContainer>
                }
                {Substitutions ?
                    <ShadowContainer style={{ flex: 1 }}>
                        <Substitutions addDays={0} />
                    </ShadowContainer>
                    : null}
            </ContainerFlex>
            <Column style={{flex: 1}}>
                <ShadowContainer style={{ marginRight: '1vw' }}>
                    <ErrorBoundary>
                        <TimeTableGrid />
                    </ErrorBoundary>
                </ShadowContainer>
                {small &&
                    <ShadowContainer>
                        <ErrorBoundary>
                            <Dates singleMonth />
                        </ErrorBoundary>
                    </ShadowContainer>
                }
            </Column>

        </Container>
    )
} else {
    View = ({ small }) => (
        <Container>
            <AppBar backgroundColor={indigo[600]} />
            {!small &&
                <ShadowContainer style={{ width: 300, flex: 'none' }}>
                    <ErrorBoundary>
                        <Dates />
                    </ErrorBoundary>
                </ShadowContainer>
            }
            <Column>
                <ShadowContainer style={{ marginRight: '1vw' }}>
                    <ErrorBoundary>
                        <TimeTableGrid />
                    </ErrorBoundary>
                </ShadowContainer>
                {small &&
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

const Container = styled.div`
    width: 100%;
    position: relative;
    display: flex;
`;
const ContainerFlex = styled.div`
    flex: 1;
    display: flex;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

const ShadowContainer = styled(Paper)`
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
        small: state.browser.lessThan.medium
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(View));