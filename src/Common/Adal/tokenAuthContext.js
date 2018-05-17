
export class TokenAuthContext {
    constructor(token) {
        this.token = token;
    }


    acquireToken(resource, callback) {
        callback(null, this.token);
    }

    logOut() {
        window.location.href = "http://localhost:3000/";
    }
}