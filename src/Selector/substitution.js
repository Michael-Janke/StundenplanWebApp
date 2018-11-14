import { createSelector } from 'reselect';
import { getSubstitutionsCacheKey, specifySubstitutionType } from '../Common/const';
import moment from 'moment';
import { translateLesson } from './timetable';

const getSortBy = (state) => state.substitutions.sortBy;

const getAddDays = (state, props) => {
    let date = moment().startOf('day').add(props.addDays, 'days');
    let days = 0;
    while (date.isoWeekday() > 5) {
        date.add(1, 'day');
        days++;
    }
    return props.addDays + days;
}

const getWeekSelector = createSelector(getAddDays, (daysToAdd) => moment().add(daysToAdd, 'days').week());
const getYearSelector = createSelector(getAddDays, (daysToAdd) => moment().add(daysToAdd, 'days').year());

const getSubstitutions = (state) => state.timetable.substitutions;
const getMasterdata = (state) => state.timetable.masterdata;
const getPeriods = (state) => state.timetable.masterdata.Period_Time;
const getCurrentPeriod = state => state.period.currentPeriod;

const getCurrentSubstitutions = createSelector(
    getSubstitutions,
    getWeekSelector,
    getYearSelector,
    (substitutions, week, year) => substitutions[getSubstitutionsCacheKey({ id: '0', type: 'all', week, year })]
);

function getAllSubstitutions(sortBy, substitutions, masterdata, addDays, periods, currentPeriod) {
    if (!substitutions || !masterdata) {
        return null;
    }
    let day = moment().add(addDays, 'days').weekday();
    periods = Object.values(periods);
    if (substitutions.substitutions[day]) {
        let subst = substitutions.substitutions[day];
        return { addDays, substitutions: extract(sortBy.type, sortBy.fieldName, subst, masterdata, currentPeriod) };
    }
}

function extract(type, fieldName, data, masterdata, currentPeriod) {
    let object = {};
    const isValid = (field) => !!field && (Array.isArray(field) ? !!field.length : true);
    const getName = (field) => field ? field.LASTNAME || field.NAME : "";

    if (!masterdata.Subject || !data.substitutions) return [];

    data.substitutions
        .filter((substitution) => substitution.PERIOD >= currentPeriod && currentPeriod.PERIOD_TIME_ID)
        .forEach(substitution => {
            let value;
            if (isValid(substitution[fieldName + "_NEW"])) {
                let key = substitution[fieldName + "_NEW"];
                value = object[key] || (object[key] = { substitutions: [] });
                let lesson = translateLesson(masterdata,
                    specifySubstitutionType(key, type.singular, substitution)
                );
                lesson.period = substitution.PERIOD - 1;
                const field = lesson[type.plural];
                value.name = isValid(field.new) ? field.new : field.old;
                value.substitutions.push(lesson);
                if (!isValid(substitution[fieldName])) {
                    return;
                }
            }
            if (substitution[fieldName]) {
                let key = substitution[fieldName];
                if (value && object[key] === value) {
                    return;
                }
                let oldValue = object[key] || (object[key] = { substitutions: [] });
                let lesson = translateLesson(masterdata,
                    specifySubstitutionType(key, type.singular, substitution)
                );
                lesson.period = substitution.PERIOD - 1;
                const field = lesson[type.plural];
                oldValue.name = isValid(field.old) ? field.old : field.new;
                oldValue.substitutions.push(lesson);
            }
        });
    const values = Object.values(object);
    values.forEach(value => value.substitutions.sort((object1, object2) => object1.period - object2.period));
    return values
        .sort((object1, object2) =>
            getName(object1.name[0])
                .localeCompare(
                    getName(object2.name[0])
                )
        );
}


const makeGetSubstitutions = () => {
    return createSelector(
        getSortBy,
        getCurrentSubstitutions,
        getMasterdata,
        getAddDays,
        getPeriods,
        getCurrentPeriod,
        getAllSubstitutions
    );
};

export default makeGetSubstitutions;