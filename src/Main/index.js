import React from 'react';
import { useIntervalCheck } from '../Common/intervalCheck';

function Main({ match }) {
    const v2 = match.path === '/beta';
    const dispatchActions = React.useCallback((dispatch, intervalCount) => {
        dispatch({
            type: 'GET_UNREAD_MESSAGES',
        });
        if (intervalCount % 6 === 0) {
            dispatch({
                type: 'GET_ASSIGNMENTS',
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
    let TimetableComponent;
    if (v2) {
        TimetableComponent = require("../TimeTableV2").default;
    } else {
        TimetableComponent = require("../TimeTable").default;
    }
    return <TimetableComponent />;
}


export default Main;
