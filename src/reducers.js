

import { combineReducers } from "redux";
import { timetableReducer } from './TimeTable/reducer';
import { userReducer, errorReducer, avatarReducer } from './Main/reducer';
import {responsiveDrawer} from 'material-ui-responsive-drawer';
import {responsiveStateReducer} from 'redux-responsive';

export default combineReducers({
    browser: responsiveStateReducer,
    responsiveDrawer: responsiveDrawer,
    user: userReducer,
    error: errorReducer,
    timetable: timetableReducer,
    avatars: avatarReducer
});
