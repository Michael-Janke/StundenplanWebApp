import React from 'react';
import makeGetSubstitutions from '../../Selector/substitution';
import { connect } from 'react-redux';
import { getSubstitutions, getTimetable, setTimeTable } from '../../Main/actions';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import grey from '@material-ui/core/colors/grey';
import LinkIcon from '@material-ui/icons/OpenInNew';
import SubstitutionEntry from './substitution';
import styled from 'styled-components';
import { ReactInterval } from 'react-interval/lib/Component';

const styles = theme => ({
    root: {
        width: '100%',
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
        fontSize: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    rootHeader: {
        height: 80,
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
        padding: theme.spacing.unit,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
    },
    rootContent: {
        padding: theme.spacing.unit,
        overflowY: 'auto',
        backgroundColor: theme.palette.background.default,
    },
    substitutionsHeader: {
        fontSize: '90%',
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
        padding: theme.spacing.unit,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    substitutionsContainer: {
        fontSize: '100%',
        padding: theme.spacing.unit,

    },
    icon: {
        fontSize: '70%',
    },
    button: {
        height: 32,
        width: 32,
        padding: 0,
    }
});

class Header extends React.Component {
    state = {};
    callback = () => {
        this.forceUpdate();
    }
    render() {
        const { addDays, lastUpdate, className } = this.props;
        return (
            <div className={className}>
                <div>{moment().add(addDays, 'days').format("dddd[, der ]DD.MM.")}</div>
                {!addDays &&
                    <LastUpdate>Letzte Änderung {moment(lastUpdate).fromNow()}</LastUpdate>}
                {!addDays &&
                    <ReactInterval timeout={60 * 1000} enabled={true} callback={this.callback} />}
            </div>
        );
    }
}

const getAddDays = (props) => {
    let date = moment().startOf('day').add(props.addDays, 'days');
    while (date.isoWeekday() > 5) {
        date.add(1, 'day');
    }
    return Math.abs(moment().startOf('day').diff(date, 'days'));
}


class Substitutions extends React.Component {
    state = {};
    shouldComponentUpdate(nextProps) {
        // controlled nonupdate
        return !!nextProps.substitutions || nextProps.classes !== this.props.classes;
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.substitutions || (props.loading === 'detected') !== (state.loading === 'detected')) {
            let date = moment().add(getAddDays(props), 'day');
            props.getSubstitutions(date.week(), date.weekYear());
            props.getTimetableAll();
        }
        return { loading: props.loading };
    }

    renderName(entry) {
        let field = entry.name[0];
        return (
            field ? field.LASTNAME ? (field.FIRSTNAME[0] + ". " + field.LASTNAME) : field.NAME : ""
        );
    }

    handleSelectTimetable = (entry) => {
        let object = entry.name[0];
        if (!object) {
            return;
        }
        const { singular } = this.props.sortBy.type;
        this.props.setTimetable(singular, object[singular.toUpperCase() + "_ID"]);
    }

    render() {
        console.log(this.props.substitutions);
        if (!this.props.substitutions) {
            return null;
        }
        const { classes, sortBy, lastUpdate, substitutions } = this.props;
        return (
            <div className={classes.root}>
                <Header
                    addDays={substitutions.addDays}
                    lastUpdate={lastUpdate}
                    className={classes.rootHeader}
                    key={1} />
                <div className={classes.rootContent}>
                    {substitutions.substitutions.map((entry, i) => (
                        <SubstitutionsContainer key={i}>
                            <div className={classes.substitutionsHeader}>
                                {this.renderName(entry) || <div />}
                                <IconButton
                                    mini
                                    className={classes.button}
                                    onClick={this.handleSelectTimetable.bind(this, entry)}>
                                    <LinkIcon fontSize="small" />
                                </IconButton>
                            </div>
                            <div className={classes.substitutionsContainer}>
                                {entry.substitutions.map((substitution, i) =>
                                    <SubstitutionEntry
                                        substitution={substitution}
                                        type={sortBy.type.singular}
                                        key={substitution.SUBSTITUTION_ID} />
                                )}
                            </div>
                        </SubstitutionsContainer>
                    ))}
                </div>
            </div>
        );
    }
}

const LastUpdate = styled.div`
    font-size: 50%;
`

const SubstitutionsContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const makeStateToProps = () => {
    const getSubstitutions = makeGetSubstitutions();
    return (state, props) => ({
        substitutions: getSubstitutions(state, props),
        sortBy: state.substitutions.sortBy,
        masterdata: state.masterdata,
        loading: state.user.counterChanged,
        lastUpdate: state.user.lastUpdate,
    });
}
const mapDispatchToProps = (dispatch) => ({
    getSubstitutions: (week, year) => {
        dispatch(getSubstitutions(0, 'all', week, year));
    },
    getTimetableAll: () => {
        dispatch(getTimetable(0, 'all'));
    },
    setTimetable: (type, id) => dispatch(setTimeTable(type, id)),

});

export default withStyles(styles)(connect(makeStateToProps, mapDispatchToProps)(Substitutions));