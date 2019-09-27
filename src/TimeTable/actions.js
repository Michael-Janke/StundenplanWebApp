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
                        .map(line => `<p>${line}</p>`)
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


export function openSendHint(data) {
    return {
        type: 'OPEN_SEND_HINT',
        payload: data,
    };
}

export function closeSendHint() {
    return {
        type: 'CLOSE_SEND_HINT',
    };
}