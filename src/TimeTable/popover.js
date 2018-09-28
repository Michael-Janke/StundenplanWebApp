import React from 'react';

import Popper from '@material-ui/core/Popper';
import { Fade, Paper, Typography, withStyles, Zoom, RootRef, Grow, ClickAwayListener } from '@material-ui/core';

const styles = theme => ({
    popper: {
        zIndex: theme.zIndex.modal - 1,
    },
    paper: {
        marginTop: theme.spacing.unit,
        padding: theme.spacing.unit,
        width: 250,
    }
});


class Popover extends React.Component {

    state = { open: false };

    onRootRef = (ref) => {
        this.childrenRef = ref;
    }

    componentWillUnmount() {
        clearTimeout(this.leaveTimer);
    }

    handleMouseEnter = () => {
        clearTimeout(this.leaveTimer);
    }

    handleMouseLeave = () => {
        clearTimeout(this.leaveTimer);
        this.leaveTimer = setTimeout(this.handleClose, 500);
    }

    handleToggle = () => {
        clearTimeout(this.leaveTimer);
        this.setState(state => ({ open: !state.open }));
    }

    handleOpen = () => {
        this.setState({
            open: true,
        })
    }

    handleClose = () => {
        this.setState({
            open: false,
        });
    }

    handleClickAway = (e) => {
        if (!this.childrenRef.contains(e.target)) {
            // workaround for toggling
            this.handleClose();
        }
    }


    render() {
        const { classes, active } = this.props;
        if (!active) {
            return this.props.children[0]({}, () => { });
        }
        const { open } = this.state;
        const id = open ? 'simple-popper' : null;
        const childrenProps = {
            onMouseLeave: this.handleMouseLeave,
            onMouseEnter: this.handleMouseEnter,
        }

        return (
            <React.Fragment>
                <RootRef rootRef={this.onRootRef}>
                    {this.props.children[0](childrenProps, this.handleToggle)}
                </RootRef>
                <Popper
                    id={id}
                    open={open}
                    anchorEl={this.childrenRef}
                    transition
                    className={classes.popper}
                    onMouseLeave={this.handleMouseLeave}
                    onMouseEnter={this.handleMouseEnter}
                >
                    {({ TransitionProps }) => (
                        <ClickAwayListener onClickAway={this.handleClickAway}>
                            <Grow {...TransitionProps} timeout={350} style={{ transformOrigin: '50% 0 0' }}>
                                <Paper className={classes.paper} elevation={4}>
                                    {this.props.children[1]}
                                </Paper>
                            </Grow>
                        </ClickAwayListener>
                    )}
                </Popper>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Popover);