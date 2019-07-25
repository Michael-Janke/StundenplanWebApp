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
    if (intervalCount === 0) {
        dispatch({
            type: 'GET_ASSIGNMENTS',
        });
    }
    intervalCount = (intervalCount + 1) % 6;
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
