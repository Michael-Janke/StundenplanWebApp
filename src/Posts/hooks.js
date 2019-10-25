import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useInterval from 'react-useinterval';
import moment from 'moment';

const dateFilter = post => moment().isBetween(post.DATE_FROM.date, post.DATE_TO.date, 'days', '[]');
const dateSorter = (a, b) => {
    const fromA = moment()
        .startOf('day')
        .diff(a.DATE_FROM.date, 'days');
    const toA = moment()
        .startOf('day')
        .diff(a.DATE_TO.date, 'days');
    const fromB = moment()
        .startOf('day')
        .diff(b.DATE_FROM.date, 'days');
    const toB = moment()
        .startOf('day')
        .diff(b.DATE_TO.date, 'days');
    return Math.min(fromA, Math.abs(toA)) - Math.min(fromB, Math.abs(toB)) || b.POST_ID - a.POST_ID;
};

export const usePosts = ({ filter, sort } = {}) => {
    const [today, setToday] = useState(moment().format('ymd'));
    useInterval(() => setToday(moment().format('ymd')), 1000 * 60 * 60);

    let posts = useSelector(state => state.posts.posts);
    return useMemo(() => (posts || []).filter(filter || dateFilter).sort(sort || dateSorter), [
        posts,
        filter,
        sort,
        today,
    ]);
};
