import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Upload from './Upload';
import APIImage from './APIImage';

const PhotoUpload = ({ onUpload }) => {
    const [file, setFile] = useState(null);
    const [finished, setFinished] = useState(false);

    return (
        <div>
            <Upload
                allowMultiple={false}
                onUpdate={files => setFile(files[0])}
                onFinished={() => setFinished(true)}
                acceptedFileTypes={['image/*']}
            />
            {file && <APIImage src={file.serverId} />}
            {finished && <Button onClick={() => onUpload(file.serverId)}>Weiter </Button>}
        </div>
    );
};

export default PhotoUpload;
