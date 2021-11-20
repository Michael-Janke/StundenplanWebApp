import React from 'react';
import { useAccesses } from './api';
import { VersionSelection } from './VersionSelection';
import classes from './Access.module.css';

export const Access: React.FC<{}> = () => {
    const { data: accesses = [] } = useAccesses();

    return (
        <div className={classes.root}>
            {accesses.map((access) => (
                <div className={classes.row}>
                    {access.ROLE.toLocaleLowerCase()}
                    <VersionSelection access={access} />
                </div>
            ))}
        </div>
    );
};
