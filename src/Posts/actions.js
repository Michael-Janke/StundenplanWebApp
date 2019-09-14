export function addPost(post) {
    return { type: 'ADD_POST', payload: post };
}

export function editPost(post) {
    return { type: 'EDIT_POST', payload: post };
}

export function getDayInfo() {
    return { type: 'GET_DAY_INFO' };
}
export function getTransportInfo() {
    return { type: 'GET_TRANSPORT_INFO' };
}

export function getPosts() {
    return { type: 'GET_POSTS' };
}

export function deletePost(post) {
    return { type: 'DELETE_POST', payload: post };
}
