import React, {
    Component
} from "react";
import {
    connect
} from "react-redux";
import {
    setNotification,
    setMyTimetable,
    sendLoginStatistic,
    changeTheme,
    setSortBy
} from "../Main/actions";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createTheme from '../Common/theme';
import { connectToServiceWorker } from '../Common/firebase';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import Main from "../Main";
import Contributions from '../Contributions';
import AppDrawer from "./AppDrawer";
import AppBar from "./AppBar";
import NotFoundPage from "./NotFoundPage";

class AppRouter extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        if (window.params) {
            this.props.changeTheme(window.params.theme || 'light');
            this.props.setSortBy(window.params.sortBy || 'class');
        }
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
    render() {
        return (
            <Router basename={process.env.REACT_APP_MODE === 'tv'
                ? "/wolkenberg-app/stundenplan-web-app-tv/"
                : "/wolkenberg-app/stundenplan-web-app/"}>
                <MuiThemeProvider theme={this.state.theme}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <div style={{
                            flexDirection: 'column', display: 'flex', height: '100%',
                            backgroundColor: this.state.theme.palette.background.default,
                            fontFamily: this.state.theme.typography.fontFamily,
                        }}>
                            <AppDrawer></AppDrawer>
                            <AppBar />
                            <Switch>
                                <Route path="/" exact component={Main} />
                                <Route path="/contributions" component={Contributions} />
                                <Route component={NotFoundPage} />
                            </Switch>
                        </div>
                    </MuiPickersUtilsProvider>
                </MuiThemeProvider>
            </Router>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMyTimetable: () => { dispatch(setMyTimetable()) },
        sendLoginStatistic: () => { dispatch(sendLoginStatistic()) },
        setNotification: (token) => { dispatch(setNotification(token)); },
        changeTheme: (type) => { dispatch(changeTheme(type)); },
        setSortBy: (sortBy) => { dispatch(setSortBy(sortBy)); },
    };
};

const mapStateToProps = state => {
    return {
        loading: state.user.loading,
        notificationToken: state.user.notificationToken,
        themeType: state.user.themeType,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);