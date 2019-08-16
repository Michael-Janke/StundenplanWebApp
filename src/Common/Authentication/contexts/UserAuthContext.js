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
            super.authCodes = obj.authCodes || [];
        }
    }
    authCodes = [];

    /**
     * get scopes
     * @param {string} resource if null all resources are included
     */
    getScope(resource) {
        return ['offline_access', ...(resource ? [resource] : Object.values(UserAuthContext.resources))];
    }

    logOut() {
        super.logOut();
        window.location.replace(
            'https://login.microsoftonline.com/common/oauth2/v2.0/logout?' +
            'post_logout_redirect_uri=' +
            encodeURIComponent('https://wolkenberg-gymnasium.de/')
        );
        this.authCodes = [];
        setAuthContext(null);
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
                &state=${JSON.stringify({ resource })}
                &domain_hint=wgmail.de
        `.replace(/ /g, '');
    }

    loadAuthCode(resource) {
        window.location.replace(this.getAuthCodeLink(resource));
    }


    handleCallback(code, session_state, state) {
        if (!this.authCodes.find(authCode => authCode.code === code)) {
            const obj = { code, session_state, state };
            this.authCodes.push(obj);
            setAuthContext(this);
        }
    }

    async aquireToken(token, endpoint) {
        if (token) {
            var refresh_token = token.refresh_token;
        }
        // use first authCode as code is recycled from initial login
        let authCode = this.authCodes.findIndex(authCode => {
            let state = JSON.parse(authCode.state);
            return !state.resource || state.resource === endpoint;
        });
        authCode = this.authCodes.splice(authCode, 1)[0];
        if (!authCode && !refresh_token) {
            // reload code
            this.loadAuthCode(endpoint);
            return;
        }
        const { code, state } = authCode || {};
        const body = {
            code,
            refresh_token,
            state,
            scope: this.getScope(UserAuthContext.resources[endpoint]).join(' '),
        };
        const response = await fetchData(`https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/token`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'Application/Json',
            },
        });
        return response;
    }
}
