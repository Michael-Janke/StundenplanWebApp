import { combineReducers } from 'redux';
import { createResponsiveStateReducer } from 'redux-responsive';

import user from './user';
import notifications from './notifications';
import avatars from './avatars';
import timetable from './timetable';
import dates from './dates';
import drawer from './drawer';
import admin from './admin';
import posts from './posts';
import period from './period';
import online from './online';
import teams from './teams';
import substitutions from './substitutions';
import tv from './tv';
import assignments from './assignments';
import postcreation from './postcreation';
import report from './report';

export default combineReducers({
    browser: createResponsiveStateReducer({
        extraSmall: 600,
        small: 799,
        medium: 960,
        large: 1280,
        extraLarge: 1920,
    }),
    substitutions,
    admin,
    period,
    online,
    posts,
    postcreation,
    drawer,
    user,
    notifications,
    timetable,
    avatars,
    dates,
    teams,
    tv,
    assignments,
    report,
});
