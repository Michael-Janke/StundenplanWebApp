import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';

const styles = (theme) => ({
    root: {
        transition: theme.transitions.create(['opacity', 'max-width']),
        maxWidth: 0,
        opacity: 0,
    },
    appear: { opacity: 1, maxWidth: '100%' },
    appearActive: { opacity: 1, maxWidth: '100%' },
    enter: { opacity: 1, maxWidth: '100%' },
    enterDone: { opacity: 1, maxWidth: '100%' },
    exitActive: { opacity: 0.2, maxWidth: 0 },
    exit: { opacity: 0, maxWidth: 0 },
});

const CollapseVertical = ({ children, in: inProp, classes, className }) => {
    return (
        <CSSTransition
            appear
            in={inProp}
            timeout={500}
            classNames={classes}
            className={classNames(classes.root, className)}
        >
            <div>{children}</div>
        </CSSTransition>
    );
};

export default withStyles(styles)(CollapseVertical);
