import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(
    theme => ({
        class: {
            fontSize: theme.typography.pxToRem(12),
        },
    }),
    { name: 'Classes' }
);

function joinClasses(classes) {
    let strBuilder = '';
    if (!classes) {
        return strBuilder;
    }
    let c = classes.map(cl => cl.NAME).join();

    let regex = /(\d+|[a-z]+)([a-z]+|\d+)/g;

    let match = regex.exec(c);
    strBuilder += match[1] + match[2];
    while (true) {
        let newMatch = regex.exec(c);
        if (!newMatch) {
            break;
        }
        if (match[1] !== newMatch[1]) {
            strBuilder += newMatch[1];
        }
        if (match[2] !== newMatch[2]) {
            strBuilder += newMatch[2];
        }

        match = newMatch;
    }
    return strBuilder;
}

const Classes = ({ type, classes }) => {
    const themeClasses = useStyles();

    let field;
    if (type === 'new') {
        field = classes.new;
    }
    if (type === 'old') {
        field = classes.old;
    }
    if (type === 'instead-of' || type === 'instead-by') {
        field = classes.substitution;
    }
    return <div className={themeClasses.class}>{joinClasses(field)}</div>;
};

Classes.propTypes = {
    classes: PropTypes.object,
    small: PropTypes.bool,
};

export default Classes;
