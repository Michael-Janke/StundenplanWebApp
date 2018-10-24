import { createSelector } from "reselect";

// state.user changes reference everytime something changes in user reducer
// one solution could be putting non-userinformation into another level (state.user.user)
// here selectors check their selectors' return value for equality
const computeUser = createSelector(
    state => state.user.upn,
    state => state.user.type,
    state => state.user.id,
    state => state.user.firstname,
    state => state.user.lastname,
    (upn, type, id, firstname, lastname) => ({ upn, type, id, firstname, lastname })
);

export default computeUser;