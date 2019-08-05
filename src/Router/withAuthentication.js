import React from 'react';
import { getAuthContext } from '../Common/Authentication/storage';
import { TokenAuthContext } from '../Common/Authentication/contexts/TokenAuthContext';

/**
 *
 * @param class
 * @param {React.Component} Component
 */
export default function withAuthentication(variant, Component) {
    return props => {
        const authContext = getAuthContext();
        if (!authContext instanceof variant) {
            throw new Error("authcontext is not a " + variant);
        }
        return <Component {...props} />;
    };
}
