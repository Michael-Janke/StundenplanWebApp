
export class TokenAuthContext {
    constructor(token) {
        this.token = token;
    }

    toObject() {
        return {
            token: this.token
        }
    }

    isAllowed(...variants) {
        return variants.indexOf('token') !== -1
    }

    async getToken(endpoint) {
        return { access_token: this.token };
    }

    allow() {
        
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