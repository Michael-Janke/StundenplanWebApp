

import { combineReducers } from "redux";
import { loginReducer } from './LogIn/reducer';
import {responsiveDrawer} from 'material-ui-responsive-drawer';
import {responsiveStateReducer} from 'redux-responsive';

export default combineReducers({
    login: loginReducer,
    browser: responsiveStateReducer,
    responsiveDrawer: responsiveDrawer
});
