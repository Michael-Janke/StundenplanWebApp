import React, { Component } from 'react';
import { withStyles, FormControl, InputLabel, Input, FormHelperText, Paper, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import ImageEditor from './imageEditor';
import Thumbnail from './Thumbnail';
import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
    formControl: {
        padding: theme.spacing.unit,
        minWidth: 140,
        width: '100%',
        boxSizing: 'border-box',
    },
    dialog: {
        padding: 0,
    },
    content: {
        padding: theme.spacing.unit,
        maxWidth: 480,
        flex: 3,
    },
    container: {
        display: 'flex',
        width: '100%',
        flexWrap: 'wrap',
    },
    editor: {
        padding: theme.spacing.unit,
        flex: 1,
        backgroundColor: theme.palette.background.default,
    },
    thumbnails: {
        width: '100%',
        padding: theme.spacing.unit,
        backgroundColor: theme.palette.background.default,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing.unit * 4,
        backgroundColor: theme.palette.background.default,
    },
});

class DiashowEditor extends Component {
    state = { activeStep: 0, images: [] };

    static getDerivedStateFromProps(props, state) {
        const post = props.post;
        if (post !== state.post && post.TYPE) {
            return {
                post,
                ...post,
                images: post.IMAGES || [],
            };
        }
        return state;
    }

    componentDidMount() {
        this.props.handleNextFunction(this.handleNext);
    }

    componentWillUnmount() {
        this.props.handleNextFunction(null);
    }

    handleNext = () => {
        const prevPost = this.props.post;
        if (!this.state.TITLE) {
            return null;
        }
        return {
            ...prevPost,
            TITLE: this.state.TITLE,
            IMAGES: this.state.images.filter(image => !!image.src),
        };
    };

    handleChange = key => (event, value) => {
        this.setState({ [key]: value || event.target.value });
    };

    handleImageChange = (image, key) => (event, value) => {
        image[key] = value || event.target.value;
        this.setState({});
    };

    handleThumbnailClicked = value => {
        this.setState({ activeStep: value });
    };

    handleImageEdit = image => {
        const images = this.state.images;
        images[this.state.activeStep] = { ...images[this.state.activeStep], ...image };
        if (!images.find(image => !image.src)) {
            images.push({
                DURATION: 1,
                TITLE: '',
            });
        }
        this.setState({ images });
    };

    render() {
        const { classes } = this.props;
        const { activeStep, images } = this.state;
        const currentImage = (images[activeStep] = images[activeStep] || {
            DURATION: 1,
            TITLE: '',
        });

        return (
            <div className={classes.root}>
                <FormControl required className={classes.formControl} error={!this.state.TITLE}>
                    <InputLabel htmlFor="title">Titel</InputLabel>
                    <Input
                        id="title"
                        name="text"
                        fullWidth
                        value={this.state.TITLE}
                        onChange={this.handleChange('TITLE')}
                    />
                    <FormHelperText id="title">Ein Titel wird benötigt</FormHelperText>
                </FormControl>
                <Paper>
                    <div className={classes.container}>
                        <div className={classes.content}>
                            <Paper square elevation={0} className={classes.header}>
                                <FormControl className={classes.formControl} error={!this.state.TITLE}>
                                    <InputLabel htmlFor="TITLE">Bildüberschrift</InputLabel>
                                    <Input
                                        id="TITLE"
                                        name="text"
                                        fullWidth
                                        value={currentImage.TITLE}
                                        onChange={this.handleImageChange(currentImage, 'TITLE')}
                                    />
                                </FormControl>
                            </Paper>
                            <ImageEditor image={currentImage} onImageEdit={this.handleImageEdit} />
                        </div>
                        <div className={classes.editor}>
                            <Typography variant="h4">Bild {activeStep + 1}</Typography>
                            <FormControl className={classes.formControl} error={!this.state.TITLE}>
                                <Typography id="label" paragraph>
                                    Länge {currentImage.DURATION}s
                                </Typography>
                                <Slider
                                    classes={{ container: classes.slider }}
                                    value={currentImage.DURATION}
                                    aria-labelledby="label"
                                    min={1}
                                    max={5}
                                    step={1}
                                    onChange={this.handleImageChange(currentImage, 'DURATION')}
                                />
                            </FormControl>
                        </div>
                    </div>
                    <div className={classes.thumbnails}>
                        {images.map((image, i) => (
                            <Thumbnail key={i} image={image} onClick={() => this.handleThumbnailClicked(i)} />
                        ))}
                    </div>
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    small: state.browser.lessThan.medium,
});

export default connect(mapStateToProps)(withStyles(styles)(DiashowEditor));
