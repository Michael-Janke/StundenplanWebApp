import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import Upload from '../Common/Upload';
import APIImage from '../Common/APIImage';
import makeStyles from '@material-ui/styles/makeStyles';
import { deleteImage } from '../actions';

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

const PhotoUpload = ({ onUpload, images: uploadedImages, onDeleteImage }) => {
    const [images, setImages] = useState([]);
    const classes = useStyles();
    const dispatch = useDispatch();
    const deleteImage2 = image => {
        dispatch(deleteImage(image));
        onDeleteImage(image);
    };
    return (
        <div className={classes.root}>
            <div className={classes.uploader}>
                <Upload
                    allowMultiple={true}
                    onUpdate={setImages}
                    files={[]}
                    onFinished={() => onUpload(images.map(file => file.serverId))}
                    acceptedFileTypes={['image/*']}
                />
            </div>
            <div className={classes.images}>
                {uploadedImages.map(image => (
                    <div className={classes.imageWrapper} key={image}>
                        <APIImage src={image} className={classes.image} />
                        <Fab className={classes.button} size="small" onClick={() => deleteImage2(image)}>
                            <DeleteIcon />
                        </Fab>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoUpload;
