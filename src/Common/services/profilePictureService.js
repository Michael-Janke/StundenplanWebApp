import moment from 'moment';
import { getBatchGenerator } from './generator';

const getProfilePictures = (upns) => {
    return {
        requests: upns.map((upn) => ({
            id: upn,
            method: 'GET',
            url: `/users/${upn}/photos/48x48/$value`,
        })),
    };
};

const profilePictureService = (store) => (next) => (action) => {
    next(action);
    switch (action.type) {
        case 'GET_BATCH_AVATARS':
            const upns = action.payload.filter((upn) => {
                const avatar = store.getState().avatars[upn];
                return !avatar || moment(avatar.expires).isBefore(moment());
            });
            if (upns.length === 0) return;
            const upnLoads = [...new Set(upns)];
            while (upnLoads.length) {
                const upns = upnLoads.splice(0, 20);
                getBatchGenerator(next)(getProfilePictures(upns), 'BATCH_AVATARS');
            }
            break;
        default:
            break;
    }
};

export default profilePictureService;
