import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import StockPhotoSelector from './StockPhotoSelector';
import PhotoModeSelector from './PhotoModeSelector';
import PhotoUpload from './PhotoUpload';
import PostMeta from '../Common/Meta';
import PreviewAndSave from './PreviewAndSave';
import { grey } from '@material-ui/core/colors';
import { withRouter } from 'react-router';
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

function PostCreation({ photoMode, step, classes, handleNext, handleBack }) {

    const steps = [
        PhotoModeSelector,
        photoMode === 'stock' && StockPhotoSelector,
        photoMode === 'upload' && PhotoUpload,
        PostWrapper,
        PostMeta,
        PreviewAndSave,
    ].filter(step => step);
    // filter non existing steps


    function renderStep() {
        const Component = steps[step];
        if (!Component) {
            return null;
        }
        return (
            <Component></Component>
        )
    }
    return (
        <div className={classes.root}>
            <div className={classes.fullHeight}>
                {renderStep()}
            </div>

            <MobileStepper
                steps={steps.length}
                position="static"
                activeStep={step}
                className={classes.mobileStepper}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={step >= steps.length - 1}>
                        Weiter
                        <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={step === steps.length}>
                        <KeyboardArrowLeft />
                        Zurück
                    </Button>
                }
            />
        </div>
    );
}


const mapStateToProps = state => ({
    step: state.postcreation.step,
    photoMode: state.postcreation.photoMode,
});

const mapDispatchToProps = dispatch => ({
    handleNext: () => dispatch({ type: 'NEXT' }),
    handleBack: () => dispatch({ type: 'PREV' }),
    setStep: step => dispatch({ type: 'SET_STEP', payload: step }),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(withRouter(PostCreation)));
