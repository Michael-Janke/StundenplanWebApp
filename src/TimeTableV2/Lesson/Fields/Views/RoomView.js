import React from 'react';
import Subject from '../Subject';
import SubstitutionText from '../SubstitutionText';
import Classes from '../Classes';
import Teachers from '../Teachers';

export default function RoomView(lesson) {
    const { subject, teachers, classes, lessonType, substitutionText, specificSubstitutionType } = lesson;

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
                <Teachers teachers={teachers} type={lessonType}></Teachers>
            </>
        ),
    };
}