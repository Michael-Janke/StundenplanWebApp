import React, { Component } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Create';
import grey from '@material-ui/core/colors/grey';
import MenuItem from '@material-ui/core/MenuItem';
import Day from '../day';
import { addDate, editDate } from '../actions';
import moment from 'moment';
import SelectField from '@material-ui/core/Select';
import DatePickerComponent from 'material-ui-pickers/DatePicker';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import datePickerEnhancer from '../datePickerEnhancer';

const DatePicker = datePickerEnhancer(DatePickerComponent);

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
});

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
                    DATE_FROM: moment(appointment.DATE_FROM.date),
                    DATE_TO: moment(appointment.DATE_TO.date)
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
        this.handleClose();
    }

    handleTypeInputChange = (event) => {
        this.setState(prevState => ({ appointment: { ...prevState.appointment, TYPE: event.target.value } }));
    }

    handleSubTextChange = (event) => {
        const value = event.target.value;
        this.setState(prevState => ({ appointment: { ...prevState.appointment, SUBTEXT: value } }));
    }

    handleTextChange = (event) => {
        const value = event.target.value;
        this.setState(prevState => ({ appointment: { ...prevState.appointment, TEXT: value } }));
    }

    handleFromDateChange = (date) => {
        this.setState(prevState => ({ appointment: { ...prevState.appointment, DATE_FROM: date, DATE_TO: date } }));
    }

    handleToDateChange = (date) => {
        this.setState(prevState => ({ appointment: { ...prevState.appointment, DATE_TO: date } }));
    }

    render() {
        const { edit } = this.state;
        const { classes } = this.props;
        const Icon = edit ? EditIcon : AddIcon;

        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
            >
                <DialogTitle>
                    <Icon color={grey[400]} style={{ marginRight: '1vmin' }} />
                    {"Termin " + (edit ? "editieren" : "hinzufügen")}
                </DialogTitle>
                <DialogContent>
                    <Container>
                        <Form>
                            <FormControl className={classes.formControl}
                                error={!this.state.appointment.DATE_FROM}>
                                <DatePicker
                                    autoOk
                                    label="von Datum"
                                    value={this.state.appointment.DATE_FROM}
                                    onChange={this.handleFromDateChange}
                                    format="DD.MM.YYYY"
                                    keyboard
                                    mask={value => (value ?
                                        [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/] : [])}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}
                                error={!this.state.appointment.DATE_TO}>
                                <DatePicker
                                    autoOk
                                    clearable
                                    label="bis Datum"
                                    value={this.state.appointment.DATE_TO}
                                    onChange={this.handleToDateChange}
                                    format="DD.MM.YYYY"
                                    keyboard
                                    mask={value => (value ?
                                        [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/] : [])}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl} error={!this.state.appointment.TYPE}>
                                <InputLabel htmlFor="type">Typ</InputLabel>
                                <SelectField
                                    inputProps={{ name: 'type', id: 'type' }}
                                    fullWidth
                                    value={this.state.appointment.TYPE}
                                    onChange={this.handleTypeInputChange}
                                >
                                    <MenuItem value={"NORMAL"}>
                                        Normal
                                    </MenuItem>
                                    <MenuItem value={"EXKURSION"}>
                                        Exkursion
                                    </MenuItem>
                                </SelectField>
                                <FormHelperText>Bitte wähle einen Typ aus</FormHelperText>
                            </FormControl>
                            <FormControl className={classes.formControl} error={!this.state.appointment.TEXT}>
                                <InputLabel htmlFor="title">Text</InputLabel>
                                <Input
                                    id="title"
                                    name="text"
                                    fullWidth
                                    value={this.state.appointment.TEXT}
                                    onChange={this.handleTextChange}
                                />
                                <FormHelperText>Bitte schreibe eine Nachricht</FormHelperText>
                            </FormControl>
                            <FormControl className={classes.formControl} error={!this.state.appointment.SUBTEXT}>
                                <InputLabel htmlFor="sub-title">SubText</InputLabel>
                                <Input
                                    id="sub-title"
                                    name="text"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={this.state.appointment.SUBTEXT}
                                    onChange={this.handleSubTextChange}
                                />
                                <FormHelperText>Bitte schreibe eine Nachricht</FormHelperText>
                            </FormControl>
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
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={this.handleClose}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        color="primary"
                        keyboardFocused={true}
                        onClick={this.handleAddAppointment}
                    >
                        Absenden
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}


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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AddDialog));