import React, {Component} from "react";
import styled from "styled-components";
import background from './bg.jpg';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';

export default class LogInScreen extends Component {
    render() {
        return (
            <BackgroundContainer>
                <Centered>
                    <Card style={{background:'rgba(255,255,255,0.95)', flex:1}}>
                        <CardTitle title="Stundenplan" subtitle="Wolkenberg-Gymnasium" />
                        <CardText>
                            <ColumnLayout>
                                <TextField hintText="vorname.nachname" floatingLabelText="Benutzername" fullWidth={true}/>
                                <TextField
                                    floatingLabelText="Passwort"
                                    type="password"
                                    fullWidth={true}/>
                                </ColumnLayout>
                        </CardText>
                        <CardActions>
                            <FlatButton label="Einloggen"/>
                        </CardActions>
                        <LinearProgressIndeterminate/>
                    </Card>
                </Centered>
            </BackgroundContainer>
        );
    }
}

const LinearProgressIndeterminate = () => (
    <LinearProgress mode="indeterminate" />
  );


const BackgroundContainer = styled.div `
    background-image: url(${background});
    display: flex;
    height: 100%;
    justify-content: space-around;
    align-items: center;
`;

const Centered = styled.div `
    min-width: 500px;
    display: flex;
`;

const ColumnLayout = styled.div `
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
`;