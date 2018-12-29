import React, { PureComponent } from 'react'
import { withStyles, Stepper, Step, Typography, Button, DialogActions, StepButton, Collapse, Paper, StepContent } from '@material-ui/core';
import ChooseStep from './choose';
import TextEditor from './textEditor';
import Finalize from './finalize';
import types from './types';
import { connect } from 'react-redux';

const styles = theme => ({
    root: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit}px`,
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    },
});

const steps = [
    {
        Label: () => "Auswählen",
        Component: ({ innerRef, ...other }) => <ChooseStep ref={innerRef} {...other} />,
    },
    {
        Label: ({ post }) => types[post.TYPE] ? (types[post.TYPE].label + " bearbeiten") : "Inhalt bearbeiten",
        Component: (props) => {
            switch (props.post.TYPE) {
                case "TEXT":
                    return <TextEditor ref={props.innerRef} {...props}></TextEditor>
                case "PICTURE":
                    return "Bild";
                case "DIASHOW":
                    return "DIASHOW";
                default:
                    return null;
            }
        }
    },
    {
        Label: () => "Zusammenfassung",
        Component: ({ innerRef, ...other }) => <Finalize ref={innerRef} {...other} />
    }
];

class PostStepper extends PureComponent {
    state = {
        activeStep: 0,
    };

    functions = [];

    static getDerivedStateFromProps(props, state) {
        const { post } = props;
        if (!state.post) {
            if (post && post.TYPE) {
                return {
                    open: true,
                    activeStep: 1,
                    post
                }
            } else {
                return {
                    open: true,
                    activeStep: 0,
                    post: {}
                }
            }
        }
        return null;
    }

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    handleClose = () => {
        this.props.onClose();
    }

    handleNextFunction = index => fn => {
        this.functions[index] = fn;
    }

    handleStep = (e) => {
        let post = this.functions[this.state.activeStep]();
        const diff = 1;
        if (this.state.activeStep + diff === steps.length) {
            this.props.onClose(this.state.post);
        } else {
            this.setState(state => ({
                activeStep: state.activeStep + diff,
                post
            }));
        }
    }

    handleClick = (index) => (e) => {
        this.setState({
            activeStep: index,
        })
    }

    renderComponent = (Component, post, index) => {
        return (
            <Component
                handleNextFunction={this.handleNextFunction(index)}
                handleStep={this.handleStep}
                key={index}
                post={post}>
            </Component>
        )
    }

    render() {
        const { classes, small } = this.props;
        const { activeStep, post } = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Typography variant="h2" paragraph>Post {post.POST_ID ? "editieren" : "erstellen"}</Typography>

                    <Stepper activeStep={activeStep} orientation={small ? "vertical" : "horizontal"}>
                        {steps.map(({ Label, Component }, index) => {
                            return (
                                <Step key={index}>
                                    <StepButton
                                        onClick={this.handleClick(index)}
                                        completed={index <= activeStep - 1}
                                    >
                                        <Label post={post} />
                                    </StepButton>
                                    {small && (
                                        <StepContent>
                                            {this.renderComponent(Component, post, index)}
                                        </StepContent>
                                    )}
                                </Step>
                            );
                        })}
                    </Stepper>
                    {!small && steps.map(({ Component }, index) => {
                        return (
                            <Collapse in={index === activeStep} key={index}>
                                {this.renderComponent(Component, post, index)}
                            </Collapse>
                        );
                    })}
                    <DialogActions>
                        <Button
                            onClick={this.handleClose}
                        >
                            Abbrechen
                            </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleStep}
                        >
                            {activeStep < steps.length - 1 ? "Weiter" : "Erstellen"}
                        </Button>
                    </DialogActions>
                </Paper>
            </div>

        )
    }
}

const mapStateToProps = (state) => ({
    small: state.browser.lessThan.medium,
})

export default connect(mapStateToProps)(withStyles(styles)(PostStepper));