import React, { Component } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { updateRemindSettings } from '../actions';
import MailIcon from '@material-ui/icons/Mail';
import AddIcon from '@material-ui/icons/Add';
import Slide from '@material-ui/core/Slide';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';

import TimePickerComponent from 'material-ui-pickers/TimePicker/TimePickerInline';
import datePickerEnhancer from '../../Dates/datePickerEnhancer';
import { Fab } from '@material-ui/core';

const TimePicker = datePickerEnhancer(TimePickerComponent);


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export class ReminderSettings extends Component {

    state = {}

    static getDerivedStateFromProps(nextProps, prevState){
        if((prevState.loading && !nextProps.loading) || prevState.loading === undefined)
            return {
                ...prevState,
                remind: nextProps.remind === undefined ? true : nextProps.remind,
                remindTime: moment(nextProps.remindTime || "18:00:00", 'HH:mm:ss'),
                remindEMails: nextProps.remindEMails && nextProps.remindEMails.split 
                    ? nextProps.remindEMails.split(";") 
                    : [nextProps.upn],
                loading: nextProps.loading
            };
        return {
            ...prevState,
            loading: nextProps.loading 
        };
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value });
    };

    deleteEMail = (email)=> () => {
        this.setState({
            remindEMails: [
                ...this.state.remindEMails.filter((e) => e!==email)
            ]
        })
    }

    addEMail = () => {
        this.setState({
            remindEMails: [
                ...this.state.remindEMails.filter((e) => e.toLowerCase()!==this.state.newEMail.toLowerCase()),
                this.state.newEMail
            ],
            newEMail: ''
        })
    }

    handleClose = () => {
        this.props.onClose();
    }

    handleUpdate = () => {
        this.handleClose();
        this.props.updateRemindSettings({
            remind: this.state.remind,
            remindTime: moment(this.state.remindTime).format("HH:mm:ss"),
            remindEMails: this.state.remindEMails.join(";")
        });
    }

    render() {
        const {loading} = this.props;
        const {remind, remindTime, remindEMails} = this.state;
        const customContentStyle = {
            maxWidth: 500,
            overflowY: 'auto',
        };
        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
                fullScreen={this.props.small}
            >
                <DialogTitle>
                    <Title>
                        <MailIcon style={{ marginRight: '1vmin' }} />{"E-Mail-Erinnerungen"}
                    </Title>
                </DialogTitle>
                <DialogContent style={customContentStyle}>
                    {loading && "Daten werden geladen"}
                    <DialogContentText>
                        <FlexContainer>
                            <Row>
                                <span>E-Mail-Erinnerung:</span>
                                <Switch
                                    checked={remind}
                                    onChange={(event) => this.handleChange('remind', event.target.checked)}
                                    disabled={loading}
                                    color="primary"
                                />
                            </Row>
                            <Row>
                                <span>Uhrzeit:</span>
                                <TimePicker
                                    ampm={this.props.small}
                                    value={remindTime}
                                    onChange={(time) => {
                                        if(time.hours() < 15)
                                            time.hours(15);
                                        time.minutes(Math.floor(time.minutes()/5)*5);
                                        this.handleChange('remindTime', time)
                                    }}
                                    disabled={loading || !remind}
                                    okToConfirm={false}
                                />
                            </Row>
                            {!loading && remind &&
                            <div>
                                <span>Empfänger:</span>
                                <List>
                                    {remindEMails.map((email) =>
                                    <ListItem key={email}>
                                        <ListItemText primary={email} />
                                        <ListItemSecondaryAction>
                                            <IconButton 
                                                aria-label="Delete"
                                                onClick={this.deleteEMail(email)}
                                                disabled={loading}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    )}
                                    <ListItem>
                                        <ListItemText>
                                            <TextField
                                                label="Empfänger hinzufügen"
                                                value={this.state.newEMail}
                                                onChange={(event) => this.handleChange('newEMail', event.target.value)}
                                                margin="normal"
                                                fullWidth
                                            />
                                        </ListItemText>
                                        <ListItemSecondaryAction>
                                            <Fab
                                                style={{marginLeft:5}}
                                                size="small"
                                                color="primary"
                                                aria-label="Add" 
                                                onClick={this.addEMail}
                                                disabled={loading || !validateEmail(this.state.newEMail)}
                                            >
                                                <AddIcon />
                                            </Fab>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </List>
                            </div>}
                        </FlexContainer>
                    </DialogContentText>
                </DialogContent>
                <DialogActions> 
                    <Button
                        onClick={this.handleClose}
                        color="secondary"
                    >
                        Abbrechen
                    </Button>
                    
                    <Button
                        onClick={this.handleUpdate}
                        disabled={loading}
                        color="primary"
                    >
                        Absenden
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const Title = styled.div`
    display: flex;
    align-items: center;
`;

const FlexContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Row = styled.div`
    width:100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 10px;
    flex-wrap: wrap;
`;

const mapStateToProps = (state) => ({
    remind: state.user.remind,
    remindTime: state.user.remindTime,
    remindEMails: state.user.remindEMails,
    loading: state.user.loading,
    upn: state.user.upn,
    small: state.browser.lessThan.medium
});

const mapDispatchToProps = (dispatch) => ({
    updateRemindSettings: (settings) => dispatch(updateRemindSettings(settings))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReminderSettings);

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}