
export class TokenAuthContext {
    constructor(token, config) {
        this.token = token;
        this.config = config;
        this.user = { upn: null, token: null };
    }


    acquireToken(resource, callback) {
        callback(null, this.token);
    }

    logOut() {
        window.location.href = "http://localhost:3000/";
    }

    getCachedToken(clientId) {
        return this.token;
    }

    getCachedUser() {
        return this.user;
    }
}