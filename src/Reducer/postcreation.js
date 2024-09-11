const nextStep = (oldStep, diff) => Math.max(0, Math.min(oldStep + diff, 5));

const initialState = {
    title: 'Titel hier eingeben',
    content: null,
    photoMode: null,
    images: [],
    step: 0,
    type: null,
    viewPublic: true,
    viewStudent: true,
    viewTeacher: true,
};

function postCreationReducer(state = initialState, action) {
    switch (action.type) {
        case 'START_POST_CREATION': {
            const post = action.payload;
            if (post && post.POST_ID) {
                return {
                    ...initialState,
                    type: post.TYPE,
                    POST_ID: post.POST_ID,
                    content: JSON.parse(post.TEXT),
                    dateTo: post.DATE_TO.date,
                    dateFrom: post.DATE_FROM.date,
                    title: post.TITLE,
                    images: post.IMAGES,
                    viewPublic: post.VIEW_PUBLIC,
                    viewStudent: post.VIEW_STUDENT,
                    viewTeacher: post.VIEW_TEACHER,
                    photoMode: (post.IMAGES[0] || "").includes("/upload/") ? "upload" : post.IMAGES[0] ? "stock" : "no",
                    step: 2,
                }
            } else {
                return { ...initialState, type: action.payload };
            }
        }
        case 'END_POST_CREATION':
            return { ...initialState, step: state.step };
        case 'ADD_POST':
        case 'EDIT_POST':
            return { ...state, saved: undefined };
        case 'ADD_POST_RECEIVED':
        case 'EDIT_POST_RECEIVED':
            return { ...state, saved: action.payload.POST_ID };
        case 'ADD_POST_ERROR':
        case 'EDIT_POST_ERROR':
            return { ...state, saved: false };
        case 'SET_FROM_DATE':
            return { ...state, dateFrom: action.payload };
        case 'SET_TO_DATE':
            return { ...state, dateTo: action.payload };
        case 'SET_TITLE':
            return { ...state, title: action.payload };
        case 'SET_CONTENT':
            return { ...state, content: action.payload };
        case 'SET_PHOTO_MODE':
            return { ...state, photoMode: action.payload, images: action.payload === "no" ? [] : state.images, step: nextStep(state.step, 1) };
        case 'SET_IMAGE':
            return { ...state, images: [action.payload], step: nextStep(state.step, 1) };
        case 'SET_IMAGES':
            return { ...state, images: [...state.images, ...action.payload] };
        case 'ADD_IMAGE':
            return { ...state, images: [...state.images, action.payload] };
        case 'DELETE_IMAGE':
            return { ...state, images: state.images.filter((image) => image !== action.payload) };
        case 'TOGGLE_VIEW_FIELD': {
            return { ...state, [action.payload.key]: action.payload.value };
        }
        case 'SET_STEP':
            return { ...state, step: nextStep(action.payload, 0) };
        case 'NEXT':
            return { ...state, step: nextStep(state.step, 1) };
        case 'PREV':
            return { ...state, step: nextStep(state.step, -1) };
        default:
            // auto-merge only merges when state didn't change
            return state;
    }
}

export default postCreationReducer;
