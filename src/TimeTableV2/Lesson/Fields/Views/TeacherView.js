import React from 'react';
import Subject from '../Subject';
import Room from '../Room';
import SubstitutionText from '../SubstitutionText';
import Classes from '../Classes';

export default function TeacherView(lesson) {
    const { subject, room, classes, lessonType, substitutionText, specificSubstitutionType } = lesson;

    if (lessonType === 'old') {
        return {
            left: (
                <>
                    <SubstitutionText
                        substitutionText={substitutionText}
                        specificSubstitutionType={specificSubstitutionType}
                    ></SubstitutionText>
                </>
            ),
            right: (
                <>
                    <Subject subject={subject} type={lessonType}></Subject>
                    <Classes classes={classes} type={lessonType}></Classes>
                </>
            ),
        };
    }

    return {
        left: (
            <>
                <SubstitutionText
                    substitutionText={substitutionText}
                    specificSubstitutionType={specificSubstitutionType}
                ></SubstitutionText>
                <Subject subject={subject} type={lessonType}></Subject>
            </>
        ),
        right: (
            <>
                <Classes classes={classes} type={lessonType}></Classes>
                <Room room={room} type={lessonType}></Room>
            </>
        ),
    };
}