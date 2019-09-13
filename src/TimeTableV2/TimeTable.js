import React from 'react';
import Header from './Header/Header.container';
import TimetableGrid from './Grid/GridRenderer/TimetableGrid';

export default function TimeTable() {
    return (
        <>
            <Header></Header>
            <TimetableGrid></TimetableGrid>
        </>
    )
}