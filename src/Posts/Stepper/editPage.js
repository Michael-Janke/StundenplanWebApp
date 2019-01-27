import React, { Component } from 'react'
import { connect } from 'react-redux';
import Stepper from './stepper';
import { withRouter } from "react-router";
import { addPost, editPost, getPosts } from '../actions';

class EditPage extends Component {

    componentDidUpdate(prevProps) {
        // determine if page got edited or added
        if (this.props.post !== prevProps.post
            || this.props.posts !== prevProps.posts) {
            this.props.history.goBack();
        }
    }

    handleClose = (post) => {
        // close
        
        if (!post) {
            return;
        }
        if (post.POST_ID) {
            this.props.editPost(post);
        } else {
            this.props.addPost(post);
        }
    }

    render() {
        return (
            <Stepper
                onClose={this.handleClose}
                post={this.props.post}
            />
        )
    }
}

const findPost = (posts, match) => {
    const id = match.params.id;
    if (id === 'new') {
        return null;
    }
    return posts.find((post) => post.POST_ID === Number(id));
}

const mapStateToProps = (state, props) => ({
    post: findPost(state.posts.posts, props.match),
    posts: state.posts.posts.length
});

const mapDispatchToProps = dispatch => ({
    getPosts: () => dispatch(getPosts()),
    addPost: (post) => dispatch(addPost(post)),
    editPost: (post) => dispatch(editPost(post)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPage));