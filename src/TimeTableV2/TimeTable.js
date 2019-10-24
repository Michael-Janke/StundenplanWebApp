import React from 'react';
import Header from './Header/Header.container';
import TimetableGrid from './Grid/Timetable/index.js';

export default function TimeTable() {
    return (
        <>
            <Header></Header>
            <TimetableGrid></TimetableGrid>
        </>
    )
}