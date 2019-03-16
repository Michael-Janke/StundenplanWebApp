import moment from 'moment';

function periodTime(timeAsNumber) {
    const lpad2 = number => (number < 10 ? '0' : '') + number;
    return Math.floor(timeAsNumber / 100) + ':' + lpad2(timeAsNumber % 100);
}

const periodService = store => next => action => {
    next(action);
    switch (action.type) {
        case 'CHECK_CURRENT_PERIOD': {
            const masterdata = store.getState().timetable.masterdata;
            if (masterdata) {
                const periods = Object.values(masterdata.Period_Time);
                if (periods.length) {
                    const period = periods.reduce((prev, period) => {
                        const from = moment(periodTime(prev.END_TIME), 'hh:mm');
                        const to = moment(periodTime(period.END_TIME), 'hh:mm');
                        return moment().isBetween(from, to) ? period : prev;
                    });
                    store.dispatch({ type: 'SET_CURRENT_PERIOD', payload: period });
                }
            }
            break;
        }
        default:
            break;
    }
};

export default periodService;
