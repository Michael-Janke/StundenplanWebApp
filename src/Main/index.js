import React, {
    Component
} from "react";
import {
    connect
} from "react-redux";
import Snackbar from 'material-ui/Snackbar';
import {
    clearErrors,
    checkCounter,
    setNotification,
    showError,
    setMyTimetable,
    counterChanged,
    sendLoginStatistic
} from "./actions"
import TimeTable from "../TimeTable"
import { MuiThemeProvider } from 'material-ui/styles';
import AppBar from './components/AppBar';
import createTheme from '../Common/theme';
import ReactInterval from 'react-interval';
import { connectToServiceWorker } from '../Common/firebase';
import PrintProvider from 'react-easy-print';


class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dark: false,
            theme: createTheme('light'),
        }
        props.checkCounter();
        this.props.setMyTimetable();
        this.props.sendLoginStatistic();
        props.needsUpdate && props.counterChanged(true);
        if (this.props.notificationToken) {
            connectToServiceWorker(this.props.setNotification, this.props.notificationToken);
        }
    }

    componentWillUpdate(nextProps) {
        if (this.props.needsUpdate !== nextProps.needsUpdate) {
            nextProps.counterChanged(nextProps.needsUpdate);
        }
    }

    componentWillMount() {
        if (this.props.notificationToken && navigator.serviceWorker) {
        }
    }

    onThemeToggle = () => {
        this.setState({ dark: !this.state.dark, theme: createTheme(!this.state.dark ? 'dark' : 'light') });
    }


    render() {
        return (
            <MuiThemeProvider theme={this.state.theme}>
                <div style={{
                    flexDirection: 'column', display: 'flex', height: '100%',
                    backgroundColor: this.state.theme.palette.background.default
                }}>
                    <PrintProvider>
                        <AppBar onThemeToggle={this.onThemeToggle} />
                        <TimeTable />
                        <Snackbar
                            open={!!this.props.error}
                            message={"Fehler: " + this.props.error}
                            autoHideDuration={15000}
                            contentStyle={{
                                color: 'red'
                            }}
                            onRequestClose={this.props.clearErrors} />
                        <ReactInterval timeout={60 * 1000} enabled={true} callback={this.props.checkCounter} />
                    </PrintProvider>
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMyTimetable: () => { dispatch(setMyTimetable()) },
        sendLoginStatistic: () => { dispatch(sendLoginStatistic()) },
        counterChanged: (changed) => dispatch(counterChanged(changed)),
        checkCounter: () => { dispatch(checkCounter()); },
        clearErrors: () => { dispatch(clearErrors()); },
        showError: (text) => { dispatch(showError(text)); },
        setNotification: (token) => { dispatch(setNotification(token)); }
    };
};

const mapStateToProps = state => {
    return {
        loading: state.user.loading,
        needsUpdate: state.user.counterChanged,
        type: state.user.type,
        id: state.user.id,
        error: state.error.error,
        notificationToken: state.user.notificationToken
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);