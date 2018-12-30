import { setAuthContext } from './storage';


export class AuthenticationContext {
    resources = {
        'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/':
            'https://wgmail.onmicrosoft.com/f863619c-ea91-4f1d-85f4-2f907c53963b/user_impersonation',
        'https://graph.microsoft.com/': 'https://graph.microsoft.com/mail.read'
    };

    tokens = {};
    
    tokenAcquisistions = {};

    constructor(obj) {
        if (obj) {
            // copy values into this object
            Object.entries(obj).forEach(([key, value]) => this[key] = value);
        }
    }

    /**
     * get scopes
     * @param {string} resource if null all resources are included
     */
    getScope(resource) {
        return [
            'offline_access',
            ...(resource ? [resource] : Object.values(this.resources)),
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
        );
    }
    login() {
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
        this.code = code;
        this.session_state = session_state;
        this.state = state;
        setAuthContext(this);
    }

    cleanupCode() {
        // as soon as all tokens are received, code can be removed
        if (Object.keys(this.tokens).length >= Object.keys(this.resources).length) {
            this.code = null;
            this.session_state = null;
            this.state = null;
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
                scope: this.getScope(this.resources[endpoint]).join(" ")
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
                // an error occured
                this.tokens[endpoint] = null;
                this.tokenAcquisistions[endpoint].forEach(listener => listener(null, newToken));
                this.tokenAcquisistions[endpoint] = null;
                reject(newToken);

            }
        });
    }
}