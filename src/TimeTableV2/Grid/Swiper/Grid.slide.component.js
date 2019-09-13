import React from 'react';
import { useMeasureCallback } from './helpers';
import ThemedGridCellSwiper from './ThemedGridCell.swiper';
import TimetableContainer from '../GridRenderer/Timetable.container';

function GridSlideComponent({ index, rows, slide, onRowHeight }) {
    return (
        <TimetableContainer
            index={index}
            GridCellComponent={ThemedGridCellSwiper}
            rows={rows}>
            {rows.map((row, i) =>
                <RowComponent
                    row={row}
                    slide={slide[i]}
                    key={i}
                    index={i}
                    onRowHeight={onRowHeight}>

                </RowComponent>)}
        </TimetableContainer>
    );
}

function RowComponent({ row, slide, onRowHeight, index }) {
    const [{ ref }] = useMeasureCallback(({ height }) => {
        slide.height = height;
        onRowHeight(index);
        handleMinHeight();
    });
    const handleMinHeight = React.useCallback(() => {
        if (ref.current && ref.current.style) {
            ref.current.style.minHeight = `${row.backgroundHeight}px`;
        }
    }, [row.backgroundHeight, ref]);

    if (!row.listeners) {
        row.listeners = [];
    }
    row.listeners.push(handleMinHeight);

    return (
        <div style={{ minHeight: row.backgroundHeight }} ref={ref}></div>
    );
}

export default GridSlideComponent;