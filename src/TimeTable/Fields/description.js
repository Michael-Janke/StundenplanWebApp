import React from 'react';

import grey from '@material-ui/core/colors/grey';

function Description({ classes, label, children }) {
    return (
        <div className={classes.description}>
            <div className={classes.label}>{label}</div>
            <div>{children}</div>
        </div>
    )
}

export const descriptionStyles = (theme) => ({
    description: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: `${theme.spacing.unit / 2}px 0`,
    },
    label: {
        fontSize: '70%',
        color: grey[600],
    }
})

export default Description;
