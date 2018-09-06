import { createSelector } from 'reselect'

const getDates = (state) => state.dates.dates;

const getMappedDates = (dates) => {
    let array = [...dates.filter((e)=> e && e.DATE_FROM)];
    array.sort((a,b) => a.DATE_FROM.date < b.DATE_FROM.date ? -1 : a.DATE_FROM.date > b.DATE_FROM.date ? 1 : 0);
    return array;
};

const makeGetCurrentDates = () => {
    return createSelector(
        getDates,
        getMappedDates,
    );
};

export default makeGetCurrentDates;
