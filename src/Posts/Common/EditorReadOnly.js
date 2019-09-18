import React from 'react';
import Editor from 'draft-js-plugins-editor';

import 'draft-js/dist/Draft.css';
import editorStyles from './editorStyles.module.css';

const ReadOnlyEditor = ({ content }) => (
    <div className={editorStyles.editor}>
        <Editor editorState={content} readOnly={true} />
    </div>
);

export default ReadOnlyEditor;
