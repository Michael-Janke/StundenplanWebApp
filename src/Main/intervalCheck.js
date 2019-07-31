import { dispatch } from '../store';
import { getAuthContext } from '../Common/Authentication/storage';

let intervalCount = 0;

const dispatchReduxAction = () => {
    const isAllowed = getAuthContext().isAllowed('authentication', 'token');
    if (!isAllowed && isAllowed !== undefined) {
        return;
    }
    dispatch({
        type: 'CHECK_CURRENT_PERIOD',
    });
    dispatch({
        type: 'GET_UNREAD_MESSAGES',
    });
    dispatch({
        type: 'GET_COUNTER',
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
    intervalCount = (intervalCount + 1) % (6 * 60 * 24); // at least once a day;
};

// call action every 10 seconds
let intervalId;
const startInterval = () => {
    stopInterval();
    intervalCount = 0;
    intervalId = setInterval(dispatchReduxAction, 1000 * 10);
    dispatchReduxAction();
};
const stopInterval = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
    }
};

var hidden, visibilityChange;
if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
}

function handleVisibilityChange() {
    if (document[hidden]) {
        stopInterval();
    } else {
        startInterval();
    }
}

export const intervalCheckStart = () => {
    startInterval();
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
};

export const intervalCheckStop = () => {
    stopInterval();
    document.removeEventListener(visibilityChange, handleVisibilityChange);
};
