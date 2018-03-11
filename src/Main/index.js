import React, {
    Component
} from "react";
import {
    connect
} from "react-redux";
import styled from "styled-components";
import Snackbar from 'material-ui/Snackbar';
import {
    loadMe,
    clearErrors
} from "./actions"
import TimeTable from "../TimeTable"
import ProfilePicture from "./profilePicture"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from './appBar';
import Theme from '../Common/theme';



class Main extends Component {

    constructor(props) {
        super(props);
        props.loadMe();
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={Theme}>
                <div>
                    <AppBar />
                    <TimeTable />
                    <Snackbar
                        open={!!this.props.error}
                        message={"Error: " + this.props.error}
                        autoHideDuration={15000}
                        contentStyle={{
                            color: 'red'
                        }}
                        onRequestClose={this.props.clearErrors} />
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadMe: () => {
            dispatch(loadMe());
        },
        clearErrors: () => {
            dispatch(clearErrors());
        }
    };
};

const mapStateToProps = state => {
    return {
        loading: state.user.loading,
        error: state.error.error
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);