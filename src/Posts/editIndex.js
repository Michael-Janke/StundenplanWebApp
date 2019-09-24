import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PostCreation from './PostCreation';
import DiashowCreation from './DiashowCreation';

function EditPage({ post, match, startPostCreation }) {

    let { type, id } = match.params;
    type = type || (post && post.TYPE);

    // start post creation depending on post or type
    React.useEffect(() => {
        startPostCreation(post || type);
    }, [post, startPostCreation, type])

    const Component = {
        "post": PostCreation,
        "diashow": DiashowCreation,
    }[type]
    if (!Component) {
        if (id) {
            throw new Error("post with id " + id + " doesnt exist");
        } else {
            throw new Error("type " + type + " not found");
        }
    }
    return <Component post={post} />;

}

const findPost = (posts, match) => {
    const id = match.params.id;
    return posts.find(post => post.POST_ID === Number(id));
};

const mapStateToProps = (state, props) => ({
    post: findPost(state.posts.posts, props.match),
    posts: state.posts.posts.length,
    type: state.postcreation.type,
});

const mapDispatchToProps = dispatch => ({
    startPostCreation: (post) => dispatch({ type: 'START_POST_CREATION', payload: post })
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(EditPage)
);