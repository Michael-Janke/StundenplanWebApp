import { setAuthContext } from '../storage';
import { fetchData } from '../../utils';
import AuthContext from './AuthContext';

export default class UserAuthContext extends AuthContext {
    static resources = {
        'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/':
            'https://wgmail.onmicrosoft.com/f863619c-ea91-4f1d-85f4-2f907c53963b/user_impersonation',
        'https://graph.microsoft.com/': 'https://graph.microsoft.com/mail.read',
    };

    toObject() {
        return {
            authCodes: this.authCodes,
            tokens: this.tokens,
        };
    }
    constructor(obj) {
        super();
        if (obj) {
            // copy values into this object
            super.tokens = obj.tokens || {};
            super.authCodes = typeof obj.authCodes === 'object' ? obj.authCodes : {};
        }
    }
    authCodes = {};

    /**
     * get scopes
     * @param {string} resource if null all resources are included
     */
    getScope(resource) {
        return ['offline_access', ...(resource ? [resource] : Object.values(UserAuthContext.resources))];
    }

    logOut() {
        super.logOut();
        this.authCodes = {};
        this.tokens = {};
        setAuthContext(this).then(() => {
            // wait for save completed
            window.location.replace(
                'https://login.microsoftonline.com/common/oauth2/v2.0/logout?' +
                    'post_logout_redirect_uri=' +
                    encodeURIComponent('https://wolkenberg-gymnasium.de/')
            );
        });
    }

    isLoggedIn() {
        const tokens = Object.values(this.tokens).length + Object.values(this.tokenAcquisistions).length;
        const resources = Object.values(UserAuthContext.resources).length;
        return Math.max(this.authCodes.length, tokens) >= resources;
    }

    isLoggingIn() {
        const tokens = Object.values(this.tokens).length + Object.values(this.tokenAcquisistions).length;
        const resources = Object.values(UserAuthContext.resources).length;

        return this.authCodes.length < resources - tokens;
    }

    getAuthCodeLink(resource) {
        return `https://login.microsoftonline.com/wgmail.de/oauth2/v2.0/authorize?                         
                client_id=fb82e2a9-1efd-4a8e-9ac6-92413ab4b58b
                &response_type=code
                &redirect_uri=${encodeURIComponent(window.location.href.split('?')[0].split('#')[0])}
                &response_mode=query
                &scope=${encodeURIComponent(this.getScope().join(' '))}
                &state=${encodeURIComponent(JSON.stringify({ resource, hash: window.location.hash }))}
                &domain_hint=wgmail.de
        `.replace(/ /g, '');
    }

    loadAuthCode(resource) {
        return setAuthContext(this).then(() => window.location.replace(this.getAuthCodeLink(resource)));
    }

    handleCallback(code, session_state, state) {
        const obj = { code, session_state, state: JSON.parse(decodeURIComponent(state) || '{}') };
        this.authCodes[obj.state.resource] = obj;
        setAuthContext(this);
    }

    async aquireToken(token, endpoint) {
        let refresh_token = token && token.refresh_token;
        let authCode = this.authCodes[endpoint] || {};

        if (!authCode.code && !refresh_token) {
            // reload code
            return this.loadAuthCode(endpoint);
        }
        this.authCodes[endpoint] && delete this.authCodes[endpoint];
        setAuthContext(this);

        const body = {
            code: authCode.code,
            refresh_token: authCode.code ? undefined : refresh_token,
            scope: this.getScope(UserAuthContext.resources[endpoint]).join(' '),
        };
        try {
            const response = await fetchData(`https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/token`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'Application/Json',
                },
            });
            return response;
        } catch (error) {
            // if there is a error_codes property
            // reload authCode
            if (error && error.error_codes) {
                this.authCodes = {};
                return this.loadAuthCode(endpoint);
            }
            throw error;
        }
    }
}
