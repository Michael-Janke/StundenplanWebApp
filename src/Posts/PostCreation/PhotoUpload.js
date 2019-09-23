import React, { useState } from 'react';
import withStyles from '@material-ui/styles/withStyles';
import Button from '@material-ui/core/Button';
import Upload from '../Common/Upload';
import APIImage from '../Common/APIImage';

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
const PhotoUpload = ({ onUpload, image: initalImage, classes }) => {
    const [file, setFile] = useState(null);
    const [finished, setFinished] = useState(!!initalImage);
    const image = finished && (file ? file.serverId : initalImage);

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

export default withStyles(styles)(PhotoUpload);
