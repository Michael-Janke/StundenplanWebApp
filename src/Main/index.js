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
    showError,
} from "./actions";
import TimeTable from "../TimeTable"
import ReactInterval from 'react-interval';
import PrintProvider from 'react-easy-print';

class Main extends Component {
    constructor(props) {
        super(props);
        props.checkCounter();
    }

    onThemeToggle = () => {
        this.props.changeTheme(this.props.themeType === 'dark' ? 'light' : 'dark');
    }

    render() {
        return (
            <PrintProvider>
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
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        checkCounter: () => { dispatch(checkCounter()); },
        clearErrors: () => { dispatch(clearErrors()); },
        showError: (text) => { dispatch(showError(text)); },
    };
};

const mapStateToProps = state => {
    return {
        error: state.error.error,
        themeType: state.user.themeType,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);