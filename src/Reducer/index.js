import { combineReducers } from "redux";
import { responsiveStateReducer } from 'redux-responsive';

import user from './user';
import error from './error';
import avatars from './avatars';
import timetable from './timetable';
import dates from './dates';
import drawer from './drawer';
import admin from "./admin";
import contributions from './contributions';

let substitutions;
if (process.env.REACT_APP_MODE === 'tv') {
    substitutions = require('./substitutions').default;
}

export default combineReducers({
    browser: responsiveStateReducer,
    ...(substitutions && { substitutions }),
    ...(admin && { admin }),
    contributions,
    drawer,
    user,
    error,
    timetable,
    avatars,
    dates,
});
