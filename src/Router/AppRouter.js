import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setNotification, setMyTimetable, sendLoginStatistic, changeTheme, setSortBy } from '../Main/actions';
import {ThemeProvider} from '@material-ui/core/styles';
import createTheme from '../Common/theme';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { HashRouter as Router } from 'react-router-dom';
import Routes from './routes';
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
        window.setTimeout(() => {
            window.addEventListener('focus', this.props.sendLoginStatistic);
            this.props.sendLoginStatistic();
        }, 1000);
    }

    componentWillUnmount() {
        window.removeEventListener('focus', this.props.sendLoginStatistic);
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
                <ThemeProvider theme={this.state.theme}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <SnackbarProvider maxSnack={1} autoHideDuration={2000}>
                            <Notifier />
                        </SnackbarProvider>
                        <Routes />
                    </MuiPickersUtilsProvider>
                </ThemeProvider>
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
