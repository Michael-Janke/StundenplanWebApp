import React from 'react';
import ThemedGridCell from './ThemedGridCell';
import PeriodEntity from '../Lesson/PeriodEntity';


export default function LessonCell({ lessons, type, ...other }) {
    return (
        <ThemedGridCell {...other}>
            <PeriodEntity lessons={lessons} type={type}></PeriodEntity>
        </ThemedGridCell>
    )
}