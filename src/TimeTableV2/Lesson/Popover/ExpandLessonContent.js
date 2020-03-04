import { List, makeStyles, Divider } from '@material-ui/core';
import React from 'react';
import LessonInformation from './LessonInformation';
import Teams from './Teams';
import Assignments from './Assignment/Assignments';


const useStyles = makeStyles(
    theme => ({
        root: {
            overflow: 'auto',
        },
    }),
    { name: 'ExpandLessonContent' }
);

export default function ExpandLessonContent({ lesson }) {
    const { teams, assignments } = lesson;
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <List>
                <LessonInformation lesson={lesson}></LessonInformation>
            </List>
            {!!teams.length &&
                <>
                    <Divider></Divider>
                    <List>
                        <Teams lesson={lesson}></Teams>
                    </List>
                </>
            }
            {!!assignments.length &&
                <>
                    <Divider></Divider>
                    <List>
                        <Assignments assignments={assignments} />
                    </List>
                </>
            }
        </div>

    );
}
