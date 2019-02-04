import React from 'react';
import AppBar from './AppBar';
import AppDrawer from './AppDrawer';

export default function withApp(Component) {
    return () => {
        return (
            <>
                <AppDrawer></AppDrawer>
                <AppBar />
                <Component />
            </>
        )
    }
}