
export class TokenAuthContext {
    constructor(token) {
        this.token = token;
    }
    async getToken(endpoint) {
        return this.token;
    }

    login() {
        
    }

    logOut() {
        throw new Error("logging out not supported");
    }

    isLoggedIn() {
        return true;
    }
}