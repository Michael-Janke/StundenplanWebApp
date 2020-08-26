import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import classNames from 'classnames/bind';
import TimeIcon from '@material-ui/icons/AccessTime';
import TvIcon from '@material-ui/icons/Tv';
import TitleIcon from '@material-ui/icons/Title';
import { Typography, Input } from '@material-ui/core';
import { StaticDateRangePicker, DateRangeDelimiter } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            minHeight: '100%',
        },
        settings: {
            width: '100%',
            maxWidth: 650,
            padding: theme.spacing(2, 0, 6, 0),
        },
        paper: {
            padding: theme.spacing(0.5, 2),
        },
        list: {
            display: 'flex',
            flexDirection: 'column',
        },
        flex: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
        },
        calendar: {
            overflow: 'hidden',
            margin: theme.spacing(0.5, 0.5),
        },
        header: {
            display: 'flex',
            alignItems: 'center',
        },
    }),
    { name: 'Meta' }
);

const Meta = ({
    type,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    title,
    onUpdateTitle,
    viewPublic,
    viewStudent,
    viewTeacher,
    handleCheckBox,
}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.settings}>
                {type === 'diashow' && (
                    <>
                        <Typography className={classes.header}>Erstelle deine Diashow!</Typography>
                        <div className={classes.settings}>
                            <Typography variant="h6" gutterBottom className={classes.header}>
                                <TitleIcon />
                                &nbsp;Titel
                            </Typography>
                            <Paper className={classNames(classes.paper, classes.list)}>
                                <Input value={title} onChange={(e) => onUpdateTitle(e.target.value)} autoFocus />
                            </Paper>
                        </div>
                    </>
                )}
                <Typography variant="h6" gutterBottom className={classes.header}>
                    <TvIcon />
                    &nbsp; Anzeigebereiche
                </Typography>
                <Paper className={classNames(classes.paper, classes.list)}>
                    <FormControlLabel
                        control={<Checkbox checked={viewPublic} onChange={handleCheckBox('viewPublic')} />}
                        label="Infotafeln"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={viewTeacher} onChange={handleCheckBox('viewTeacher')} />}
                        label="Stundenplan Lehrer"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={viewStudent} onChange={handleCheckBox('viewStudent')} />}
                        label="Stundenplan Schüler"
                    />
                </Paper>
            </div>
            <div className={classes.settings}>
                <Typography variant="h6" gutterBottom className={classes.header}>
                    <TimeIcon />
                    &nbsp; Zeitbeschränkung
                </Typography>
                <div className={classes.flex}>
                    <Paper className={classNames(classes.paper, classes.calendar)}>
                        <StaticDateRangePicker
                            value={[dateFrom, dateTo]}
                            onChange={([from, to]) => {
                                setDateFrom(from);
                                setDateTo(to);
                            }}
                            calendars={1}
                            displayStaticWrapperAs="desktop"
                            renderInput={(startProps, endProps) => (
                                <React.Fragment>
                                    <TextField {...startProps} />
                                    <DateRangeDelimiter> bis </DateRangeDelimiter>
                                    <TextField {...endProps} />
                                </React.Fragment>
                            )}
                        />
                    </Paper>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    dateFrom: state.postcreation.dateFrom,
    dateTo: state.postcreation.dateTo,
    title: state.postcreation.title,
    type: state.postcreation.type,
    viewPublic: state.postcreation.viewPublic,
    viewStudent: state.postcreation.viewStudent,
    viewTeacher: state.postcreation.viewTeacher,
});

const mapDispatchToProps = (dispatch) => ({
    setDateFrom: (date) => dispatch({ type: 'SET_FROM_DATE', payload: date }),
    setDateTo: (date) => dispatch({ type: 'SET_TO_DATE', payload: date }),
    onUpdateTitle: (title) => dispatch({ type: 'SET_TITLE', payload: title }),
    handleCheckBox: (name) => (event) => {
        dispatch({ type: 'TOGGLE_VIEW_FIELD', payload: { key: name, value: event.target.checked } });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Meta);
