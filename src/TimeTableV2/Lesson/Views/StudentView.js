import React from 'react';
import Subject from '../Fields/Subject';
import Room from '../Fields/Room';
import Teachers from '../Fields/Teachers';
import SubstitutionText from '../Fields/SubstitutionText';

export default function StudentView(lesson) {
    const { subject, room, teachers, lessonType, substitutionText, specificSubstitutionType } = lesson;

    if (lessonType === 'old') {
        return {
            left:
                <>
                    <SubstitutionText substitutionText={substitutionText} specificSubstitutionType={specificSubstitutionType}></SubstitutionText>
                </>,
            right:
                <>
                    <Subject subject={subject} type={lessonType}></Subject>
                    <Teachers teachers={teachers} type={lessonType}></Teachers>
                </>
        }
    }

    return {
        left:
            <>
                <SubstitutionText substitutionText={substitutionText} specificSubstitutionType={specificSubstitutionType}></SubstitutionText>
                <Subject subject={subject} type={lessonType}></Subject>
            </>,
        right:
            <>
                <Room room={room} type={lessonType}></Room>
                <Teachers teachers={teachers} type={lessonType}></Teachers>
            </>
    }
}