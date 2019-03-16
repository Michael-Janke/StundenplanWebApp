import { defaultMemoize, createSelectorCreator } from 'reselect';

const shallowEqual = (a, b) => {
    if (a === b) {
        return true;
    }
    if (!a || !b) {
        return false;
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
};

const createEqualSelector = createSelectorCreator(defaultMemoize, shallowEqual);

const getEffectiveAvatars = state =>
    Object.keys(state.avatars).reduce((prev, current) => {
        const object = state.avatars[current];
        if (object && object.img) {
            prev[current] = object;
        }
        return prev;
    }, {});

const makeGetEffectiveAvatars = () => {
    return createEqualSelector(getEffectiveAvatars, c => c);
};

const getEffectiveAvatar = (state, props) => {
    const avatar = state.avatars[props.upn];
    if (avatar && avatar.img) {
        return avatar;
    }
    return null;
};

const makeGetEffectiveAvatar = () => {
    return createEqualSelector(getEffectiveAvatar, c => c);
};

export { makeGetEffectiveAvatar };

export default makeGetEffectiveAvatars;
