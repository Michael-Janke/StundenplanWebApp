import React from 'react';
import { getAuthContext } from "../Common/Authentication/storage";

/**
 * 
 * @param {'public' | 'authentication'} variant 
 * @param {React.Component} Component 
 */
export default function withAuthentication(variant, Component) {
    return () => {
        const authContext = getAuthContext();
        if (variant === 'public') {
            authContext.disallowAuthentication();
            return <Component />
        } else {
            authContext.allowAuthentication();
            authContext.login();
            if (authContext.isLoggingIn() || authContext.isLoggedIn()) {
                return <Component />;
            }
            return null;
        }
    }
}
