const nextStep = (oldStep, diff) => Math.max(0, Math.min(oldStep + diff, 5));

const initialState = {
    title: 'Titel hier eingeben',
    content: null,
    photoMode: null,
    image: null,
    step: 0,
}

function postCreationReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_TITLE":
            return { ...state, title: action.payload };
        case "SET_CONTENT":
            return { ...state, content: action.payload };
        case "SET_PHOTO_MODE":
            return { ...state, photoMode: action.payload, step: nextStep(state.step, 1 + (action.payload === 'no')) };
        case "SET_IMAGE":
            return { ...state, image: action.payload, step: nextStep(state.step, 1) };
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