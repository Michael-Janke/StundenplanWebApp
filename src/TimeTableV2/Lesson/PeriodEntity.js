import React from 'react';
import Lesson from './Lesson';
import Absence from './Absence';
import LessonContent from './LessonContent';



export default function PeriodEntity({ lessons, supervision, type }) {
    // TODO: add supervision
    return (
        <>
            {lessons && lessons.map((lesson, i) => {
                if (lesson.absence) {
                    return <Absence {...lesson} key={lesson.absence.ABSENCE_ID} table />;
                } else {
                    return (
                        <Lesson
                            key={lesson.reference.TIMETABLE_ID || -i}
                            specificSubstitutionType={lesson.specificSubstitutionType}
                        >
                            <LessonContent
                                type={type}
                                lesson={lesson}
                            ></LessonContent>
                        </Lesson>
                    );
                }
            })}
        </>
    );

}