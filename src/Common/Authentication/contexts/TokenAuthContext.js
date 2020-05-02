import { fetchData } from '../../utils';
import AuthContext from './AuthContext';

const client_id = 'ef085784-4829-427c-ab32-5e90502a1dde';

export default class TokenAuthContext extends AuthContext {
    static resources = {
        'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/':
            'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/.default',
        'https://graph.microsoft.com/': 'https://graph.microsoft.com/.default',
    };

    constructor(client_secret) {
        super();
        this.client_secret = client_secret;
    }

    logOut() {
        super.logOut();
    }

    toObject() {}

    async acquireToken(endpoint) {
        const body = {
            client_secret: this.client_secret,
            client_id,
            scope: this.constructor.resources[endpoint],
        };
        const response = await fetchData(`https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/token`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'Application/Json',
            },
        });
        this.setToken(response, endpoint);
    }
}
