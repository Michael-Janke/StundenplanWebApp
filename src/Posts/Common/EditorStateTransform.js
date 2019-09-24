import { createTransform } from 'redux-persist';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

export const toObject = (editorState) => {
    if (editorState instanceof EditorState) {
        return {
            type: 'EditorState',
            raw: JSON.stringify(
                convertToRaw(
                    editorState.getCurrentContent()
                )
            )
        };
    }
    return editorState;
}

export const toEditorState = (object) => {
    if (object && object.type && object.type === 'EditorState') {
        return EditorState.createWithContent(convertFromRaw(JSON.parse(object.raw)));
    }
    return object;
}

const EditorStateTransform = createTransform(
    (state) => {

        let newState = Object.assign({},
            ...Object.entries(state)
                .map(([key, entry]) => {
                    entry = toObject(entry);
                    return { [key]: entry };
                })
        )
        return newState;
    },
    (state) => {
        const newState = Object.assign({},
            ...Object.entries(state)
                .map(([key, entry]) => {
                    entry = toEditorState(entry);
                    return { [key]: entry };
                })
        )
        return newState;
    },
    {
    }
)

export default EditorStateTransform;