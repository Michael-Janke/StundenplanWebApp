import React, {
    Component
} from "react";
import {
    connect
} from "react-redux";
import Snackbar from '@material-ui/core/Snackbar';
import {
    clearErrors,
    showError,
    loadJoinedTeams,
    loadAssignments
} from "./actions";
import TimeTable from "../TimeTable";

class Main extends Component {
    constructor(props) {
        super(props);
        props.loadJoinedTeams();
        props.loadAssignments();
    }

    onThemeToggle = () => {
        this.props.changeTheme(this.props.themeType === 'dark' ? 'light' : 'dark');
    }

    render() {
        return (
            <React.Fragment>
                <TimeTable />
                <Snackbar
                    open={!!this.props.error}
                    message={"Fehler: " + this.props.error}
                    autoHideDuration={5000}
                    style={{
                        color: 'red'
                    }}
                    onClose={this.props.clearErrors} />
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        clearErrors: () => { dispatch(clearErrors()); },
        showError: (text) => { dispatch(showError(text)); },
        loadJoinedTeams: () => dispatch(loadJoinedTeams()),
        loadAssignments: () => dispatch(loadAssignments())
    };
};

const mapStateToProps = state => {
    return {
        error: state.error.error,
        themeType: state.user.themeType,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);