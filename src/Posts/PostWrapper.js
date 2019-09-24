import React from 'react';
import Post from './Common/Post';
import { toEditorState } from './Common/EditorStateTransform';

function PostWrapper({ IMAGE, CREATOR, TITLE, TEXT }) {
    const content = React.useMemo(() => (
        toEditorState(JSON.parse(TEXT))
    ), [TEXT]);

    return (
        <Post
            images={IMAGE}
            upn={CREATOR}
            title={TITLE}
            content={content}
            edit={false} />
    )
}

export default PostWrapper;