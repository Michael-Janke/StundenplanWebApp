import { combineReducers } from "redux";
// import { responsiveDrawer } from 'material-ui-responsive-drawer';
import { responsiveStateReducer } from 'redux-responsive';

import user from './user';
import error from './error';
import avatars from './avatars';
import timetable from './timetable';
import dates from './dates';
import substitutions from './substitutions';

export default combineReducers({
    browser: responsiveStateReducer,
    // responsiveDrawer: responsiveDrawer,
    substitutions,
    user,
    error,
    timetable,
    avatars,
    dates,
});
