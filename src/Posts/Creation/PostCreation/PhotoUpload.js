import React, { useState } from 'react';
import withStyles from '@material-ui/styles/withStyles';
import Button from '@material-ui/core/Button';
import Upload from '../../Common/Upload';
import APIImage from '../../Common/APIImage';

import { connect } from 'react-redux';

const styles = {
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
};
const PhotoUpload = ({ classes, images: initalImage, onUpload }) => {

    const [file, setFile] = useState(null);
    const [finished, setFinished] = useState(!!initalImage[0]);
    const image = finished && (file ? file.serverId : initalImage[0]);

    return (
        <div className={classes.root}>
            {!image && (
                <div className={classes.uploader}>
                    <Upload
                        allowMultiple={false}
                        onUpdate={files => setFile(files[0])}
                        onFinished={() => setFinished(true)}
                        acceptedFileTypes={['image/*']}
                    />
                </div>
            )}
            {image && (
                <>
                    <APIImage src={image} className={classes.preview} />
                    <Button onClick={() => onUpload(image)} size={'large'} variant={'contained'}>
                        Verwenden
                    </Button>
                    <Button onClick={() => setFinished(false)}>Anderes Bild hochladen</Button>
                </>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    images: state.postcreation.images,
})

const mapDispatchToProps = dispatch => ({
    onUpload: imgSrc => dispatch({ type: 'SET_IMAGE', payload: imgSrc })
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PhotoUpload));
