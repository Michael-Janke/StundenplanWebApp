import { createSelector } from 'reselect';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

const datesSelector = (state) => state.dates.dates;
const dateSelector = (state) => state.timetable.timetableDate;

export const layoutedDatesSelector = createSelector(datesSelector, dateSelector, (dates, date) => {
    if (!dates) return null;
    date = date.clone();
    dates = dates.filter((date) => date.TYPE !== 'HOLIDAY');
    const currentWeek = moment(date).range('week');
    currentWeek.end.subtract(2, 'days');

    const datesOfWeek = dates
        .filter((date) =>
            moment.range(moment.utc(date.DATE_FROM.date), moment.utc(date.DATE_TO.date)).overlaps(currentWeek)
        )
        .map((date) => {
            const range = moment.range(moment.utc(date.DATE_FROM.date), moment.utc(date.DATE_TO.date));
            const weekRange = range.intersect(currentWeek).snapTo('day');
            return {
                ...date,
                startInWeek: range.start.within(weekRange),
                endInWeek: range.end.within(weekRange),
                startWeekday: weekRange.start.weekday(),
                endWeekday: weekRange.end.weekday(),
                range,
                weekRange,
                duration: Math.round(weekRange.diff('days', true)),
            };
        })
        .sort((a, b) => {
            if (a.duration < b.duration) return 1;
            if (a.duration > b.duration) return -1;
            if (a.startWeekday < b.startWeekday) return -1;
            if (a.startWeekday > b.startWeekday) return 1;
            return 0;
        });

    const layout = [];
    var currentCol = 0;
    while (datesOfWeek.some((date) => !date.placed)) {
        // eslint-disable-next-line
        for (let date of datesOfWeek) {
            if (date.placed) continue;
            if (date.startWeekday >= currentCol) {
                currentCol = date.endWeekday + 1;
                date.placed = true;
                layout.push(date);
                continue;
            }
        }
        currentCol = 0;
    }

    layout.reduce((prev, curr) => {
        curr.leftSpan = curr.startWeekday;
        curr.rightSpan = 4 - curr.endWeekday;
        if (prev && prev.rightSpan + curr.leftSpan >= 5) {
            prev.rightSpan = 0;
            curr.leftSpan = curr.startWeekday - prev.endWeekday - 1;
        }

        return curr;
    }, null);

    return layout;
});
