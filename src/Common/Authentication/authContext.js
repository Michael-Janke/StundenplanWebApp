import { setAuthContext } from './storage';


export class AuthenticationContext {
    static resources = {
        'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/':
            'https://wgmail.onmicrosoft.com/f863619c-ea91-4f1d-85f4-2f907c53963b/user_impersonation',
        'https://graph.microsoft.com/': 'https://graph.microsoft.com/mail.read'
    };

    toObject() {
        return {
            tokens: this.tokens,
            code: this.code,
            state: this.state,
            session_state: this.session_state,
            tokensReceived: this.tokensReceived
        }
    }
    constructor(obj) {
        if (obj) {
            // copy values into this object
            this.tokens = obj.tokens;
            this.code = obj.code;
            this.state = obj.state;
            this.session_state = obj.session_state;
            this.tokensReceived = obj.tokensReceived;
        }
    }

    tokens = {};

    tokenAcquisistions = {};

    tokensReceived = false;

    /**
     * get scopes
     * @param {string} resource if null all resources are included
     */
    getScope(resource) {
        return [
            'offline_access',
            ...(resource ? [resource] : Object.values(AuthenticationContext.resources)),
        ]
    }

    logOut() {
        window.location.replace(`
        https://login.microsoftonline.com/common/oauth2/v2.0/logout?
            post_logout_redirect_uri=${encodeURIComponent("https://wolkenberg-gymnasium.de/")}
        `.replace(/ /g, ""));
        this.tokens = [];
        this.tokenAcquisistions = [];
        this.code = null;
        this.state = null;
        this.session_state = null;
        setAuthContext(null);
    }

    isLoggedIn() {
        return (
            !!this.code
            || Object.keys(this.tokens).length
            || Object.keys(this.tokenAcquisistions).length
            || this.tokensReceived
        );
    }
    login() {
        // invalidate current tokens, in fact we get new access tokens soon
        this.tokens = {};
        this.tokenAcquisistions = {};
        this.tokensReceived = false;
        setAuthContext(this);

        window.location.replace(`
        https://login.microsoftonline.com/wgmail.de/oauth2/v2.0/authorize?                         
                client_id=fb82e2a9-1efd-4a8e-9ac6-92413ab4b58b
                &response_type=code
                &redirect_uri=${encodeURIComponent(window.location.href.split("?")[0].split("#")[0])}
                &response_mode=query
                &scope=${encodeURIComponent(this.getScope().join(' '))}
                &state=12345
        `.replace(/ /g, ""));
    }

    handleCallback(code, session_state, state) {
        if (!this.code && !this.tokensReceived) {
            this.code = code;
            this.session_state = session_state;
            this.state = state;
            setAuthContext(this);
        }
    }

    cleanupCode() {
        // as soon as all tokens are received, code can be removed
        if (Object.keys(this.tokens).length >= Object.keys(AuthenticationContext.resources).length) {
            this.code = null;
            this.session_state = null;
            this.state = null;
            this.tokensReceived = true;
            setAuthContext(this);
        }
    }

    getToken(endpoint) {
        let tokenAcquisition = this.tokenAcquisistions[endpoint];
        if (!tokenAcquisition) {
            this.tokenAcquisistions[endpoint] = [];
            console.debug("new acquisition for", endpoint);
        }

        return new Promise(async (resolve, reject) => {
            const { code, state } = this;
            const token = this.tokens[endpoint];
            if (token) {
                var refresh_token = token.refresh_token;
                var expires_in = token.expires_in;
                // check if not expired
                const diff = Math.round((Date.now() - token.acquired) / 1000);
                if (expires_in > diff) {
                    resolve(token);
                    return;
                }
            }
            if (tokenAcquisition) {
                tokenAcquisition.push((token, error) => {
                    if (token) {
                        resolve(token);
                    } else {
                        reject(error);
                    }
                });
                return;
            }

            if (!code && !refresh_token) {
                console.debug("log in out of not having code");
                this.login();
                return;
            }
            const body = {
                code,
                refresh_token,
                state,
                scope: this.getScope(AuthenticationContext.resources[endpoint]).join(" ")
            };
            const response = await fetch(`https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/token`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "Application/Json"
                }
            });
            const newToken = await response.json();
            console.debug("got token for endpoint ", endpoint, newToken);
            if (!newToken.error) {
                newToken.acquired = Date.now();
                this.tokens[endpoint] = newToken;
                this.tokenAcquisistions[endpoint].forEach(listener => listener(newToken));
                this.tokenAcquisistions[endpoint] = null;
                resolve(newToken);
                this.cleanupCode();
                setAuthContext(this);
            } else {
                const authCodeExpired = newToken.error_codes.indexOf(70008) !== -1;
                if (authCodeExpired) {
                    // get new authCode
                    this.login();
                    return;
                }
                // an error occured
                this.tokens[endpoint] = null;
                this.tokenAcquisistions[endpoint].forEach(listener => listener(null, newToken));
                this.tokenAcquisistions[endpoint] = null;
                reject(newToken);
                setAuthContext(this);
            }
        });
    }
}