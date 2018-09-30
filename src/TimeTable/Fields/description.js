import React from 'react';

import { ObjectIcon } from '../../Main/components/Avatars';

function Description({ classes, label, children, type }) {
    return (
        <div className={classes.description}>
            <div className={classes.label}>
                <ObjectIcon size={0} fontSize="inherit" type={type} />
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
    },
    label: {
        fontSize: '100%',
        color: theme.palette.text.secondary,
        fontWeight: 600,
    }
})

export default Description;
