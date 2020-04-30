export function loadSupervisions() {
    return {
        type: 'GET_SUPERVISIONS',
    };
}

export function openCreateAssignment({ date, team }) {
    return {
        type: 'OPEN_CREATE_ASSIGNMENT',
        payload: { date, team },
    };
}

export function closeCreateAssignment() {
    return {
        type: 'CLOSE_CREATE_ASSIGNMENT',
    };
}

export function publishAssignment({ id }) {
    return {
        type: 'PUBLISH_ASSIGNMENT',
        payload: {
            id,
        },
    };
}

export function createAssignment({ teamId, title, instructions, date }) {
    return {
        type: 'CREATE_ASSIGNMENT',
        payload: {
            teamId,
            data: {
                dueDateTime: date,
                displayName: title,
                instructions: {
                    contentType: 'html',
                    content: (instructions + '')
                        .split(/\r?\n/)
                        .map((line) => `<p>${line}</p>`)
                        .join('\n'),
                },
                assignTo: {
                    '@odata.type': '#microsoft.education.assignments.api.educationAssignmentClassRecipient',
                },
                status: 'draft',
                allowStudentsToAddResourcesToSubmission: true,
            },
        },
    };
}

export function setMyTimetable() {
    return (dispatch, getState) => {
        let { id, type } = getState().user;
        if (id && type) {
            dispatch({ type: 'SET_MY_TIMETABLE', payload: { id, type } });
        }
    };
}

export function loadStudentList(timetableId, date) {
    return {
        type: 'GET_STUDENTLIST',
        timetableId,
        date,
    };
}
