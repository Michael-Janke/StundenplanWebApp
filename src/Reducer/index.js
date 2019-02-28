import { combineReducers } from "redux";
import { responsiveStateReducer } from 'redux-responsive';

import user from './user';
import notifications from './notifications';
import avatars from './avatars';
import timetable from './timetable';
import dates from './dates';
import drawer from './drawer';
import admin from "./admin";
import posts from './posts';
import period from './period';
import online from './online';
import teams from './teams';
import substitutions from './substitutions';
import tv from './tv';

export default combineReducers({
    browser: responsiveStateReducer,
    substitutions,
    admin,
    period,
    online,
    posts,
    drawer,
    user,
    notifications,
    timetable,
    avatars,
    dates,
    teams,
    tv
});
