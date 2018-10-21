
export function addContribution(contribution) {
    return { type: "ADD_CONTRIBUTION", payload: contribution };
}

export function editContribution(contribution) {
    return { type: "EDIT_CONTRIBUTION", payload: contribution };
}

export function getContributions() {
    return { type: "GET_CONTRIBUTIONS" };
}

export function deleteContribution(contribution) {
    return { type: "DELETE_CONTRIBUTION", payload: contribution };
}