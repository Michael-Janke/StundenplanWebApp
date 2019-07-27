import { dispatch } from '../../store';

const dispatchReduxAction = () => {
    dispatch({
        type: 'CHECK_CURRENT_PERIOD',
    });
    dispatch({
        type: 'GET_COUNTER',
    });
};

// call action every 10 seconds
let intervalId;
export const startIntervalCheck = () => {
    stopIntervalCheck();
    intervalId = setInterval(dispatchReduxAction, 1000 * 10);
    dispatchReduxAction();
};
export const stopIntervalCheck = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
    }
};
