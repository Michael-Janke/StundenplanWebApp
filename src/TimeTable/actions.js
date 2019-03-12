export function openCreateAssignment(team) {
    return {
        type: 'OPEN_CREATE_ASSIGNMENT',
        payload: team,
    };
}
