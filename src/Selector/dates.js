import { createSelector } from 'reselect'
import moment from 'moment';

const getDates = (state) => state.dates.dates;

const getMappedDates = (dates) => {
    let array = [];
    dates.forEach(element => {
        let startDate = moment(element.DATE_FROM.date);
        let object = array.find((element) => element.DATE.diff(startDate, 'days') === 0);
        if (!object) {
            object = { DATE: startDate, dates: [] };
            array.push(object);
        }
        object.dates.push(element);
    });
    return array;
};


const makeGetCurrentDates = () => {
    return createSelector(
        getDates,
        getMappedDates,
    );
};

export default makeGetCurrentDates;
