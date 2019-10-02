import moment from 'moment';
import debounce from 'debounce';
import { getBatchGenerator } from './generator';

const getProfilePictures = upns => {
    return {
        requests: upns.map(upn => ({
            id: upn,
            method: 'GET',
            url: `/users/${upn}/photos/48x48/$value`,
        })),
    };
};

var upnLoads = [];
const load = debounce(next => {
    while (upnLoads.length) {
        const upns = upnLoads.splice(0, 20);
        getBatchGenerator(next)(getProfilePictures(upns), 'BATCH_AVATARS');
    }
}, 200);

const profilePictureService = store => next => action => {
    next(action);
    switch (action.type) {
        case 'GET_BATCH_AVATARS':
            const upns = action.payload.filter(upn => {
                const avatar = store.getState().avatars[upn];
                return !avatar || moment(avatar.expires).isBefore(moment());
            });
            if (upns.length === 0) return;
            upnLoads = [...new Set([...upnLoads, ...upns])];
            load(next);
            break;
        default:
            break;
    }
};

export default profilePictureService;
