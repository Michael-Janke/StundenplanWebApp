import { setAuthContext } from '../storage';
import { EventEmitter } from 'events';
import trackError from '../../trackError';

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
        Object.values(this.tokens).forEach(token => token.acquired = 0);
    }

    toObject() {}

    isLoggedIn() {}

    isLoggingIn() {}

    async aquireToken(token, endpoint) { }
    
    checkToken(token) {
        var expires_in = token.expires_in;
        // check if not expired
        const diff = Math.round((Date.now() - token.acquired) / 1000);
        return expires_in > diff;
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
            const tokenCallback = event => {
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

            try {
                console.debug('new token for endpoint ', endpoint, token);
                const newToken = await this.aquireToken(token, endpoint);
                console.debug('got token for endpoint ', endpoint, newToken);
                newToken.acquired = Date.now();
                this.tokens[endpoint] = newToken;
                this.emit('token', { endpoint, target: { token: newToken } });
                setAuthContext(this);
                delete this.tokenAcquisistions[endpoint];
            } catch (error) {
                // an error occured
                trackError({ error, code: 1000 });
                this.emit('token', { endpoint, target: { error } });
                delete this.tokenAcquisistions[endpoint];
            }
        });
    }
}
