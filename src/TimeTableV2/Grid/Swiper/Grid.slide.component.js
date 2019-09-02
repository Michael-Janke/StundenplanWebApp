import React from 'react';
import { useMeasureCallback } from './helpers';
import ThemedGridCellSwiper from './ThemedGridCell.swiper';
import GridContainer from '../Grid.container';

function GridSlideComponent({ index, periodsArray }) {
    return (
        <GridContainer GridCellComponent={ThemedGridCellSwiper}>
            {periodsArray.map((period, i) => <Period period={period} key={i}></Period>)}
        </GridContainer>
    );
}

function Period({ period }) {
    const [bind] = useMeasureCallback(({ height }) => {
        period.height = height;
        period.onPeriodHeight();
    });
    return (
        <div style={{ minHeight: 54, marginBottom: 1, }} {...bind}></div>
    );
}

export default GridSlideComponent;