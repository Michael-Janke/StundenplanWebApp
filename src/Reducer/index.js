import { combineReducers } from "redux";
// import { responsiveDrawer } from 'material-ui-responsive-drawer';
import { responsiveStateReducer } from 'redux-responsive';

import user from './user';
import error from './error';
import avatars from './avatars';
import timetable from './timetable';

export default combineReducers({
    browser: responsiveStateReducer,
    // responsiveDrawer: responsiveDrawer,
    user,
    error,
    timetable,
    avatars
});
