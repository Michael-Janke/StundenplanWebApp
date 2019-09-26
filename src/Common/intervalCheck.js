import { dispatch } from '../store';
import React from 'react';

export const useIntervalCheck = (callback) => {
    let intervalCount = React.useRef(0);
    // call action every 10 seconds
    let intervalId = React.useRef();

    React.useEffect(() => {
        const dispatchReduxAction = () => {
            dispatch({
                type: 'CHECK_CURRENT_PERIOD',
            });
            dispatch({
                type: 'GET_COUNTER',
            });

            intervalCount.current = callback ? callback(dispatch, intervalCount.current) : intervalCount.current;
        };

        const startInterval = () => {
            stopInterval();
            intervalCount.current = 0;
            intervalId.current = setInterval(dispatchReduxAction, 1000 * 10);
            dispatchReduxAction();
        };
        const stopInterval = () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = undefined;
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

        const intervalCheckStart = () => {
            startInterval();
            document.addEventListener(visibilityChange, handleVisibilityChange, false);
        };

        const intervalCheckStop = () => {
            stopInterval();
            document.removeEventListener(visibilityChange, handleVisibilityChange);
        };
        intervalCheckStart(callback);
        return intervalCheckStop;
    }, [callback]);
};
