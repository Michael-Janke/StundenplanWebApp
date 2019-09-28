import React from 'react';
import Post from './Common/Post';
import { IconButton, Tooltip } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Diashow from './Common/Diashow';

function PostWrapper({ onEdit, onDelete, post, noButtons }) {
    const { IMAGES, CREATOR, TITLE, TEXT, TYPE } = post;
    const content = React.useMemo(() => JSON.parse(TEXT), [TEXT]);

    if (onEdit) {
        var buttons = (
            <>
                <Tooltip title="Beitrag editieren">
                    <IconButton onClick={() => onEdit(post)}>
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Beitrag löschen">
                    <IconButton onClick={event => onDelete(post, event.target)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </>
        );
    }

    const Component = {
        diashow: Diashow,
        post: Post,
    }[TYPE];

    return (
        <Component
            images={IMAGES}
            upn={CREATOR}
            title={TITLE}
            content={content}
            buttons={buttons}
            edit={false}
            noButtons={noButtons}
        />
    );
}

export default PostWrapper;
