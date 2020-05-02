import { setAuthContext } from '../storage';
import { EventEmitter } from 'events';

export default class AuthContext extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    tokens = {};
    tokenAcquisistions = {};

    logOut() {
        this.tokens = {};
        this.tokenAcquisistions = [];
    }

    expireTokens() {
        Object.values(this.tokens).forEach((token) => (token.acquired = 0));
    }

    toObject() {}

    isLoggedIn() {}

    isLoggingIn() {}

    async acquireToken(endpoint) {}

    checkToken(token) {
        var expires_in = token.expires_in - 60;
        const diff = Math.round((Date.now() - token.acquired) / 1000);
        return expires_in > diff;
    }

    setToken(token, endpoint) {
        const newToken = { ...token, acquired: Date.now() };
        this.tokens[endpoint] = newToken;
        this.emit('token', { endpoint, target: { token: newToken } });
        return setAuthContext(this);
    }

    deleteToken(endpoint, error) {
        delete this.tokens[endpoint];
        error && this.emit('token', { endpoint, target: { error } });
        return setAuthContext(this);
    }

    getToken(endpoint) {
        return new Promise(async (resolve, reject) => {
            const token = this.tokens[endpoint];
            if (token) {
                if (this.checkToken(token)) {
                    resolve(token);
                    return;
                }
            }

            // aquire token only once per endpoint.
            // during acquiring the token, postpone other requests for same endpoint
            const tokenCallback = (event) => {
                if (event.endpoint !== endpoint) return;

                const { token, error } = event.target;
                if (token) {
                    resolve(token);
                } else {
                    reject(error);
                }
                this.removeListener('token', tokenCallback);
            };
            this.addListener('token', tokenCallback);

            if (this.tokenAcquisistions[endpoint]) {
                return;
            } else {
                this.tokenAcquisistions[endpoint] = true;
            }

            this.acquireToken(endpoint)
                .catch((err) => this.emit('token', { endpoint, target: { error: err } }))
                .finally(() => delete this.tokenAcquisistions[endpoint]);
        });
    }
}
