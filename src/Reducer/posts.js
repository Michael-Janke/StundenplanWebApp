export default function postsReducer(state = {}, action) {
    switch (action.type) {
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
                currentHash: state.availableHash,
                loading: false,
            };
        case 'GET_POSTS':
            return {
                ...state,
                loading: true,
            }
        case 'GET_POSTS_ERROR':
            return {
                ...state,
                loading: false,
            }
        case 'COUNTER_RECEIVED':
            return {
                ...state,
                availableHash: action.payload.POSTS_HASH,
            };
        default:
    }
    return state;
}
