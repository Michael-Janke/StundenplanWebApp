import { setAuthContext } from './storage';
import { EventEmitter } from 'events';


export class AuthenticationContext extends EventEmitter {
    static resources = {
        'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/':
            'https://wgmail.onmicrosoft.com/f863619c-ea91-4f1d-85f4-2f907c53963b/user_impersonation',
        'https://graph.microsoft.com/': 'https://graph.microsoft.com/mail.read'
    };

    static isIFrame() {
        return window !== window.parent;
    }

    toObject() {
        return {
            authCodes: this.authCodes,
            tokens: this.tokens,
        }
    }
    constructor(obj) {
        super();
        if (obj) {
            // copy values into this object
            this.tokens = obj.tokens;
            this.authCodes = obj.authCodes;
        }
    }

    tokens = {};

    authCodes = [];

    tokenAcquisistions = [];

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
            !!this.authCodes.length
            || Object.keys(this.tokens).length
            || Object.keys(this.tokenAcquisistions).length
        );
    }

    getAuthCodeLink() {
        return `https://login.microsoftonline.com/wgmail.de/oauth2/v2.0/authorize?                         
                client_id=fb82e2a9-1efd-4a8e-9ac6-92413ab4b58b
                &response_type=code
                &redirect_uri=${encodeURIComponent(window.location.href.split("?")[0].split("#")[0])}
                &response_mode=query
                &scope=${encodeURIComponent(this.getScope().join(' '))}
                &state=12345
        `.replace(/ /g, "");
    }

    getAuthCodeIframe() {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            const timeoutListener = setTimeout(reject, 1000 * 5);
            this.on('code', (code) => {
                clearTimeout(timeoutListener);
                iframe.remove();
                if (code) {
                    resolve(code);
                } else {
                    reject();
                }
            });
            iframe.src = this.getAuthCodeLink();
            iframe.style.width = 0;
            iframe.style.height = 0;
            iframe.style.borderWidth = 0;
            iframe.style.display = 'block';
            document.body.appendChild(iframe);

        });
    }

    login() {
        // invalidate current tokens, in fact we get new access tokens soon
        this.tokens = {};
        this.tokenAcquisistions = [];
        setAuthContext(this);
        window.location.replace(this.getAuthCodeLink());
    }

    handleCallback(code, session_state, state) {
        if (!this.authCodes.find(authCode => authCode.code === code)) {
            const obj = { code, session_state, state };
            this.authCodes.push(obj);
            this.emit('code', obj);
            setAuthContext(this);
        }
    }

    getToken(endpoint) {
        return new Promise(async (resolve, reject) => {
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
            this.on('token', (event) => {
                if (event.endpoint === endpoint) {
                    const { token, error } = event.target;
                    if (token) {
                        resolve(token);
                    } else {
                        reject(error);
                    }
                }
            });
            let activeTokenAcquisition = this.tokenAcquisistions.indexOf(endpoint) !== -1;
            if (!activeTokenAcquisition) {
                this.tokenAcquisistions.push(endpoint);
                console.debug("new acquisition for", endpoint);
            } else {
                return;
            }
            // use first authCode as code is recycled from initial login
            let authCode = this.authCodes.splice(0, 1)[0];
            if (!authCode) {
                // second authCode need to be fetched in background to speed up app
                authCode = await this.getAuthCodeIframe();
                this.authCodes.splice(this.authCodes.indexOf(authCode), 1);
            }
            const { code, state } = authCode;
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
                this.emit('token', { endpoint, target: { token: newToken } })
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
                this.emit('token', { endpoint, target: { error: newToken } })
                setAuthContext(this);
            }
        });
    }
}