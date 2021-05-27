import React, { useState } from 'react';
import { connect } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import Upload from '../../Common/Upload';
import APIImage from '../../Common/APIImage';
import makeStyles from '@material-ui/styles/makeStyles';

const useStyles = makeStyles({
    preview: {
        width: '100%',
        maxWidth: 500,
        borderRadius: 10,
    },
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        minHeight: '100%',
    },
    uploader: {
        width: '100%',
    },
    images: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        objectFit: 'cover',
    },
    imageWrapper: {
        width: 200,
        height: 200,
        padding: 2,
        position: 'relative',
    },
    button: {
        position: 'absolute',
        right: 8,
        bottom: 8,
    },
});

const PhotoUpload = ({ images: uploadedImages, setImagesDispatch, deleteImage }) => {
    const [images, setImages] = useState(() => uploadedImages);
    const classes = useStyles();

    const handleDeleteImage = (image) => {
        deleteImage(image);
    };
    const handleOnFinished = (images) => {
        setImagesDispatch(images);
    };

    return (
        <div className={classes.root}>
            <div className={classes.uploader}>
                <Upload
                    allowMultiple={true}
                    onUpdate={setImages}
                    files={[]}
                    onFinished={() => handleOnFinished(images.map((file) => file.serverId))}
                    acceptedFileTypes={['image/*']}
                />
            </div>
            <div className={classes.images}>
                {uploadedImages.map((image) => (
                    <div className={classes.imageWrapper} key={image}>
                        <APIImage src={image} className={classes.image} />
                        <Fab className={classes.button} size="small" onClick={() => handleDeleteImage(image)}>
                            <DeleteIcon />
                        </Fab>
                    </div>
                ))}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    images: state.postcreation.images,
});

const mapDispatchToProps = (dispatch) => ({
    setImagesDispatch: (images) => dispatch({ type: 'SET_IMAGES', payload: images }),
    deleteImage: (image) => dispatch({ type: 'DELETE_IMAGE', payload: image }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoUpload);
