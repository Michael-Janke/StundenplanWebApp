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
                .filter(post =>
                    post.USER_CREATED
                    || moment().isBetween(
                        moment(post.DATE_FROM.date),
                        moment(post.DATE_TO.date),
                        'days',
                        '[]'
                    ))
                // accept user_created
                // check if post needs to be displayed
                // important: this is calculated if posts reference changes and on reloading page
                //             -> when post is "expiring" post is shown until page gets reloaded
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