import React, { Component } from 'react'
import Post from '../post';
import { Typography, withStyles, DialogActions, Button } from '@material-ui/core';

const styles = theme => ({

});

class Finalize extends Component {

    state = {};

    static getDerivedStateFromProps(props, state) {
        if (props.post !== state.prevPost && props.post.TEXT) {
            return {
                prevPost: props.post,
                post: {
                    ...props.post,
                    CREATOR: "",
                }
            }
        }
        return {};
    }
    componentDidMount() {
        this.props.handleNextFunction(this.handleNext)
    }


    handleNext = () => {
        return this.props.post;
    }

    render() {
        const { post } = this.props;
        if (!this.state.post) {
            return null;
        }
        return (
            <>
                <Typography>Bist du sicher?</Typography>
                <Post post={this.state.post}></Post>
                <DialogActions>
                    <Button
                        onClick={this.handleStep}
                    >
                        {post.TYPE} bearbeiten
                    </Button>
                </DialogActions>
            </>
        )
    }
}
export default withStyles(styles)(Finalize);