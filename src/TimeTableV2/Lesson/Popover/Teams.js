import React from 'react';
import { ListSubheader } from '@material-ui/core';
import OfficeLink from './Office/OfficeLink';
import AddAssignment from './Assignment/AddAssignment';
import useIsScope from '../useIsScope';


export default function Teams({ lesson, type }) {

    const { teams, date } = lesson;
    const isTeacher = useIsScope('teacher');

    return (<>
        {teams.map(team => (
            <React.Fragment key={team.id}>
                <ListSubheader component="div">{team.displayName}</ListSubheader>
                <OfficeLink id={team.id} type="teams" />
                <OfficeLink id={team.id} type="notebook" />
                {isTeacher && <AddAssignment team={team} date={date} />}
            </React.Fragment>
        ))}
    </>);
}