import { createTransform } from 'redux-persist';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

const EditorStateTransform = createTransform(
    (state) => {

        let newState = Object.assign({},
            ...Object.entries(state)
                .map(([key, entry]) => {

                    if (entry instanceof EditorState) {
                        entry = {
                            type: 'EditorState',
                            raw: JSON.stringify(
                                convertToRaw(
                                    entry.getCurrentContent()
                                )
                            )
                        }
                    }
                    return { [key]: entry };
                })
        )
        return newState;
    },
    (state) => {
        const newState = Object.assign({},
            ...Object.entries(state)
                .map(([key, entry]) => {
                    if (entry && entry.type && entry.type === 'EditorState') {
                        entry = EditorState.createWithContent(convertFromRaw(JSON.parse(entry.raw)));
                    }
                    return { [key]: entry };
                })
        )
        return newState;
    },
    {
    }
)

export default EditorStateTransform;