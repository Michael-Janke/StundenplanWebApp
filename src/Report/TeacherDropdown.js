import React from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function Teacher({ value, onChange, disabled }) {
    const teacher = useSelector(state => state.timetable.masterdata.Teacher) || {};
    return (
        <Select value={value} onChange={onChange} disabled={disabled}>
            {Object.values(teacher)
                .sort((a, b) => a.LASTNAME.localeCompare(b.LASTNAME))
                .map(t => (
                    <MenuItem key={t.TEACHER_ID} value={t.TEACHER_ID}>
                        {t.LASTNAME}, {t.FIRSTNAME}
                    </MenuItem>
                ))}
        </Select>
    );
}

export default Teacher;
