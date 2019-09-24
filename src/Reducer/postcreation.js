import { toEditorState } from "../Posts/Common/EditorStateTransform";

const nextStep = (oldStep, diff) => Math.max(0, Math.min(oldStep + diff, 5));

const initialState = {
    title: 'Titel hier eingeben',
    content: null,
    photoMode: null,
    images: [],
    step: 0,
    type: null,
}

function postCreationReducer(state = initialState, action) {
    switch (action.type) {
        case "START_POST_CREATION": {
            const post = action.payload;
            if (post && post.POST_ID) {
                if (post.POST_ID !== state.POST_ID) {
                    return {
                        ...initialState, 
                        type: post.TYPE,
                        POST_ID: post.POST_ID,
                        content: toEditorState(post.TEXT),
                        title: post.TITLE,
                        images: post.IMAGES,
                        
                    };
                }
            } else {
                const newType = action.payload;
                const type = state.type;
                if (newType !== type || state.POST_ID) {
                    // new draft
                    return { ...initialState, type: newType };
                }
            }
            return state;
        }
        case "SET_TITLE":
            return { ...state, title: action.payload };
        case "SET_CONTENT":
            return { ...state, content: action.payload };
        case "SET_PHOTO_MODE":
            return { ...state, photoMode: action.payload, step: nextStep(state.step, 1) };
        case "SET_IMAGE":
            return { ...state, images: [action.payload], step: nextStep(state.step, 1) };
        case "ADD_IMAGE":
            return { ...state, images: [...state.images, action.payload] };
        case "REMOVE_IMAGE":
            return { ...state, images: state.images.filter(image => image !== action.payload) }
        case "SET_STEP":
            return { ...state, step: nextStep(action.payload, 0) };
        case "NEXT":
            return { ...state, step: nextStep(state.step, 1) };
        case "PREV":
            return { ...state, step: nextStep(state.step, -1) };
        default:
            // auto-merge only merges when state didn't change
            return state;
    }
}

export default postCreationReducer;