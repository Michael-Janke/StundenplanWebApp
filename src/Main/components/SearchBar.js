import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import ClassIcon from '@material-ui/icons/Group';
import RoomIcon from '@material-ui/icons/Room';
import { loadAvatars, setTimeTable } from '../actions';
import moment from 'moment';
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Autosuggest from 'react-autosuggest';
import SearchBar from "material-ui-search-bar";

function renderInput(inputProps) {
    const { classes, ref, ...other } = inputProps;
    return (
        <SearchBar
            fullWidth
            inputRef={ref}
            classes={{
                input: classes.input,
            }}
            inputProps={other}
            style={{
                backgroundColor: '#C5CAE9',
                marginTop: 8,
                marginRight: 8,
                maxWidth: 800,
                minWidth: 0,
                color: 'white'
            }}
            onChange={(text) => other.onChange({ target: { value: text } })}
        />
    );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
    return (
        React.cloneElement(suggestion.value, { component: 'div', key: suggestion.key })
    );
}

function renderSuggestionsContainer(options) {
    const { containerProps, children } = options;
    return (
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
}

function fuzzysearch(needle, haystack) {
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}



const styles = theme => ({
    container: {
        flexGrow: 1,
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
});

class IntegrationAutosuggest extends React.Component {
    state = {
        value: '',
        suggestions: [],
    };

    getSuggestionValue = (suggestion) => {
        return suggestion.text;
    }

    getSuggestions(value) {
        const inputValue = value;
        const inputLength = inputValue.length;
        let count = 0;
        return inputLength === 0
            ? []
            : this.props.dataSource.filter(suggestion => {
                const keep =
                    count < 5 && fuzzysearch(inputValue, suggestion.text.toLowerCase());

                if (keep) {
                    count += 1;
                }

                return keep;
            });
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        value = value.trim().toLowerCase();
        if (this.props.onChange) {
            this.props.onChange(value);
        }
        this.setState({
            suggestions: this.getSuggestions(value),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    handleChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        });
    };

    handleRequestSearch = (value) => {

    }

    render() {
        const { classes } = this.props;

        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={renderInput}
                suggestions={this.state.suggestions}
                onRequestSearch={this.handleRequestSearch}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                onSuggestionSelected={this.props.onSuggestionSelected}
                renderSuggestionsContainer={renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                    classes,
                    placeholder: 'Name',
                    value: this.state.value,
                    onChange: this.handleChange,
                }}
            />
        );
    }
}


const AutoComplete = withStyles(styles)(IntegrationAutosuggest);

class WGSearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.mergeDataSource(props.masterdata, props.avatars)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.avatars !== this.props.avatars
            || nextProps.masterdata !== this.props.masterdata) {
            this.setState({ dataSource: this.mergeDataSource(nextProps.masterdata, nextProps.avatars) });
        }
    }

    mergeDataSource(masterdata, avatars = {}) {
        if (!masterdata) return [];
        const avatar = (upn) => avatars[upn] && avatars[upn].img
            ? <Avatar src={"data:image/jpg;base64," + avatars[upn].img} size={32} />
            : <ListItemIcon><PersonIcon /></ListItemIcon>;
        return [
            ...Object.values(masterdata.Class).map((entry) => ({
                text: "Klasse " + entry.NAME,
                type: "class",
                id: entry.CLASS_ID,
                value: (
                    <ListItem
                        button>
                        <ListItemIcon>
                            <ClassIcon />
                        </ListItemIcon>
                        <ListItemText secondary="Klasse">{entry.NAME}</ListItemText>
                    </ListItem>),
            })),
            ...Object.values(masterdata.Teacher).map((entry) => ({
                text: `Lehrer ${entry.FIRSTNAME} ${entry.LASTNAME}`,
                upn: entry.UPN,
                type: "teacher",
                id: entry.TEACHER_ID,
                value: (
                    <ListItem
                        button>
                        {avatar(entry.UPN)}
                        <ListItemText secondary="Lehrer">{entry.FIRSTNAME[0] + '. ' + entry.LASTNAME}</ListItemText>
                    </ListItem>
                ),
            })),
            ...Object.values(masterdata.Student).map((entry) => ({
                text: `Schüler ${entry.FIRSTNAME} ${entry.LASTNAME}`,
                upn: entry.UPN,
                type: "student",
                id: entry.STUDENT_ID,
                value: (
                    <ListItem
                        button>
                        {avatar(entry.UPN)}
                        <ListItemText secondary="Schüler">{`${entry.LASTNAME}, ${entry.FIRSTNAME}`}</ListItemText>
                    </ListItem>),
            })),
            ...Object.values(masterdata.Room).map((entry) => ({
                text: "Raum " + entry.NAME,
                type: "room",
                id: entry.ROOM_ID,
                value: (
                    <ListItem
                        button>
                        <ListItemIcon>
                            <RoomIcon />
                        </ListItemIcon>
                        <ListItemText secondary="Raum">{entry.NAME}</ListItemText>
                    </ListItem>
                ),
            })),
        ]

    }

    loadAvatars(searchText) {
        var subset = this.state.dataSource.filter((value) => fuzzysearch(searchText, value.text.toLowerCase()));
        subset = subset.filter((value, i) => i < 10
            && value.upn
            && (this.props.avatars[value.upn] === undefined
                || moment(this.props.avatars[value.upn].expires).isBefore(moment()))
        );
        if (subset.length > 0) {
            this.props.loadAvatars(subset.map((a) => a.upn));
        }
    }

    onNewRequest = (event, data) => {
        this.props.setTimeTable(data.suggestion.type, data.suggestion.id)
    }
    onChange = (searchText) => {
        this.loadAvatars(searchText)
    }

    render() {
        return (
            <Flex>
                <AutoComplete
                    dataSource={this.state.dataSource}
                    onChange={this.onChange}
                    onSuggestionSelected={this.onNewRequest}
                />
            </Flex>
        );
    }
}


const Flex = styled.div`
    flex: 1;
    position: relative;
    overflow: visible;
    display:flex;
    flex-direction: column;
`

const mapDispatchToProps = dispatch => {
    return {
        loadAvatars: (upns) => {
            dispatch(loadAvatars(upns));
        },
        setTimeTable: (type, id) => {
            dispatch(setTimeTable(type, id));
        }
    };
};


const mapStateToProps = state => {
    return {
        masterdata: state.timetable.masterdata,
        avatars: state.avatars,
        showAsModal: state.browser.lessThan.medium,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WGSearchBar);