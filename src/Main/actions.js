export function loadMe() {
    return { type: 'GET_ME' };
}
export function loadJoinedTeams() {
    return { type: 'GET_JOINED_TEAMS' };
}

export function loadAssignments() {
    return { type: 'GET_ASSIGNMENTS' };
}

export function getTeamsWebUrl(id) {
    return {
        type: 'GET_TEAMS_WEBURL',
        id,
    };
}

export function getTeamsNotebook(id) {
    return {
        type: 'GET_TEAMS_NOTEBOOK',
        id,
    };
}

export function openDrawer() {
    return { type: 'OPEN_DRAWER' };
}
export function closeDrawer() {
    return { type: 'CLOSE_DRAWER' };
}
export function toggleDrawer() {
    return { type: 'TOGGLE_DRAWER' };
}

export function addFavorite(key) {
    return { type: 'ADD_FAVORITE', payload: key };
}

export function removeFavorite(key) {
    return { type: 'REMOVE_FAVORITE', payload: key };
}

export function sendFeedback(feedback) {
    return { type: 'SEND_FEEDBACK', payload: feedback };
}

export function updateRemindSettings(settings) {
    return { type: 'PATCH_REMIND_SETTINGS', payload: settings };
}

export function checkCounter() {
    return { type: 'GET_COUNTER' };
}

export function sendLoginStatistic(data) {
    return { type: 'SEND_LOGIN_STATISTIC', payload: data };
}

export function setSortBy(sortBy) {
    return { type: 'SET_SORT_BY', payload: sortBy };
}

export function counterChanged(counterChanged) {
    return dispatch => {
        dispatch({ type: 'COUNTER_CHANGED', payload: counterChanged });
        if (counterChanged) {
            dispatch(loadMe());
            dispatch(loadMasterData());
        }
    };
}

export function getSubstitutions(id, type, week, year) {
    return { type: 'GET_SUBSTITUTIONS', payload: { id, type, week, year } };
}

export function getTimetable(id, type) {
    return { type: 'GET_TIMETABLE', payload: { id, type } };
}

export function loadProfilePicture() {
    return { type: 'GET_PROFILE_PICTURE' };
}

export function loadProfilePictureSmall() {
    return { type: 'GET_PROFILE_PICTURE_SMALL' };
}

export function loadAvatars(upns) {
    return { type: 'GET_BATCH_AVATARS', payload: upns };
}

export function showError(text) {
    return { type: '_ERROR', payload: { text } };
}

export function clearErrors() {
    return { type: 'CLEAR_ERROR', payload: null };
}

export const enqueueSnackbar = notification => ({
    type: 'ENQUEUE_SNACKBAR',
    notification: {
        key: new Date().getTime() + Math.random(),
        ...notification,
    },
});

export const removeSnackbar = key => ({
    type: 'REMOVE_SNACKBAR',
    key,
});

export function setTimeTable(type, id) {
    return { type: 'SET_TIMETABLE', payload: { type, id } };
}

export function changeTheme(type) {
    return { type: 'CHANGE_THEME', payload: type };
}

export function logOut() {
    return { type: 'LOGOUT' };
}

export function setNotification({ newToken, oldToken }) {
    return { type: 'SET_NOTIFICATION', payload: { newToken, oldToken } };
}

export function changeWeek(direction, id, type) {
    return { type: 'CHANGE_WEEK', payload: { direction, id, type } };
}

export function retryTimetable() {
    return { type: 'RETRY_TIMETABLE', payload: {} };
}

export function setDate(date, id, type) {
    return { type: 'SET_DATE', payload: { date, id, type } };
}

export function setMyTimetable() {
    return (dispatch, getState) => {
        let { id, type } = getState().user;
        if (id && type) {
            dispatch({ type: 'SET_MY_TIMETABLE', payload: { id, type } });
        }
    };
}

export function loadMasterData() {
    return {
        type: 'GET_MASTERDATA',
    };
}
