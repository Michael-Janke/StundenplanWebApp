import React from 'react';
import { connect } from 'react-redux';
import GridSwiperComponent from '../Swiper/Grid.swiper.component';
import { changeWeek } from '../../../Main/actions';
import TimetableContainer from './Timetable.container';
import SwipeThemedGridCell from '../Swiper/SwipeThemedGridCell';
import useRows from './useRows';

function SwipeTimetableGrid({ periods, date, min, max, changeWeek }) {


    const index = date.startOf('week').diff(min, 'week');

    const rows = useRows(periods);


    function handleChangeIndex(index, newIndex) {
        changeWeek(newIndex - index);
        return newIndex;
    }

    function renderMain(index, rows, children) {
        return <TimetableContainer
            index={index}
            rows={rows}
            GridCellComponent={SwipeThemedGridCell}>
            {children}
        </TimetableContainer>
    }

    return (
        <GridSwiperComponent
            index={index}
            onChangeIndex={handleChangeIndex}
        >

            <div>
                <slide
                    rows={rows}
                    render={renderMain}
                />
            </div>

        </GridSwiperComponent>
    )
}

const mapStateToProps = () => {
    return (state, props) => ({
        periods: state.timetable.masterdata.Period_Time,
        date: state.timetable.timetableDate,
        min: state.timetable.min,
        max: state.timetable.max
    })
}

const mapDispatchToProps = (dispatch) => ({
    changeWeek: (diff) => dispatch(changeWeek(diff)),

})

export default connect(mapStateToProps, mapDispatchToProps)(SwipeTimetableGrid);