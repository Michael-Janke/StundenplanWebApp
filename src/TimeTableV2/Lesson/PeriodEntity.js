import React from 'react';
import Absence from './Absence';
import LessonEntity from './LessonEntity';

export default function PeriodEntity({ lessons, supervision, type }) {
    // TODO: add supervision
    return (
        <>
            {lessons &&
                lessons.map((lesson, i) => {
                    if (lesson.ABSENCE_ID) {
                        if (!lesson.room) {
                            // dont show absences when no room
                            return null;
                        }
                        return <Absence absence={lesson} key={lesson.ABSENCE_ID} table />;
                    } else {
                        return (
                            <LessonEntity
                                lesson={lesson}
                                type={type}
                                key={lesson.reference.TIMETABLE_ID || -i}
                            ></LessonEntity>
                        );
                    }
                })}
        </>
    );
}
