

import { combineReducers } from "redux";
import { loginReducer } from './LogIn/reducer';

export default combineReducers({
    login: loginReducer
});
