import React from 'react';
import TimeTable from '../TimeTable';
import { useIntervalCheck } from '../Common/intervalCheck';

function Main() {
    const dispatchActions = React.useCallback((dispatch, intervalCount) => {
        dispatch({
            type: 'GET_UNREAD_MESSAGES',
        });
        if (intervalCount % 6 === 0) {
            dispatch({
                type: 'GET_ASSIGNMENTS',
            });
            dispatch({
                type: 'GET_EVENTS',
            });
        }
        if (intervalCount === 1) {
            //not immedantly
            dispatch({
                type: 'GET_JOINED_TEAMS',
            });
        }
        return (intervalCount + 1) % (6 * 60 * 24); // at least once a day;
    }, []);
    useIntervalCheck(dispatchActions);

    return <TimeTable />;
}

export default Main;
