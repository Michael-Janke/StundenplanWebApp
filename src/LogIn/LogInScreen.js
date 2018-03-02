import React, {Component} from "react";
import {connect} from "react-redux";
import styled from "styled-components";
import background from './bg.jpg';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import {login} from './actions';

class LogInScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username || '',
            password: ''
        };
    }

    render() {
        return (
            <BackgroundContainer>
                <Centered>
                    <Card
                        style={{
                        background: 'rgba(255,255,255,0.95)',
                        flex: 1
                    }}>
                        <CardTitle title="Stundenplan" subtitle="Wolkenberg-Gymnasium"/>
                        <CardText>
                            <ColumnLayout>
                                <TextField
                                    hintText="vorname.nachname"
                                    floatingLabelText="Benutzername"
                                    fullWidth={true}
                                    defaultValue={this.props.username}
                                    onChange={(evt, username) => this.setState({username})}/>
                                <TextField
                                    floatingLabelText="Passwort"
                                    type="password"
                                    fullWidth={true}
                                    onChange={(evt, password) => this.setState({password})}/>
                            </ColumnLayout>
                        </CardText>
                        <CardActions style={{ width: '100%', textAlign: 'right' }}>
                            <Error>
                                {(this.props.error && this.props.error.error) || this.props.error}
                            </Error>
                            <FlatButton
                                label="Einloggen"
                                onClick={() => this.props.login(this.state.username, this.state.password)}/>
                        </CardActions>
                        {this.props.loading && <LinearProgressIndeterminate/>}
                    </Card>
                </Centered>
            </BackgroundContainer>
        );
    }
}

const LinearProgressIndeterminate = () => (<LinearProgress mode="indeterminate"/>);

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

const Error = styled.div `
    flex: 1;
    color: red;
    text-align: left;
`;


const mapStateToProps = state => {
    return {
        username: state.login.username,
        loading: state.login.loading,
        error: state.login.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => {
            dispatch(login(username, password));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen);