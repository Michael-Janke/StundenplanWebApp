import React from 'react';
import Post from './Common/Post';
import { IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Edit';

function PostWrapper({ POST_ID, IMAGES, CREATOR, TITLE, TEXT, onEdit }) {
    const content = React.useMemo(() => JSON.parse(TEXT), [TEXT]);

    if (onEdit) {
        var buttons = (
            <IconButton onClick={() => onEdit(POST_ID)}>
                <SettingsIcon />
            </IconButton>
        );
    }

    return <Post images={IMAGES} upn={CREATOR} title={TITLE} content={content} buttons={buttons} edit={false} />;
}

export default PostWrapper;
