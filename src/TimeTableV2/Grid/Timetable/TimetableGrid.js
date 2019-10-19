import React from 'react';
import { connect } from 'react-redux';
import GridSwiperComponent from '../Swiper/Grid.swiper.component';
import PeriodCell from '../PeriodCell';
import moment from 'moment';
import { changeWeek } from '../../../Main/actions';
import HeaderBackground from './TimetableHeaderBackground';
import { TimetablePeriodCell } from './TimetablePeriodCell';
import TimetableContainer from './Timetable.container';
import ThemedGridCell from '../Swiper/ThemedGridCell.swiper';

function TimetableGrid({ periods, date, min, max, changeWeek }) {


    const index = date.startOf('week').diff(min, 'week');

    // structure of grid
    const rows = React.useMemo(() =>
        [
            {
                key: -1,
                component: HeaderBackground,
                type: 'header',
            },
            ...Object.values(periods).map((period, i) => {
                return (
                    {
                        key: i,
                        period,
                        type: 'main',
                        component: TimetablePeriodCell,
                    }
                )
            }),
            {
                key: -2,
                component: HeaderBackground,
                type: 'footer',
            }
        ], [periods]
    )


    function handleChangeIndex(index, newIndex) {
        changeWeek(newIndex - index);
        return newIndex;
    }

    function renderMain(index, rows, children) {
        return <TimetableContainer
            index={index}
            rows={rows}
            GridCellComponent={ThemedGridCell}>
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

export default connect(mapStateToProps, mapDispatchToProps)(TimetableGrid);