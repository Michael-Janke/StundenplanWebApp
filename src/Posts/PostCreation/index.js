import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import StockPhotoSelector from './StockPhotoSelector';
import PhotoModeSelector from './PhotoModeSelector';
import PhotoUpload from './PhotoUpload';
import PostMeta from './PostMeta';
import PreviewAndSave from './PreviewAndSave';
import { grey } from '@material-ui/core/colors';
import { Route, Switch, withRouter } from 'react-router';
import PostWrapper from './PostWrapper';
import { connect } from 'react-redux';

const styles = theme => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        justifyContent: 'center',
        backgroundColor: grey[100],
    },
    fullHeight: {
        flex: 1,
        padding: theme.spacing(2),
        height: '100%',
        overflow: 'auto',
    },
});


class PostCreation extends React.Component {

    state = {
        step: -1,

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { step, match, photoMode, history, location } = nextProps;
        const stepDifference = step - prevState.step
        if (stepDifference) {
            const newRoute = [
                `${match.url}/mode-selection`,
                `${match.url}/${photoMode === 'no' ? 'mode-selection' : `${photoMode}-photo`}`,
                `${match.url}/post-editor`,
                `${match.url}/post-meta`,
                `${match.url}/preview-and-save`,
            ][step];
            if (location.pathname !== newRoute) {
                history.replace(newRoute);
            }

            return {
                step: step,
                location
            }
        }
        if (location !== prevState.location) {
            const newStep = [
                `${match.url}/mode-selection`,
                `${match.url}/${photoMode}-photo`,
                `${match.url}/post-editor`,
                `${match.url}/post-meta`,
                `${match.url}/preview-and-save`,
            ].indexOf(location.pathname);
            
            nextProps.setStep(newStep);

            return {
                step: newStep,
                location
            }
        }
        return null;
    }

    render() {
        const { classes, step, match, handleNext, handleBack } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.fullHeight}>
                    <Switch>
                        <Route exact path={`${match.url}/mode-selection`} component={PhotoModeSelector}></Route>
                        <Route exact path={`${match.url}/stock-photo`} component={StockPhotoSelector}></Route>
                        <Route exact path={`${match.url}/upload-photo`} component={PhotoUpload}></Route>
                        <Route exact path={`${match.url}/post-editor`} component={PostWrapper}></Route>
                        <Route exact path={`${match.url}/post-meta`} component={PostMeta}></Route>
                        <Route exact path={`${match.url}/preview-and-save`} component={PreviewAndSave}></Route>
                    </Switch>

                </div>

                <MobileStepper
                    steps={5}
                    position="static"
                    activeStep={step}
                    className={classes.mobileStepper}
                    nextButton={
                        <Button size="small" onClick={handleNext} disabled={step >= 5 - 1}>
                            Weiter
                            <KeyboardArrowRight />
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={step === 0}>
                            <KeyboardArrowLeft />
                            Zurück
                        </Button>
                    }
                />
            </div>
        );
    };
}

const mapStateToProps = (state) => ({
    step: state.postcreation.step,
    photoMode: state.postcreation.photoMode,
})

const mapDispatchToProps = (dispatch) => ({
    handleNext: () => dispatch({ type: 'NEXT' }),
    handleBack: () => dispatch({ type: 'PREV' }),
    setStep: (step) => dispatch({ type: 'SET_STEP', payload: step }),
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withRouter(PostCreation)));
