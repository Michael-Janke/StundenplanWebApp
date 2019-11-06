export function loadReport(id) {
    return {
        type: 'GET_REPORT',
        id,
    };
}
