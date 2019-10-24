import React from 'react';
import Absence from './Absence';
import LessonEntity from './LessonEntity';

export default function PeriodEntity({ lessons, supervision, type }) {
    // TODO: add supervision
    return (
        <>
            {lessons &&
                lessons.map((lesson, i) => {
                    if (lesson.absence) {
                        return <Absence {...lesson} key={lesson.absence.ABSENCE_ID} table />;
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
