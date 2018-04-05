import { createSelector } from 'reselect'
import moment from 'moment';

const getDates = (state) => state.dates.dates;
const getCurrentTimetableDate = (state) => moment(state.timetable.timetableDate).weekday(0);

const getMappedDates = (dates, currentDate) => {
    let array = [];
    dates.forEach(element => {
        let startDate = moment(element.DATE_FROM.date);
        if (startDate.isBefore(currentDate)) {
            return;
        }
        let object = array.find((element) => element.DATE.diff(startDate, 'days') === 0);
        if (!object) {
            object = { DATE: startDate, dates: [] };
            array.push(object);
        }
        object.dates.push(element);
    });
    console.log(array, dates);
    return array;
};


const makeGetCurrentDates = () => {
    return createSelector(
        getDates,
        getCurrentTimetableDate,
        getMappedDates,
    );
};

export default makeGetCurrentDates;
