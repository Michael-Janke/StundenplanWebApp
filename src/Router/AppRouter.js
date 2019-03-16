import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setNotification, setMyTimetable, sendLoginStatistic, changeTheme, setSortBy } from '../Main/actions';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createTheme from '../Common/theme';
import { connectToServiceWorker } from '../Common/firebase';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { HashRouter as Router } from 'react-router-dom';
import Routes from './routes';
import version from '../version.json';
import Notifier from './Notifier';
import { SnackbarProvider } from 'notistack';

class AppRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        if (window.params) {
            this.props.changeTheme(window.params.theme || 'light');
            this.props.setSortBy(window.params.sortBy || 'class');
        }
        this.props.setMyTimetable();
        this.props.sendLoginStatistic({
            device: {
                width: window.innerWidth,
                height: window.innerHeight,
                browser: navigator.userAgent,
            },
            buildNumber: version.build,
            version: version.version,
            production: process.env.NODE_ENV === 'production',
        });
        if (this.props.notificationToken) {
            connectToServiceWorker(this.props.setNotification, this.props.notificationToken);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.theme || (nextProps.themeType && prevState.theme.palette.type !== nextProps.themeType)) {
            return { theme: createTheme(nextProps.themeType) };
        }
        return {};
    }
    render() {
        return (
            <Router>
                <MuiThemeProvider theme={this.state.theme}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <SnackbarProvider maxSnack={1} autoHideDuration={2000}>
                            <Notifier />
                        </SnackbarProvider>
                        <Routes />
                    </MuiPickersUtilsProvider>
                </MuiThemeProvider>
            </Router>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMyTimetable: () => {
            dispatch(setMyTimetable());
        },
        sendLoginStatistic: data => {
            dispatch(sendLoginStatistic(data));
        },
        setNotification: token => {
            dispatch(setNotification(token));
        },
        changeTheme: type => {
            dispatch(changeTheme(type));
        },
        setSortBy: sortBy => {
            dispatch(setSortBy(sortBy));
        },
    };
};

const mapStateToProps = state => {
    return {
        notificationToken: state.user.notificationToken,
        themeType: state.user.themeType,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppRouter);
