import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import PhotoUpload from './PhotoUpload';
import Meta from '../Common/Meta';
import { grey } from '@material-ui/core/colors';
import PreviewAndSave from './PreviewAndSave';

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
    const maxSteps = 3;
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState(['Titel hier eingeben']);

    const handleNext = () => setActiveStep(activeStep + 1);

    const handleBack = () => setActiveStep(activeStep - 1);

    const onUpload = newImages => {
        setImages([...images, ...newImages]);
    };

    const onDeleteImage = image => {
        setImages(images.filter(i => i !== image));
    };

    const onSave = () => {};

    return (
        <div className={classes.root}>
            <div className={classes.fullHeight}>
                {activeStep === 0 && <Meta diashow={true} title={title} onUpdateTitle={setTitle} />}
                {activeStep === 1 && <PhotoUpload onUpload={onUpload} onDeleteImage={onDeleteImage} images={images} />}
                {activeStep === 2 && <PreviewAndSave images={images} title={title} />}
            </div>

            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                className={classes.mobileStepper}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep >= maxSteps - 1 || (activeStep === 1 && !images.length)}
                    >
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
