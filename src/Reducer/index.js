import { combineReducers } from "redux";
import { responsiveStateReducer } from 'redux-responsive';

import user from './user';
import error from './error';
import avatars from './avatars';
import timetable from './timetable';
import dates from './dates';
import favorites from './favorites';

let substitutions;
if(process.env.REACT_APP_MODE === 'tv'){
    substitutions = require('./substitutions').default;
}

export default combineReducers({
    browser: responsiveStateReducer,
    ...(substitutions && {substitutions}),
    user,
    error,
    timetable,
    avatars,
    dates,
    favorites,
});
