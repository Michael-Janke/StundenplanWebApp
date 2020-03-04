import React from 'react';
import { ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import { ObjectIcon } from '../../../Main/components/Avatars';
import SubstitutionText from '../Fields/SubstitutionText';
import Subject from '../Fields/Subject';
import Teachers from '../Fields/Teachers';
import Classes from '../Fields/Classes';
import Room from '../Fields/Room';

function FieldItem({type, upn, children}) {
    function onClick() {

    }
    return (
        <ListItem button={!!onClick} onClick={onClick}>
            <ListItemIcon>
                <ObjectIcon size={24} fontSize={'default'} type={type} upn={upn} />
            </ListItemIcon>
            <ListItemText primary={children} />
        </ListItem>
    )
}


export default function LessonInformation({ lesson }) {
    const { substitutionText, specificSubstitutionType, subject, lessonType, teachers, room, classes } = lesson;

    return (
        <>
            <ListSubheader >
                <SubstitutionText substitutionText={substitutionText} specificSubstitutionType={specificSubstitutionType}>
                </SubstitutionText>
            </ListSubheader>
            <FieldItem type="subject">
                <Subject subject={subject} type={lessonType}></Subject>
            </FieldItem>
            <FieldItem type="teacher">
                <Teachers teachers={teachers} type={lessonType}></Teachers>
            </FieldItem>
            <FieldItem type="classes">
                <Classes classes={classes} type={lessonType}></Classes>
            </FieldItem>
            <FieldItem type="room">
                <Room room={room} type={lessonType}></Room>
            </FieldItem>
        </>
    );
}