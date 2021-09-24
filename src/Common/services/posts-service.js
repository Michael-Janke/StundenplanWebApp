import { requestApiGenerator, API_URL } from './generator';

const PostsService = (store) => (next) => (action) => {
    next(action);
    switch (action.type) {
        case 'GET_POSTS': {
            return requestApiGenerator(next)(API_URL, 'posts/', { type: 'GET_POSTS' });
        }
        case 'ADD_POST':
            return requestApiGenerator(next)(
                API_URL,
                'posts/',
                { type: 'ADD_POST' },
                'POST',
                JSON.stringify(action.payload)
            );
        case 'DELETE_POST':
            return requestApiGenerator(next)(
                API_URL,
                'posts/' + action.payload.POST_ID,
                { type: 'DELETE_POST', request: action.payload },
                'DELETE'
            );
        case 'DELETE_IMAGE': {
            const filename = action.payload.substring(action.payload.lastIndexOf('/') + 1);
            return requestApiGenerator(next)(API_URL, 'upload/' + filename, { type: 'DELETE_IMAGE' }, 'DELETE');
        }
        case 'EDIT_POST': {
            return requestApiGenerator(next)(
                API_URL,
                'posts/' + action.payload.POST_ID,
                { type: 'EDIT_POST' },
                'PATCH',
                JSON.stringify(action.payload)
            );
        }
        default:
    }
};

export default PostsService;
