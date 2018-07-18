import { defaultMemoize, createSelectorCreator } from 'reselect';

const shallowEqual = (a, b) => {
    if (a === b) {
        return true;
    }
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    var len = aKeys.length;

    if (bKeys.length !== len) {
        return false;
    }
    for (var i = 0; i < len; i++) {
        var key = aKeys[i];
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}

const createEqualSelector = createSelectorCreator(
    defaultMemoize,
    shallowEqual
);



const getEffectiveAvatars = state => Object.keys(state.avatars)
    .reduce((prev, current) => {
        const object = state.avatars[current];
        if (object && object.img) {
            prev[current] = object;
        }
        return prev;
    }, {});

const makeGetEffectiveAvatars = () => {
    return createEqualSelector(
        getEffectiveAvatars,
        c => c,
    );
};

export default makeGetEffectiveAvatars;