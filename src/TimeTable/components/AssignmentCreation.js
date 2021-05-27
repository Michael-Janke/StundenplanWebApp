import React, { Component } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import AssignmentLink from './assignmentLink';

import { connect } from 'react-redux';
import { closeCreateAssignment, createAssignment, publishAssignment } from '../actions';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" {...props} ref={ref} />);

const styles = (theme) => ({
    actionButtons: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(4),
    },
    root: {
        maxWidth: 500,
        overflowY: 'auto',
    },
});

export class AssignmentCreation extends Component {
    state = {
        title: '',
        instructions: '',
    };

    clearError = () => {
        this.setState({ error: null });
    };

    handleClose = () => {
        this.props.closeCreateAssignment();
    };

    handleChange = (name) => (event) => {
        this.setState({
            [name]: event.target.checked === undefined ? event.target.value : event.target.checked,
        });
    };

    handleSend = () => {
        const title = this.state.title;
        if (title.length === 0) {
            this.setState({ error: true });
            return;
        }
        this.props.createAssignment({
            teamId: this.props.team.id,
            instructions: this.state.instructions,
            title: this.state.title,
            date: this.props.date,
        });
    };

    handlePublish = () => {
        this.props.publishAssignment({ id: this.props.createdAssignment.id, teamId: this.props.team.id });
    };

    render() {
        const { team, sending, error, fullScreen, created, createdAssignment, classes } = this.props;
        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
                fullScreen={fullScreen}
            >
                <DialogTitle>
                    <Title>
                        <AssignmentIcon color="primary" style={{ marginRight: '1vmin' }} />
                        Aufgabe {created ? 'erstellt' : 'erstellen'}
                    </Title>
                </DialogTitle>
                {!created && (
                    <DialogContent className={classes.root}>
                        <DialogContentText>
                            Es wird eine Aufgabe als Entwurf im Team <b>{team.displayName}</b> erstellt. Diese kann auf
                            der nächsten Seite veröffentlicht werden.
                        </DialogContentText>
                        <Error>{error}</Error>
                        <TextField
                            onFocus={this.clearError}
                            error={!!this.state.error}
                            name="title"
                            value={this.state.title}
                            onChange={this.handleChange('title')}
                            fullWidth
                            multiline
                            label="Titel"
                            autoFocus
                        />
                        <TextField
                            name="instructions"
                            value={this.state.instructions}
                            onChange={this.handleChange('instructions')}
                            fullWidth
                            multiline
                            label="(Optional) Anweisungen"
                            rows={4}
                            style={{ marginTop: '1em' }}
                        />
                        <DialogContentText style={{ marginTop: '1em' }}>
                            Im nächsten Schritt kannst du auf der Team-Seite Ressourcen hinzufügen.
                        </DialogContentText>
                    </DialogContent>
                )}
                {created && (
                    <DialogContent className={classes.root}>
                        <Typography variant="body1" gutterBottom>
                            Die Aufgabe ’{createdAssignment.displayName}’ wurde als Entwurf erstellt.
                        </Typography>

                        <Typography variant="body1" gutterBottom>
                            Du kannst sie nun <b>veröffentlichen</b>. Damit sehen Schüler die Aufgabe in ihrem
                            Stundenplan und werden benachrichtigt.
                        </Typography>
                        <div className={classes.actionButtons}>
                            <Button onClick={this.handlePublish} color="primary" disabled={sending} variant="contained">
                                {sending && <CircularProgress size={24} />} Veröffentlichen
                            </Button>
                        </div>

                        <Typography variant="body1" gutterBottom>
                            Du kannst die Aufgabe <b>in Teams öffnen</b>, um zum Beispiel Dateien hinzufügen.
                        </Typography>
                        <div className={classes.actionButtons}>
                            <AssignmentLink
                                id={team.id}
                                assignment={createdAssignment}
                                button
                                onClick={this.handleClose}
                            >
                                Bearbeiten
                            </AssignmentLink>
                        </div>
                    </DialogContent>
                )}
                <DialogActions classes={{ root: classes.actions }}>
                    <Button onClick={this.handleClose} color="secondary">
                        Schließen
                    </Button>
                    {!created && (
                        <Button onClick={this.handleSend} color="primary" disabled={sending} variant="contained">
                            {sending && <CircularProgress size={24} />} Weiter
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        );
    }
}
const Error = styled.p`
    color: red;
`;

const Title = styled.div`
    display: flex;
    align-items: center;
`;

const noop = {};
const mapStateToProps = (state) => ({
    open: !!state.assignments.createAssignmentFor,
    team: state.assignments.createAssignmentFor || noop,
    sending: state.assignments.sending,
    created: state.assignments.created,
    error: state.assignments.error,
    date: state.assignments.date,
    createdAssignment: state.assignments.createdAssignment,
});

const mapDispatchToProps = (dispatch) => ({
    closeCreateAssignment: () => dispatch(closeCreateAssignment()),
    createAssignment: (data) => dispatch(createAssignment(data)),
    publishAssignment: (data) => dispatch(publishAssignment(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withMobileDialog()(withStyles(styles)(AssignmentCreation)));
