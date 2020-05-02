import { fetchData } from '../../utils';
import AuthContext from './AuthContext';

export default class UserAuthContext extends AuthContext {
    toObject() {
        return {
            tokens: this.tokens,
            refreshToken: this.refreshToken,
            upn: this.upn,
        };
    }
    constructor(obj) {
        super();
        if (obj) {
            // copy values into this object
            this.tokens = obj.tokens || {};
            this.refreshToken = obj.refreshToken;
            this.upn = obj.upn;
        }
    }

    /**
     * get scopes
     * @param {string} resource if null all resources are included
     */
    getScope(endpoint) {
        return ['offline_access', this.constructor.resources[endpoint]];
    }

    logOut() {
        super.logOut().then(() => {
            // wait for save completed
            window.location.replace(
                'https://login.microsoftonline.com/common/oauth2/v2.0/logout?' +
                    'post_logout_redirect_uri=' +
                    encodeURIComponent('https://wolkenberg-gymnasium.de/')
            );
        });
    }

    isLoggedIn() {
        return !!this.refreshToken;
    }

    getAuthCodeLink() {
        return `https://login.microsoftonline.com/wgmail.de/oauth2/v2.0/authorize?                         
                client_id=fb82e2a9-1efd-4a8e-9ac6-92413ab4b58b
                &response_type=code
                &redirect_uri=${encodeURIComponent(window.location.href.split('?')[0].split('#')[0])}
                &response_mode=query
                &scope=${encodeURIComponent(['offline_access', ...Object.values(this.constructor.resources)].join(' '))}
                &state=${encodeURIComponent(JSON.stringify({ hash: window.location.hash }))}
                &domain_hint=wgmail.de
                &login_hint=${this.upn || ''}
        `.replace(/ /g, '');
    }

    authorize() {
        return super.logOut().then(() => {
            window.location.replace(this.getAuthCodeLink());
        });
    }

    async handleCallback(code) {
        //refresh token can be used for all resources
        const endpoint = Object.keys(this.constructor.resources)[0];
        const token = await this.acquireTokenFromEndpoint(endpoint, { code });
        if (!token || !token.refresh_token) throw new Error('Anmeldetoken nicht erhalten');
        await Promise.all(
            Object.keys(this.constructor.resources).map((endpoint) =>
                this.acquireTokenFromEndpoint(endpoint, { refresh_token: token.refresh_token })
            )
        );
    }

    async acquireTokenFromEndpoint(endpoint, { code, refresh_token }) {
        const body = {
            code,
            refresh_token,
            scope: this.constructor.resources[endpoint],
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
        let refresh_token = this.refreshToken && this.refreshToken.refresh_token;

        if (!refresh_token) {
            // reload code
            await this.authorize(endpoint);
        }
        try {
            await this.acquireTokenFromEndpoint(endpoint, { refresh_token });
        } catch (err) {
            // if there is a error_codes property
            if (err && err.error_codes) {
                setTimeout(() => this.authorize(), 3000);
                throw err;
            }
            throw err;
        }
    }
}
