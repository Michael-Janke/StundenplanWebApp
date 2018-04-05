import React, { Component } from 'react';
import styled from 'styled-components';
import Dialog from 'material-ui/Dialog';
import { FlatButton, TextField } from 'material-ui';
import { connect } from 'react-redux';
import AddIcon from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/content/create';
import { grey400 } from 'material-ui/styles/colors';
import { purple600 } from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Day from '../day';
import { addDate, editDate } from '../actions';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

let DateTimeFormat;

/**
 * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
 */
// if (areIntlLocalesSupported(['fr', 'fa-IR'])) {
DateTimeFormat = global.Intl.DateTimeFormat;
// } else {
//     const IntlPolyfill = require('intl');
//     DateTimeFormat = IntlPolyfill.DateTimeFormat;
//     require('intl/locale-data/jsonp/fr');
//     require('intl/locale-data/jsonp/fa-IR');
// }


export class AddDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            appointment: {
                TEXT: "",
                SUBTEXT: "",
                TYPE: "",
            },
        };
    }

    open(appointment) {
        this.setState({
            open: true,
            edit: !!appointment,
            ...(appointment && {
                appointment: {
                    ...appointment,
                    DATE_FROM: new Date(appointment.DATE_FROM.date),
                    DATE_TO: new Date(appointment.DATE_TO.date)
                }
            })
        });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleAddAppointment = () => {
        const appointment = this.state.appointment;
        // appointment.DATE_FROM = appointment.DATE_FROM && (appointment.DATE_FROM.date || appointment.DATE_FROM);
        // appointment.DATE_TO = appointment.DATE_TO && (appointment.DATE_TO.date || appointment.DATE_TO);
        if (this.state.edit) {
            this.props.editDate(appointment);
        } else {
            this.props.addDate(appointment);
        }
    }

    handleTypeInputChange = (event, index, value) => {
        this.setState(prevState => ({ appointment: { ...prevState.appointment, TYPE: value } }));
    }

    handleSubTextChange = (event) => {
        const value = event.target.value;
        this.setState(prevState => ({ appointment: { ...prevState.appointment, SUBTEXT: value } }));
    }

    handleTextChange = (event) => {
        const value = event.target.value;
        this.setState(prevState => ({ appointment: { ...prevState.appointment, TEXT: value } }));
    }

    handleFromDateChange = (event, date) => {
        this.setState(prevState => ({ appointment: { ...prevState.appointment, DATE_FROM: date } }));
    }

    handleToDateChange = (event, date) => {
        this.setState(prevState => ({ appointment: { ...prevState.appointment, DATE_TO: date } }));
    }

    render() {
        const { edit } = this.state;

        const actions = [
            <FlatButton
                label="Abbrechen"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Absenden"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleAddAppointment}
            />,
        ];

        const customContentStyle = {
        };
        const Icon = edit ? EditIcon : AddIcon;

        return (
            <Dialog
                title={<Title><Icon color={grey400} style={{ marginRight: '1vmin' }} />{"Termin " + (edit ? "editieren" : "hinzufügen")}</Title>}
                actions={actions}
                modal={false}
                contentStyle={customContentStyle}
                open={this.state.open}
                onRequestClose={this.handleClose}
            >
                <Container>
                    <Form>
                        <DatePicker
                            container="inline"
                            hintText="Von Datum"
                            fullWidth
                            locale="de"
                            DateTimeFormat={DateTimeFormat}
                            errorText={!this.state.appointment.DATE_FROM && "Bitte wähle einen Zeitraum aus"}
                            value={this.state.appointment.DATE_FROM}
                            onChange={this.handleFromDateChange}
                            errorStyle={{ color: purple600 }}
                        />
                        <DatePicker
                            container="inline"
                            hintText="Zu Datum"
                            fullWidth
                            locale="de"
                            DateTimeFormat={DateTimeFormat}
                            errorText={!this.state.appointment.DATE_TO && "Bitte wähle einen Zeitraum aus"}
                            value={this.state.appointment.DATE_TO}
                            onChange={this.handleToDateChange}
                            errorStyle={{ color: purple600 }}
                        />
                        <SelectField
                            errorText={!this.state.appointment.TYPE && "Bitte wähle einen Typ aus"}
                            floatingLabelText="Typ"
                            fullWidth
                            name="select"
                            ref="typeInput"
                            errorStyle={{ color: purple600 }}
                            value={this.state.appointment.TYPE}
                            onChange={this.handleTypeInputChange}
                        >
                            <MenuItem value={"NORMAL"} primaryText="Normal" />
                            <MenuItem value={"EXKURSION"} primaryText="Exkursion" />
                        </SelectField>
                        <TextField
                            name="text"
                            errorText={!this.state.appointment.TEXT && "Bitte schreibe eine Nachricht"}
                            fullWidth
                            floatingLabelText="Titel"
                            value={this.state.appointment.TEXT}
                            onChange={this.handleTextChange}
                            errorStyle={{ color: purple600 }}
                            hintStyle={{ color: purple600 }}
                            floatingLabelFocusStyle={{ color: purple600 }}
                        />
                        <TextField
                            name="subText"
                            errorText={!this.state.appointment.SUBTEXT && "Bitte schreibe eine Nachricht"}
                            fullWidth
                            multiLine
                            floatingLabelText="Text"
                            rows={4}
                            value={this.state.appointment.SUBTEXT}
                            onChange={this.handleSubTextChange}
                            errorStyle={{ color: purple600 }}
                            hintStyle={{ color: purple600 }}
                            floatingLabelFocusStyle={{ color: purple600 }}
                        />
                    </Form>
                    <Preview>
                        <PreviewHeader>
                            Vorschau
                        </PreviewHeader>
                        <PreviewContainer>
                            <Day date={moment(this.state.appointment.DATE_FROM)}
                                appointments={[this.state.appointment]} />
                        </PreviewContainer>
                    </Preview>
                </Container>
            </Dialog>
        )
    }
}

const Title = styled.div`
    display: flex;
    align-items: center;
`;

const Form = styled.div`
    flex: 1;
`;
const PreviewHeader = styled.div`
    font-size: 100%;
    font-weight: 600;
`;

const Preview = styled.div`
    width: 300px;
    // border-left: 1px solid #e0e0e0;
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-left: 4vw;
`;
const PreviewContainer = styled.div`
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    addDate: (date) => dispatch(addDate(date)),
    editDate: (date) => dispatch(editDate(date)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AddDialog);