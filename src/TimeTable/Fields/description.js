import React from 'react';

import { ObjectIcon } from '../../Main/components/Avatars';

function Description({ classes, label, children, type }) {
    return (
        <div className={classes.description}>
            <div className={classes.label}>
                <ObjectIcon type={type} />
            </div>
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
        fontSize: '60%',
        color: theme.palette.text.secondary,
        fontWeight: 600,
    }
})

export default Description;
