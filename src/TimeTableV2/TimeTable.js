import React from 'react';
import VirtualizedTimetable from './VirtualizedTimetable';
import Header from './Header/Header.container';

export default function TimeTable() {
    return (
        <>
            <Header></Header>
            <VirtualizedTimetable> </VirtualizedTimetable>
        </>
    )
}