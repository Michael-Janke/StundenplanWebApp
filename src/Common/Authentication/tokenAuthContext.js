
export class TokenAuthContext {
    constructor(token) {
        this.token = token;
    }

    toObject() {
        return {
            token: this.token
        }
    }

    isAllowed() {
        return false;
    }

    async getToken(endpoint) {
        return { access_token: this.token };
    }

    disallowAuthentication() {
        
    }

    allowAuthentication() {
        
    }

    login() {

    }

    logOut() {
        throw new Error("logging out not supported");
    }

    isLoggedIn() {
        return true;
    }

    isLoggingIn() {
        return true;
    }
}