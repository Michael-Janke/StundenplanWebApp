import React from 'react';

import Popper from '@material-ui/core/Popper';
import { withStyles, RootRef, ClickAwayListener, Collapse } from '@material-ui/core';
import Lesson from './Lesson';

const styles = theme => ({
    popper: {
        zIndex: theme.zIndex.modal - 1,
        top: 64,
        maxWidth: 'calc(100vw - 64px)',
    },
    paper: {
        minWidth: 125,
        maxWidth: 300,
        maxHeight: 500,
        overflowY: 'auto',
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[20],
    },
});

class ExpandPopover extends React.PureComponent {
    state = { open: false };

    onRootRef = ref => {
        this.childrenRef = ref;
    };

    componentWillUnmount() {
        clearTimeout(this.leaveTimer);
    }

    handleMouseEnter = () => {
        clearTimeout(this.leaveTimer);
    };

    handleMouseLeave = () => {
        clearTimeout(this.leaveTimer);
        // this.leaveTimer = setTimeout(this.handleClose, 1000);
    };

    handleToggle = () => {
        clearTimeout(this.leaveTimer);
        this.props.onToggle();
    };

    handleClose = () => {
        this.props.onToggle(false);
    };

    handleClickAway = e => {
        if (!this.childrenRef.contains(e.target)) {
            // workaround for toggling
            this.handleClose();
        }
    };

    render() {
        const { classes, open } = this.props;
        const id = open ? 'simple-popper' : null;
        const childrenProps = {
            onMouseLeave: this.handleMouseLeave,
            onMouseEnter: this.handleMouseEnter,
        };
        return (
            <React.Fragment>
                <RootRef rootRef={this.onRootRef}>{this.props.renderContent(childrenProps)}</RootRef>
                <Popper
                    id={id}
                    open={open}
                    anchorEl={this.childrenRef}
                    transition
                    className={classes.popper}
                    popperOptions={{
                        modifiers: {
                            preventOverflow: {
                                boundariesElement: document.querySelector('#content-root'),
                            },
                        },
                    }}
                    onMouseLeave={this.handleMouseLeave}
                    onMouseEnter={this.handleMouseEnter}
                >
                    {({ TransitionProps }) => (
                        <ClickAwayListener onClickAway={this.handleClickAway}>
                            <Lesson className={classes.paper}>
                                <Collapse {...TransitionProps} appear>
                                    {this.props.children}
                                </Collapse>
                            </Lesson>
                        </ClickAwayListener>
                    )}
                </Popper>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ExpandPopover);
