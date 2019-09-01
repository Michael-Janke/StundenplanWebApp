import React from 'react';
import VirtualizedTimetable from './Grid/VirtualizedTimetable';
import Header from './Header/Header.container';
import GridContainer from './Grid/Swiper/Grid.swiper.container';

export default function TimeTable() {
    return (
        <>
            <Header></Header>
            <GridContainer></GridContainer>
        </>
    )
}