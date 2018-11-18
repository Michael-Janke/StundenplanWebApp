import React from 'react';
import {  CSSTransition } from 'react-transition-group';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    root: {
        transition: theme.transitions.create(['opacity', 'max-width']),
        maxWidth: 0,
        opacity: 0,
    },
    enter: { opacity: 0, maxWidth: 0 },
    enterDone: { opacity: 1, maxWidth: '100%' },
    exitActive: { opacity: .2, maxWidth: 0 },
    exit: { opacity: 0, maxWidth: 0 },
})

const CollapseVertical = ({ children, in: inProp, classes }) => {
    return (
        <CSSTransition in={inProp} timeout={500} classNames={classes} className={classes.root}>
            <div>
                {children}
            </div>
        </CSSTransition>
    );
};

export default withStyles(styles)(CollapseVertical);