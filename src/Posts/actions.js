
export function addPost(post) {
    return { type: "ADD_POST", payload: post };
}

export function editPost(post) {
    return { type: "EDIT_POST", payload: post };
}

export function getPosts() {
    return { type: "GET_POSTS" };
}

export function deletePost(post) {
    return { type: "DELETE_POST", payload: post };
}