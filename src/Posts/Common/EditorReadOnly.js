import React from 'react';
import Editor from 'draft-js-plugins-editor';
import { convertFromRaw } from 'draft-js';

import 'draft-js/dist/Draft.css';
import editorStyles from './editorStyles.module.css';
import { createWithContent } from './EditorPlugins';

const ReadOnlyEditor = ({ content }) => {
    const editorState = React.useMemo(() => content && createWithContent(convertFromRaw(content)), [content]);

    return (
        <div className={editorStyles.editor}>
            {editorState && <Editor editorState={editorState} readOnly={true} />}
        </div>
    );
};

export default ReadOnlyEditor;
