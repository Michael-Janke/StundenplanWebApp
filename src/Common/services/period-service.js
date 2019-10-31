import moment from 'moment';

const noPeriod = { END_TIME: null, noPeriod: true };
const periodService = store => next => action => {
    next(action);
    switch (action.type) {
        case 'CHECK_CURRENT_PERIOD': {
            if (moment().isoWeekday() > 5) {
                //weekend
                return store.dispatch({ type: 'SET_CURRENT_PERIOD', payload: noPeriod });
            }
            const masterdata = store.getState().timetable.masterdata;
            if (masterdata) {
                const periods = Object.values(masterdata.Period_Time);
                if (periods.length) {
                    noPeriod.END_TIME = periods[0].START_TIME;
                    const period = periods.reduce((prev, period) => {
                        const from = moment(prev.END_TIME, 'Hmm');
                        const to = moment(period.END_TIME, 'Hmm');
                        return moment().isBetween(from, to) ? period : prev;
                    }, noPeriod);
                    if (store.getState().period.currentPeriod !== period) {
                        store.dispatch({ type: 'SET_CURRENT_PERIOD', payload: period });
                    }
                }
            }
            break;
        }
        default:
            break;
    }
};

export default periodService;
