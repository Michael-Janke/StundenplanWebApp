import { createSelector } from 'reselect';
import moment from 'moment';

export default function makeGetPosts() {
    const getPosts = (state) => state.posts.posts;

    return createSelector(
        getPosts,
        (posts) => {
            if (!posts) {
                return {
                    posts: [],
                    hasPosts: false,
                }
            }
            const newPosts = posts
                .sort((post1, post2) =>
                    (post2.USER_CREATED - post1.USER_CREATED)
                    || moment(post2.DATE_FROM.date).diff(post1.DATE_FROM.date)
                )
            // user posts first
            // then newest posts based on DATE_FROM

            return { posts: newPosts, hasPosts: !!posts.length };
        }
    )
}