import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import DatesMonth from './DatesMonth';

const transformDates = (dates) => {
    let monthKeyed = {};
    dates.forEach((date) => {
        const utcDate = moment.utc(date.DATE_FROM.date);
        const key = utcDate.format('YYYY MM');
        monthKeyed[key] = monthKeyed[key] ? monthKeyed[key] : [];
        monthKeyed[key].push(date);
    });
    Object.keys(monthKeyed).forEach((month) =>
        monthKeyed[month].sort((a, b) => moment(a.DATE_FROM.date) - moment(b.DATE_FROM.date))
    );
    return monthKeyed;
};

const DatesList = ({ onDelete, onEdit }) => {
    const dates = useSelector((state) => state.dates.dates) || [];
    const monthKeyedDates = useMemo(() => transformDates(dates), [dates]);

    return (
        <>
            {Object.keys(monthKeyedDates)
                .sort()
                .map((month) => (
                    <DatesMonth
                        key={month}
                        dates={monthKeyedDates[month]}
                        month={month}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
        </>
    );
};

export default DatesList;
