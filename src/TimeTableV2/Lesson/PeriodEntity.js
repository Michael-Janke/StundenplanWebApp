import React from 'react';
import Lesson from './Lesson';
import Absence from './Absence';
import LessonContent from './LessonContent';



export default function PeriodEntity({ lessons, supervision, type }) {
    // TODO: add supervision
    return (
        <>
            {lessons && lessons.map((lesson, i) => {
                let { ...other } = lesson;
                if (other.absence) {
                    return <Absence {...other} key={other.absence.ABSENCE_ID} table />;
                } else {
                    return (
                        <Lesson
                            key={lesson.reference.TIMETABLE_ID || -i}
                        >
                            <LessonContent
                                type={type}
                                {...other}
                            ></LessonContent>
                        </Lesson>
                    );
                }
            })}
        </>
    );

}