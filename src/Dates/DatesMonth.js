import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Date from './Date';
import { EditButton, DeleteButton, HomepageButton, HomepageBoxButton } from './DateEditButtons';
import ListSubheader from '@material-ui/core/ListSubheader';

import { makeStyles } from '@material-ui/styles';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles(theme => ({
    subheader: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
        margin: 0,
    },
}));

const DatesMonth = ({ dates, month, onDelete, onEdit }) => {
    const classes = useStyles();
    const editMode = useSelector(state => state.dates.editMode);
    const ref = useRef();

    const scrollToThisMonth = useSelector(state => state.timetable.timetableDate.format('YYYY MM') === month);
    useEffect(() => {
        if (scrollToThisMonth && ref.current) {
            ref.current.parentNode.scrollTop = ref.current.offsetTop;
        }
    }, [ref, scrollToThisMonth]);

    const filterDates = useSelector(state => state.browser.lessThan.medium && state.timetable.timetableDate);
    const filteredDates = filterDates ? dates.filter(date => moment.utc(date.DATE_FROM.date) >= filterDates) : dates;
    if (filteredDates.length === 0) return null;

    return (
        <ul className={classes.ul} ref={ref}>
            <ListSubheader key={-1} className={classes.subheader}>
                {moment(month, 'YYYY MM').format('MMMM YYYY')}
            </ListSubheader>
            {filteredDates.map(date => (
                <Date
                    date={date}
                    key={date.DATE_ID}
                    buttons={
                        editMode &&
                        date.DATE_ID > 0 && (
                            <>
                                <HomepageButton date={date} />
                                <HomepageBoxButton date={date} />
                                <EditButton onClick={() => onEdit(date)} />
                                <DeleteButton onClick={() => onDelete(date)} />
                            </>
                        )
                    }
                />
            ))}
        </ul>
    );
};

export default DatesMonth;
