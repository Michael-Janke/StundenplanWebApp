import React, { PureComponent } from 'react';
import {
    withStyles,
    Stepper,
    Step,
    Typography,
    Button,
    DialogActions,
    StepButton,
    Collapse,
    Paper,
    MobileStepper,
} from '@material-ui/core';
import ChooseStep from './choose';
import TextEditor from './textEditor';
import Finalize from './finalize';
import types from './types';
import { connect } from 'react-redux';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import DiashowEditor from './Diashow/diashowEditor';

const styles = theme => ({
    content: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(1)}px`,
        // backgroundColor: theme.palette.background.paper,
        overflowY: 'auto',
        flexGrow: 1,
    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    mobileStepper: {
        flexShrink: 0,
    },
});

const steps = [
    {
        Label: () => 'Auswählen',
        Component: ({ innerRef, ...other }) => <ChooseStep ref={innerRef} {...other} />,
    },
    {
        Label: ({ post }) => (types[post.TYPE] ? types[post.TYPE].label + ' bearbeiten' : 'Inhalt bearbeiten'),
        Component: props => {
            switch (props.post.TYPE) {
                case 'TEXT':
                    return <TextEditor ref={props.innerRef} {...props} />;
                case 'PICTURE':
                    return 'Bild';
                case 'DIASHOW':
                    return <DiashowEditor {...props} />;
                default:
                    return null;
            }
        },
    },
    {
        Label: () => 'Zusammenfassung',
        Component: ({ innerRef, ...other }) => <Finalize ref={innerRef} {...other} />,
    },
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
                    post,
                };
            } else {
                return {
                    open: true,
                    activeStep: 0,
                    post: {},
                };
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
    };

    handleNextFunction = index => fn => {
        this.functions[index] = fn;
    };

    handleStep = e => {
        let post = this.functions[this.state.activeStep]();
        if (!post) {
            return;
        }
        const diff = 1;
        if (this.state.activeStep + diff === steps.length) {
            this.props.onClose(this.state.post);
        } else {
            this.setState(state => ({
                activeStep: state.activeStep + diff,
                post,
            }));
        }
    };

    handleClick = index => e => {
        this.setState({
            activeStep: index,
        });
    };

    renderComponent = (Component, post, index) => {
        return (
            <Component
                handleNextFunction={this.handleNextFunction(index)}
                handleStep={this.handleStep}
                key={index}
                post={post}
            />
        );
    };

    render() {
        const { classes, small } = this.props;
        const { activeStep, post } = this.state;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <Paper elevation={0} className={classes.paper}>
                        {small && (
                            <Typography variant="h5" gutterBottom>
                                {React.createElement(steps[activeStep].Label, { post })}
                            </Typography>
                        )}
                        {!small && (
                            <Stepper activeStep={activeStep} orientation={'horizontal'}>
                                {steps.map(({ Label, Component }, index) => {
                                    return (
                                        <Step key={index}>
                                            <StepButton
                                                onClick={this.handleClick(index)}
                                                completed={index <= activeStep - 1}
                                            >
                                                <Label post={post} />
                                            </StepButton>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                        )}
                        {steps.map(({ Component }, index) => {
                            return (
                                <Collapse in={index === activeStep} key={index}>
                                    {this.renderComponent(Component, post, index)}
                                </Collapse>
                            );
                        })}
                    </Paper>
                </div>
                {small ? (
                    <MobileStepper
                        steps={steps.length}
                        position="static"
                        activeStep={activeStep}
                        className={classes.mobileStepper}
                        nextButton={
                            <Button size="small" onClick={this.handleStep}>
                                {activeStep < steps.length - 1 ? 'Weiter' : 'Erstellen'}
                                <KeyboardArrowRight />
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                                <KeyboardArrowLeft />
                                Zurück
                            </Button>
                        }
                    />
                ) : (
                    <DialogActions>
                        <Button onClick={this.handleBack} disabled={activeStep === 0}>
                            Zurück
                        </Button>
                        <Button variant="contained" color="primary" onClick={this.handleStep}>
                            {activeStep < steps.length - 1 ? 'Weiter' : 'Erstellen'}
                        </Button>
                    </DialogActions>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    small: state.browser.lessThan.medium,
});

export default connect(mapStateToProps)(withStyles(styles)(PostStepper));
