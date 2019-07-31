import { setAuthContext } from './storage';
import { EventEmitter } from 'events';
import { timeout } from '../utils';
import trackError from '../trackError';

const client_id = 'ef085784-4829-427c-ab32-5e90502a1dde';

export class TokenAuthContext extends EventEmitter {
    static resources = {
        'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/':
            'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/.default',
        'https://graph.microsoft.com/': 'https://graph.microsoft.com/.default',
    };

    constructor(client_secret) {
        super();
        this.client_secret = client_secret;
    }

    tokens = {};
    tokenAcquisistions = {};

    logOut() {
        this.tokens = {};
        this.tokenAcquisistions = [];
    }

    toObject() {}

    isLoggedIn() {
        const tokens = Object.values(this.tokens).length + Object.values(this.tokenAcquisistions).length;
        const resources = Object.values(TokenAuthContext.resources).length;
        return tokens >= resources;
    }

    isLoggingIn() {
        return true;
    }

    allow(variant) {
        return (this.allowed = variant);
    }

    /**
     *
     * @param  {...('authentication' | 'public' | 'token')} variant
     */
    isAllowed(...variant) {
        if (!this.client_secret) {
            return false;
        }
        if (this.allowed === undefined) {
            return undefined;
        }
        if (variant && variant.length) {
            return variant.indexOf(this.allowed) !== -1;
        }
        return !!this.allowed;
    }

    login() {}

    getToken(endpoint) {
        return new Promise(async (resolve, reject) => {
            const token = this.tokens[endpoint];
            if (token) {
                var expires_in = token.expires_in;
                // check if not expired
                const diff = Math.round((Date.now() - token.acquired) / 1000);
                if (expires_in > diff) {
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
                const body = {
                    client_secret: this.client_secret,
                    client_id,
                    scope: TokenAuthContext.resources[endpoint],
                };
                const response = await timeout(
                    6000,
                    fetch(`https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/token`, {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: {
                            'Content-Type': 'Application/Json',
                        },
                    })
                );
                const newToken = await response.json();
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
