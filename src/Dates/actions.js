export function addDate(date) {
    return { type: 'ADD_DATE', payload: date };
}

export function editDate(date) {
    return { type: 'EDIT_DATE', payload: date };
}

export function getDates() {
    return { type: 'GET_DATES' };
}

export function deleteDate(date) {
    return { type: 'DELETE_DATE', payload: date };
}
