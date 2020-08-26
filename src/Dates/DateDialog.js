import React, { Component } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import CalendarIcon from '@material-ui/icons/Event';
import MenuItem from '@material-ui/core/MenuItem';
import DateComponent from './Date';
import { addDate, editDate } from './actions';
import moment from 'moment';
import SelectField from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

import { DatePicker, DateTimePicker } from '@material-ui/pickers';

import PeriodRangePicker from './PeriodRangePicker';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const DateTimeMask = {
    format: 'DD.MM.YYYY HH:mm',
    mask: (value) =>
        value ? [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/] : [],
};

const DateMask = {
    format: 'DD.MM.YYYY',
    mask: (value) => (value ? [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/] : []),
};

const styles = (theme) => ({
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 140,
        width: '100%',
    },
});

function parseISOLocal(s) {
    var b = s.split(/\D/);
    return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
}

export class AddDialog extends Component {
    state = {};

    static getDerivedStateFromProps(props, state) {
        if (!state.open && props.open) {
            let date = props.date || {};
            return {
                open: true,
                DATE_ID: date.DATE_ID,
                TEXT: date.TEXT || '',
                SUBTEXT: date.SUBTEXT || '',
                TYPE: date.TYPE || 'NORMAL',
                HOMEPAGE: date.HOMEPAGE ? 1 : (date.HOMEPAGE === undefined) + 0,
                HOMEPAGE_BOX: date.HOMEPAGE_BOX ? 1 : 0,
                DATE_FROM: date.DATE_FROM ? parseISOLocal(date.DATE_FROM.date) : moment().startOf('day').toDate(),
                DATE_TO: date.DATE_TO ? parseISOLocal(date.DATE_TO.date) : moment().startOf('day').toDate(),
                timeEdit: date.DATE_FROM && parseISOLocal(date.DATE_FROM.date).getHours() !== 0,
            };
        }
        return state;
    }

    handleChange = (key) => (event) => {
        this.setState({ [key]: event.target.value });
    };

    handleChangeBox = (key) => (event) => {
        this.setState({ [key]: event.target.checked ? 1 : 0 });
    };

    handleFromDateChange = (date) => {
        this.setState({
            DATE_FROM: date,
            DATE_TO: date,
        });
    };

    handleToDateChange = (date) => {
        this.setState({
            DATE_TO: date,
        });
    };
    handleDateChange = (from, to) => {
        this.setState({
            DATE_FROM: from,
            DATE_TO: to,
        });
    };

    extractDate(dbFormat) {
        return {
            DATE_ID: this.state.DATE_ID,
            DATE_FROM: dbFormat ? { date: this.state.DATE_FROM } : moment(this.state.DATE_FROM).format(),
            DATE_TO: dbFormat ? { date: this.state.DATE_TO } : moment(this.state.DATE_TO).format(),
            TYPE: this.state.TYPE,
            TEXT: this.state.TEXT,
            SUBTEXT: this.state.SUBTEXT,
        };
    }

    handleClose = (abort = false) => () => {
        this.setState({
            open: false,
        });
        this.props.handleClose(abort ? undefined : this.extractDate());
    };

    editTime = (timeEdit) => {
        let resetTime = {};
        if (!timeEdit) {
            let DATE_FROM = moment(this.state.DATE_FROM).startOf('day').toDate();
            let DATE_TO = moment(this.state.DATE_TO).startOf('day').toDate();
            resetTime = { DATE_FROM, DATE_TO };
        }
        this.setState({
            timeEdit,
            ...resetTime,
        });
    };

    render() {
        const { edit, classes, small } = this.props;
        const { timeEdit } = this.state;
        const Picker = timeEdit ? DateTimePicker : DatePicker;
        const mask = timeEdit ? DateTimeMask : DateMask;
        return (
            <Dialog open={this.props.open} onClose={this.handleClose(true)} fullScreen={small}>
                <DialogTitle>
                    <CalendarIcon color="primary" style={{ marginRight: '1vmin' }} />
                    {'Termin ' + (edit ? 'editieren' : 'hinzufügen')}
                </DialogTitle>
                <DialogContent>
                    <div className={classes.row}>
                        <FormControl className={classes.formControl} error={!this.state.DATE_FROM}>
                            <Typography variant="h6">Von</Typography>
                            <Picker
                                value={this.state.DATE_FROM}
                                onChange={(date) => this.handleFromDateChange(date)}
                                {...mask}
                                keyboard
                                ampm={false}
                                variant="inline"
                                cancelLabel="Abbrechen"
                                invalidDateMessage="Ungültiges Datumsformat"
                                renderInput={(props) => <TextField variant="outlined" {...props} />}
                            />
                            {!timeEdit && <Button onClick={() => this.editTime(true)}>Zeit hinzufügen</Button>}

                            {timeEdit && <Button onClick={() => this.editTime(false)}>Zeit entfernen</Button>}
                        </FormControl>

                        <FormControl className={classes.formControl} error={!this.state.DATE_TO}>
                            <Typography variant="h6">Bis</Typography>
                            <Picker
                                value={this.state.DATE_TO}
                                onChange={(date) => this.handleToDateChange(date)}
                                renderInput={(props) => <TextField variant="outlined" {...props} />}
                                {...mask}
                                keyboard
                                ampm={false}
                                variant="inline"
                                cancelLabel="Abbrechen"
                                invalidDateMessage="Ungültiges Datumsformat"
                            />

                            {timeEdit && (
                                <PeriodRangePicker
                                    from={this.state.DATE_FROM}
                                    to={this.state.DATE_TO}
                                    onChange={(from, to) => this.handleDateChange(from, to)}
                                />
                            )}
                        </FormControl>
                    </div>
                    <FormControl className={classes.formControl} error={!this.state.TYPE}>
                        <InputLabel htmlFor="type">Typ</InputLabel>
                        <SelectField
                            inputProps={{ name: 'type', id: 'type' }}
                            fullWidth
                            value={this.state.TYPE}
                            onChange={this.handleChange('TYPE')}
                        >
                            <MenuItem value={'NORMAL'}>Normal</MenuItem>
                            <MenuItem value={'EXAM'}>Prüfung</MenuItem>
                            <MenuItem value={'EXKURSION'}>Exkursion</MenuItem>
                        </SelectField>
                    </FormControl>
                    <FormControl className={classes.formControl} error={!this.state.TEXT}>
                        <InputLabel htmlFor="title">Text</InputLabel>
                        <Input
                            id="title"
                            name="text"
                            fullWidth
                            value={this.state.TEXT}
                            onChange={this.handleChange('TEXT')}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="sub-title">Beschreibung</InputLabel>
                        <Input
                            id="sub-title"
                            name="text"
                            multiline
                            rows={2}
                            fullWidth
                            value={this.state.SUBTEXT}
                            onChange={this.handleChange('SUBTEXT')}
                        />
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.HOMEPAGE}
                                onChange={this.handleChangeBox('HOMEPAGE')}
                                value={1}
                            />
                        }
                        label="Auf Webseite anzeigen"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.HOMEPAGE_BOX}
                                onChange={this.handleChangeBox('HOMEPAGE_BOX')}
                                value={1}
                            />
                        }
                        label="In Homepage-Box anzeigen"
                    />

                    <Preview>
                        <PreviewHeader>Vorschau</PreviewHeader>
                        <PreviewContainer>
                            <DateComponent date={this.extractDate(true)} />
                        </PreviewContainer>
                    </Preview>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={this.handleClose(true)}>
                        Abbrechen
                    </Button>
                    <Button color="primary" variant="contained" onClick={this.handleClose()}>
                        Absenden
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const PreviewHeader = styled.div`
    font-size: 100%;
    font-weight: 600;
`;

const Preview = styled.div`
    width: 300px;
    border: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
`;

const PreviewContainer = styled.div`
    width: 100%;
`;

const mapStateToProps = (state) => ({
    small: state.browser.lessThan.medium,
});

const mapDispatchToProps = (dispatch) => ({
    addDate: (date) => dispatch(addDate(date)),
    editDate: (date) => dispatch(editDate(date)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddDialog));
