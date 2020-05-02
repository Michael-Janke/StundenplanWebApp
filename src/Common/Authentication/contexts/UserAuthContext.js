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
            tokens: this.tokens,
        };
    }
    constructor(obj) {
        super();
        if (obj) {
            // copy values into this object
            super.tokens = obj.tokens || {};
        }
    }

    /**
     * get scopes
     * @param {string} resource if null all resources are included
     */
    getScope(resource) {
        return ['offline_access', ...(resource ? [resource] : Object.values(UserAuthContext.resources))];
    }

    logOut() {
        super.logOut();
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
        return tokens >= resources;
    }

    logIn() {
        const needTokenFor = Object.keys(UserAuthContext.resources).filter((endpoint) => !this.tokens[endpoint]);
        const endpoint = needTokenFor.pop(); //one after another
        if (endpoint) {
            this.loadAuthCode(endpoint);
        }
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
        window.location.replace(this.getAuthCodeLink(resource));
    }

    async handleCallback(code, session_state, state) {
        const obj = { code, session_state, state: JSON.parse(decodeURIComponent(state) || '{}') };
        const endpoint = obj.state.resource;
        await this.acquireTokenFromEndpoint(endpoint, { code });
        return;
    }

    async acquireTokenFromEndpoint(endpoint, { code, refresh_token }) {
        const body = {
            code,
            refresh_token,
            scope: this.getScope(UserAuthContext.resources[endpoint]).join(' '),
        };
        const token = await fetchData(`https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/token`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'Application/Json',
            },
        });
        await this.setToken(token, endpoint);
        return token;
    }

    async acquireToken(endpoint) {
        let refresh_token = this.tokens[endpoint] && this.tokens[endpoint].refresh_token;

        if (!refresh_token) {
            // reload code
            await this.loadAuthCode(endpoint);
        }
        try {
            await this.acquireTokenFromEndpoint(endpoint, { refresh_token });
        } catch (err) {
            // if there is a error_codes property
            if (err && err.error_codes) {
                this.deleteToken(endpoint, err);
                setTimeout(() => this.logIn(), 3000);
                throw err;
            }
            throw err;
        }
    }
}
