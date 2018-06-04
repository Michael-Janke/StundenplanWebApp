import { createSelector } from 'reselect';
import { getSubstitutionsCacheKey, specifySubstitutionType } from '../Common/const';
import moment from 'moment';
import { translatePeriods, skipDuplications } from './timetable';

const getSortBy = (state) => state.substitutions.sortBy;

const getDate = (state) => state.substitutions.date;
const getWeekSelector = createSelector(getDate, (date) => moment(date).week());
const getYearSelector = createSelector(getDate, (date) => moment(date).year());

const getSubstitutions = (state) => state.substitutions.substitutions;
const getMasterdata = (state) => state.timetable.masterdata;
const getPeriods = (state) => state.timetable.masterdata.Period_Time;

const getCurrentSubstitutions = createSelector(
    getSubstitutions,
    getWeekSelector,
    getYearSelector,
    (substitutions, week, year) => substitutions[getSubstitutionsCacheKey({ id: '0', type: 'all', week, year })]
)

function getAllSubstitutions(sortBy, substitutions, masterdata, date, periods) {
    if (!substitutions || !masterdata) {
        return null;
    }
    periods = Object.values(periods);

    if (substitutions.substitutions[0]) {
        let data = { periods: [] };
        let subst = substitutions.substitutions[0];
        joinSubstitutions(subst, data, periods);
        skipDuplications(data, periods);
        translatePeriods(masterdata, data, periods);
        console.log(data, subst, periods);
    }
}

function joinSubstitutions(subsOnDay, data, periods) {
    for (let i = 0; i < periods.length; i++){
        data.periods[i] = { lessons: [] };
    }
    subsOnDay.substitutions.forEach(substitution => {
        let periods = data.periods[substitution.PERIOD-1];
        periods.lessons.push(specifySubstitutionType(0, "class", substitution));
    });
}

const makeGetSubstitutions = () => {
    return createSelector(
        getSortBy,
        getCurrentSubstitutions,
        getMasterdata,
        getDate,
        getPeriods,
        getAllSubstitutions
    );
};

export default makeGetSubstitutions;