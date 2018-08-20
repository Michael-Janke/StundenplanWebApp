import { combineReducers } from "redux";
// import { responsiveDrawer } from 'material-ui-responsive-drawer';
import { responsiveStateReducer } from 'redux-responsive';

import user from './user';
import error from './error';
import avatars from './avatars';
import timetable from './timetable';
import dates from './dates';

let substitutions;
if(process.env.REACT_APP_MODE === 'tv'){
    substitutions = require('./substitutions').default;
    console.log(substitutions);
}

export default combineReducers({
    browser: responsiveStateReducer,
    // responsiveDrawer: responsiveDrawer,
    ...(substitutions && {substitutions}),
    user,
    error,
    timetable,
    avatars,
    dates,
});
