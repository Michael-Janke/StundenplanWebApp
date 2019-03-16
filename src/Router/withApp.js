import React from 'react';
import AppBar from './AppBar';
import AppDrawer from './AppDrawer';

export default function withApp(Component) {
    return props => {
        return (
            <>
                <AppDrawer />
                <AppBar {...props}>
                    <Component {...props} />
                </AppBar>
            </>
        );
    };
}
