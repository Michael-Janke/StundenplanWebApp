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
import { useStaticState, Calendar } from '@material-ui/pickers';
import { connect } from 'react-redux';

const useStyles = makeStyles(
    theme => ({
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

const Meta = ({ type, dateFrom, setDateFrom, dateTo, setDateTo, title, onUpdateTitle }) => {
    const classes = useStyles();
    // you can past mostly all available props, like minDate, maxDate, autoOk and so on
    const { pickerProps: dateFromProps } = useStaticState({
        value: dateFrom,
        onChange: setDateFrom,
    });
    const { pickerProps: dateToProps } = useStaticState({
        value: dateTo,
        onChange: setDateTo,
    });

    return (
        <div className={classes.root}>
            <div className={classes.settings}>
                {type === 'diashow' && (
                    <>
                        <Typography className={classes.header}>Erstelle deine Diashow!</Typography>
                        <div className={classes.settings}>
                            <Typography variant="h6" gutterBottom className={classes.header}>
                                <TitleIcon />
                                &nbsp;Title
                            </Typography>
                            <Paper className={classNames(classes.paper, classes.list)}>
                                <Input value={title} onChange={e => onUpdateTitle(e.target.value)} />
                            </Paper>
                        </div>
                    </>
                )}
                <Typography variant="h6" gutterBottom className={classes.header}>
                    <TvIcon />
                    &nbsp; Anzeigebereiche
                </Typography>
                <Paper className={classNames(classes.paper, classes.list)}>
                    <FormControlLabel control={<Checkbox checked={true} />} label="Infotafeln" />
                    <FormControlLabel control={<Checkbox checked={true} />} label="Stundenplan Lehrer" />
                    <FormControlLabel control={<Checkbox checked={true} />} label="Stundenplan Schüler" />
                </Paper>
            </div>
            <div className={classes.settings}>
                <Typography variant="h6" gutterBottom className={classes.header}>
                    <TimeIcon />
                    &nbsp; Zeitbeschränkung
                </Typography>
                <div className={classes.flex}>
                    <Paper className={classNames(classes.paper, classes.calendar)}>
                        <Typography variant="subtitle2" gutterBottom>
                            Von
                        </Typography>
                        <Calendar {...dateFromProps} />
                    </Paper>

                    <Paper className={classNames(classes.paper, classes.calendar)}>
                        <Typography variant="subtitle2" gutterBottom>
                            Bis
                        </Typography>
                        <Calendar {...dateToProps} />
                    </Paper>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    dateFrom: state.postcreation.dateFrom,
    dateTo: state.postcreation.dateTo,
    title: state.postcreation.title,
    type: state.postcreation.type,
});

const mapDispatchToProps = dispatch => ({
    setDateFrom: (date) => dispatch({type: 'SET_FROM_DATE', payload: date}),
    setDateTo: (date) => dispatch({ type: 'SET_TO_DATE', payload: date }),
    onUpdateTitle: title => dispatch({type: 'SET_TITLE', payload: title}),
})

export default connect(mapStateToProps, mapDispatchToProps)(Meta);
