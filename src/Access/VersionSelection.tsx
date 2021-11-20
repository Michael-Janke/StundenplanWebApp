import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Access, useSetAccess, useVersions } from './api';

type VersionSelectionProps = {
    access: Access;
};

export const VersionSelection: React.FC<VersionSelectionProps> = ({ access }) => {
    const { data: versions = [], isValidating } = useVersions();
    const [setAccess, { status }] = useSetAccess();
    return (
        <Select
            value={access.VERSION}
            disabled={isValidating || status === 'running'}
            onChange={({ target }) => setAccess({ ...access, VERSION: target.value as number })}
        >
            {versions
                .sort((a, b) => a.VERSION - b.VERSION)
                .map((version) => (
                    <MenuItem key={version.VERSION} value={version.VERSION}>
                        {version.SCHOOLYEAR_ID} {version.VERSION_ID}
                    </MenuItem>
                ))}
        </Select>
    );
};
