import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import StockPhotoSelector from './StockPhotoSelector';
import PhotoModeSelector from './PhotoModeSelector';
import PhotoUpload from './PhotoUpload';
import Post from './Post';
import PostMeta from './PostMeta';
import PreviewAndSave from './PreviewAndSave';
import { grey } from '@material-ui/core/colors';

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

const TextMobileStepper = ({ classes }) => {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = 5;
    const [title, setTitle] = useState('Titel hier eingeben');
    const [content, setContent] = useState();
    const [photoMode, setPhotoMode] = useState('no');
    const [image, setImage] = useState();

    const handleNext = () => setActiveStep(activeStep + 1);

    const handleBack = () => setActiveStep(activeStep - 1);

    const onUpload = url => {
        setImage(url);
        handleNext();
    };

    const onPhotoModeSelect = mode => {
        setPhotoMode(mode);
        setActiveStep(activeStep + 1 + (mode === 'no'));
    };

    const onSave = () => {};

    return (
        <div className={classes.root}>
            <div className={classes.fullHeight}>
                {activeStep === 0 && <PhotoModeSelector onPhotoModeSelect={onPhotoModeSelect} />}
                {activeStep === 1 && photoMode === 'stock' && <StockPhotoSelector onUpload={onUpload} />}
                {activeStep === 1 && photoMode === 'upload' && <PhotoUpload onUpload={onUpload} image={image} />}
                {activeStep === 2 && (
                    <Post
                        image={image}
                        title={title}
                        onUpdateTitle={setTitle}
                        onUpdateContent={setContent}
                        content={content}
                    />
                )}
                {activeStep === 3 && <PostMeta />}
                {activeStep === 4 && <PreviewAndSave image={image} title={title} content={content} onSave={onSave} />}
            </div>

            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                className={classes.mobileStepper}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep >= maxSteps - 1}>
                        Weiter
                        <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        <KeyboardArrowLeft />
                        Zurück
                    </Button>
                }
            />
        </div>
    );
};

TextMobileStepper.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TextMobileStepper);
