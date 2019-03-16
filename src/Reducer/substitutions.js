const initialState = {
    sortBy: { type: { singular: 'class', plural: 'classes' }, fieldName: 'CLASS_IDS' },
};

const sortsBy = {
    class: { type: { singular: 'class', plural: 'classes' }, fieldName: 'CLASS_IDS' },
    teacher: { type: { singular: 'teacher', plural: 'teachers' }, fieldName: 'TEACHER_ID' },
};

export default function substitutionsReducer(state = initialState, action) {
    switch (action.type) {
        case 'persist/REHYDRATE':
            if (!action.payload || !action.payload.substitutions) return state;
            return {
                ...action.payload.substitutions,
                ...state,
            };
        case 'SET_SORT_BY':
            return {
                ...state,
                sortBy: sortsBy[action.payload || 'class'],
            };
        default:
    }
    return state;
}
