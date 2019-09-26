import React from 'react';
import Post from './Common/Post';
import { IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Edit';
import Diashow from './Common/Diashow';

function PostWrapper({ POST_ID, IMAGES, CREATOR, TITLE, TEXT, onEdit, TYPE }) {
    const content = React.useMemo(() => JSON.parse(TEXT), [TEXT]);

    if (onEdit) {
        var buttons = (
            <IconButton onClick={() => onEdit(POST_ID)}>
                <SettingsIcon />
            </IconButton>
        );
    }

    const Component = {
        'diashow': Diashow,
        'post': Post,
    }[TYPE];

    return <Component images={IMAGES} upn={CREATOR} title={TITLE} content={content} buttons={buttons} edit={false} />;
}

export default PostWrapper;
