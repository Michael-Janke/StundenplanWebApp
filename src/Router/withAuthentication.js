import React from 'react';
import { getAuthContext } from "../Common/Authentication/storage";
import { TokenAuthContext } from '../Common/Authentication/tokenAuthContext';

/**
 * 
 * @param {'public' | 'authentication' | 'token'} variant 
 * @param {React.Component} Component 
 */
export default function withAuthentication(variant, Component) {
    return () => {
        const authContext = getAuthContext();
        authContext.allow(variant);
        if (variant === 'authentication') {
            authContext.login();
            if (authContext.isLoggingIn() || authContext.isLoggedIn()) {
                return <Component />;
            }
            return null;
        } else {
            if (variant === 'token') {
                if (!(authContext instanceof TokenAuthContext)) {
                    throw new Error('authContext is not a TokenAuthContext');
                }
            }
            return <Component />
        }
    }
}
