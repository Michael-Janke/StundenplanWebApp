import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { Button, Grid } from '@material-ui/core';
import Contribution from './contribution';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { addContribution, editContribution, getContributions } from './actions';
import { asynchronize } from '../Router/asynchronize';

const ContributionEditor = asynchronize(() => import('./editor'));

const styles = theme => ({
    root: {
        width: '100%',
        // padding: `${theme.spacing.unit * 8}px ${theme.spacing.unit * 6}px`,
        boxSizing: 'border-box',
        overflowY: 'auto',
    },
    contributions: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    contributionsEnter: {
        opacity: 0,
    },
    contributionsEnterActive: {
        transition: theme.transitions.create(['opacity']),
        opacity: 1,
    },
    contributionsExit: {
        opacity: 1,
    },
    contributionsExitActive: {
        transition: theme.transitions.create(['opacity']),
        opacity: 0,
    },

    createButton: {
        position: 'absolute',
        right: theme.spacing.unit * 2,
        bottom: theme.spacing.unit * 2,
    },
    heroUnit: {
        backgroundColor: theme.palette.background.paper,
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    heroButtons: {
        marginTop: theme.spacing.unit * 4,
    },
    layout: {
        padding: `${theme.spacing.unit * 8}px 0`,
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
});

class Contributions extends React.Component {

    state = { dialogOpen: false };

    componentWillMount() {
        this.props.getContributions();
    }
    handleDialogClose = (contribution) => {
        this.setState({ dialogOpen: false });
        if (!contribution) {
            return;
        }
        if (contribution.CONTRIBUTION_ID) {
            this.props.editContribution(contribution);
        } else {
            this.props.addContribution(contribution);
        }
    }

    handleCreate = () => {
        this.setState({ dialogOpen: true, contributionEdit: null });
    }

    handleOnEdit = (contribution) => {
        this.setState({ dialogOpen: true, contributionEdit: contribution });
    }

    render() {
        const { classes, contributions, isAdmin } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.heroUnit}>
                    <div className={classes.heroContent}>
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Beiträge
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" paragraph>
                            Erstelle Beiträge, um z.B. wichtige Informationen bekanntzugeben. 
                        </Typography>
                        {contributions && !contributions.length &&
                            <Typography variant="h6" align="center" color="error" paragraph>
                                Es sind keine Beiträge vorhanden!
                            </Typography>
                        }
                        <div className={classes.heroButtons}>
                            <Grid container spacing={16} justify="center">
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={this.handleCreate}>
                                        Jetzt erstellen
                                    </Button>
                                </Grid>
                                {/* <Grid item>
                                    <Button variant="outlined" color="primary">
                                        Secondary action
                                    </Button>
                                </Grid> */}
                            </Grid>
                        </div>
                    </div>
                </div>
                <div className={classes.layout}>
                    <Grid container component={TransitionGroup} spacing={40} className={classes.contributions}>
                        {contributions && contributions.map((contribution, i) => (
                            <CSSTransition
                                classNames={{
                                    enter: classes.contributionsEnter,
                                    enterActive: classes.contributionsEnterActive,
                                    exit: classes.contributionsExit,
                                    exitActive: classes.contributionsExitActive,
                                }}
                                key={contribution.CONTRIBUTION_ID}
                                timeout={500}>
                                <Grid item xs={12} md={6}>
                                    <Contribution contribution={contribution} isAdmin={isAdmin} onEdit={this.handleOnEdit} />
                                </Grid>
                            </CSSTransition>
                        ))}
                    </Grid>
                </div>
                <ContributionEditor
                    isAdmin={isAdmin}
                    open={this.state.dialogOpen}
                    onClose={this.handleDialogClose}
                    contribution={this.state.contributionEdit}
                />
                <Button variant="fab" color="primary" className={classes.createButton} onClick={this.handleCreate}>
                    <AddIcon />
                </Button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    contributions: state.contributions.contributions,
    isAdmin: state.user.scope === 'admin',
});

const mapDispatchToProps = dispatch => ({
    getContributions: () => dispatch(getContributions()),
    addContribution: (contribution) => dispatch(addContribution(contribution)),
    editContribution: (contribution) => dispatch(editContribution(contribution)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Contributions));