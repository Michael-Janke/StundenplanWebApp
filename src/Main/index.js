import React, {
    Component
} from "react";
import {
    connect
} from "react-redux";
import Snackbar from '@material-ui/core/Snackbar';
import {
    clearErrors,
    checkCounter,
    setNotification,
    showError,
    setMyTimetable,
    sendLoginStatistic,
    changeTheme,
    setSortBy
} from "./actions";
import TimeTable from "../TimeTable"
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createTheme from '../Common/theme';
import ReactInterval from 'react-interval';
import { connectToServiceWorker } from '../Common/firebase';
import PrintProvider from 'react-easy-print';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

var AppBar = process.env.REACT_APP_MODE === 'tv'
    ? require("./components/TvAppBar").default
    : require("./components/AppBar").default;

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        if (window.params) {
            this.props.changeTheme(window.params.theme || 'light');
            this.props.setSortBy(window.params.sortBy || 'class');
        }
        props.checkCounter();
        this.props.setMyTimetable();
        this.props.sendLoginStatistic();
        if (this.props.notificationToken) {
            connectToServiceWorker(this.props.setNotification, this.props.notificationToken);
        }
    }

    componentDidUpdate() {
        this.setFontFamily();
    }

    componentDidMount() {
        this.setFontFamily();
    }

    setFontFamily() {
        document.getElementsByTagName("body")[0].style.fontFamily = this.state.theme.typography.fontFamily;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.theme
            || (nextProps.themeType && prevState.theme.palette.type !== nextProps.themeType)) {
            return { theme: createTheme(nextProps.themeType) };
        }
        return {};
    }

    onThemeToggle = () => {
        this.props.changeTheme(this.props.themeType === 'dark' ? 'light' : 'dark');
    }

    render() {
        return (
            <MuiThemeProvider theme={this.state.theme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <div style={{
                        flexDirection: 'column', display: 'flex', height: '100%',
                        backgroundColor: this.state.theme.palette.background.default,
                        fontFamily: this.state.theme.typography.fontFamily,
                    }}>
                        <PrintProvider>
                            <AppBar onThemeToggle={this.onThemeToggle} />
                            <TimeTable />
                            <Snackbar
                                open={!!this.props.error}
                                message={"Fehler: " + this.props.error}
                                autoHideDuration={5000}
                                style={{
                                    color: 'red'
                                }}
                                onClose={this.props.clearErrors} />
                            <ReactInterval timeout={60 * 1000} enabled={true} callback={this.props.checkCounter} />
                        </PrintProvider>
                    </div>
                </MuiPickersUtilsProvider>
            </MuiThemeProvider>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMyTimetable: () => { dispatch(setMyTimetable()) },
        sendLoginStatistic: () => { dispatch(sendLoginStatistic()) },
        checkCounter: () => { dispatch(checkCounter()); },
        clearErrors: () => { dispatch(clearErrors()); },
        showError: (text) => { dispatch(showError(text)); },
        setNotification: (token) => { dispatch(setNotification(token)); },
        changeTheme: (type) => { dispatch(changeTheme(type)); },
        setSortBy: (sortBy) => { dispatch(setSortBy(sortBy)); },
    };
};

const mapStateToProps = state => {
    return {
        loading: state.user.loading,
        type: state.user.type,
        id: state.user.id,
        error: state.error.error,
        notificationToken: state.user.notificationToken,
        themeType: state.user.themeType,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);