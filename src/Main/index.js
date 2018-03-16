import React, {
    Component
} from "react";
import {
    connect
} from "react-redux";
import Snackbar from 'material-ui/Snackbar';
import {
    loadMe,
    clearErrors,
    checkCounter
} from "./actions"
import TimeTable from "../TimeTable"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from './appBar';
import Theme from '../Common/theme';
import ReactInterval from 'react-interval';



class Main extends Component {

    constructor(props) {
        super(props);
        props.checkCounter();
        props.needsUpdate && props.loadMe();
    }

    componentWillUpdate(nextProps) {
        if(!this.props.needsUpdate && nextProps.needsUpdate) {
            nextProps.loadMe();
        }
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={Theme}>
                <div>
                    <AppBar />
                    <TimeTable />
                    <Snackbar
                        open={!!this.props.error}
                        message={"Fehler: " + this.props.error}
                        autoHideDuration={15000}
                        contentStyle={{
                            color: 'red'
                        }}
                        onRequestClose={this.props.clearErrors} />
                    <ReactInterval timeout={60*1000} enabled={true} callback={() => this.props.checkCounter()} />
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
        checkCounter: () => {
            dispatch(checkCounter());
        },
        clearErrors: () => {
            dispatch(clearErrors());
        }
    };
};

const mapStateToProps = state => {
    return {
        loading: state.user.loading,
        needsUpdate: state.user.counterChanged,
        error: state.error.error
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);