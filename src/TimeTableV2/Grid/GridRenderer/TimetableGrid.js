import React from 'react';
import { connect } from 'react-redux';
import GridSwiperComponent from '../Swiper/Grid.swiper.component';
import PeriodCell from '../PeriodCell';
import moment from 'moment';
import { changeWeek } from '../../../Main/actions';

function TimetableGrid({ periods, date, minMax, changeWeek }) {
    const min = moment.max(
        moment()
            .weekYear(minMax.min.year)
            .week(minMax.min.week),
        moment().add(-1, 'week')
    );
    const max = moment()
        .weekYear(minMax.max.year)
        .week(minMax.max.week);

    const index = date.diff(min, 'week');
    console.log(index);

    const rows = React.useMemo(() => Object.values(periods).map(period => ({
        period: period,
        component: PeriodCell
    })), [periods]);

    function handleChangeIndex(index, newIndex) {
        changeWeek(newIndex - index);
        return newIndex;
    }

    return (
        <GridSwiperComponent
            index={index}
            onChangeIndex={handleChangeIndex}
            rows={rows}>
        </GridSwiperComponent>
    )
}

const mapStateToProps = () => {
    return (state, props) => ({
        periods: state.timetable.masterdata.Period_Time,
        date: state.timetable.timetableDate,
        minMax: state.timetable.masterdata.minMaxDates,
    })
}

const mapDispatchToProps = (dispatch) => ({
    changeWeek: (diff) => dispatch(changeWeek(diff)),

})

export default connect(mapStateToProps, mapDispatchToProps)(TimetableGrid);