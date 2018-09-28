import { getBatchGenerator } from './generator';

const getProfilePictures = (upns) => {
    return {
        requests: upns.map((upn) =>
            ({
                "id": upn,
                "method": "GET",
                "url": `/users/${upn}/photos/48x48/$value`
            })
        )
    }
}

const profilePictureService = store => next => action => {
    next(action);
    switch (action.type) {
        case 'GET_BATCH_AVATARS':
            return getBatchGenerator(next)(getProfilePictures(action.payload), 'BATCH_AVATARS');
        default:
            break
    }
};

export default profilePictureService