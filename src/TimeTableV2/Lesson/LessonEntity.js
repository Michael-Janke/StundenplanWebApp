import React from 'react';
import Lesson from './Lesson';
import LessonContent from './LessonContent';
import { equalPeriods } from '../../Selector/timetable';
import ExpandLesson from './ExpandLesson';

function LessonEntity({ type, lesson }) {
    return (
        <ExpandLesson lesson={lesson}>
            <Lesson specificSubstitutionType={lesson.specificSubstitutionType}>
                <LessonContent type={type} lesson={lesson}></LessonContent>
            </Lesson>
        </ExpandLesson>
    );
}

export default React.memo(LessonEntity, (prevProps, nextProps) => {
    if (nextProps.type !== prevProps.type) {
        return false;
    }

    const prevLesson = prevProps.lesson;
    const nextLesson = nextProps.lesson;

    return equalPeriods(prevLesson, nextLesson);
});
