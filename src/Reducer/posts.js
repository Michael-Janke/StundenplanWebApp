export default function postsReducer(state = {}, action) {
    switch (action.type) {
        case 'persist/REHYDRATE':
            if (!action.payload || !action.payload.posts) return { ...state };
            return {
                ...state,
                ...action.payload.posts,
            };
        case 'ADD_POST_RECEIVED':
            return {
                ...state,
                posts: [...state.posts, action.payload],
            };
        case 'DELETE_POST_RECEIVED':
            return {
                ...state,
                posts: [...(state.posts || []).filter(post => post.POST_ID !== action.request.POST_ID)],
            };
        case 'EDIT_POST_RECEIVED':
            return {
                ...state,
                posts: [...(state.posts || []).filter(post => post.POST_ID !== action.payload.POST_ID), action.payload],
            };
        case 'GET_POSTS_RECEIVED':
            return {
                ...state,
                posts: action.payload,
            };
        default:
    }
    return state;
}
