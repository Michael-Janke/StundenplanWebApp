import React from 'react';
import NotFoundPage from './NotFoundPage';
import Loadable from "react-loadable";

function showSplash() {
    const splashScreen = document.getElementById('splash-screen');
    splashScreen.className = "";
}

function hideSplash() {
    const splashScreen = document.getElementById('splash-screen');
    splashScreen.className = "ending";
    setTimeout(() => splashScreen.className = "ended", 300);
}

const Loading = ({ isLoading, error, retry }) => {
    // Handle the loading state
    if (isLoading) {
        console.log("is loading");
        return null;
    }
    hideSplash();
    // Handle the error state
    console.error(error);
    if (error) {
        return <NotFoundPage error={400} retry={retry} />;
    }
    else {
        return null;
    }
};

const splashScreen = (importFunc) => {
    showSplash();
    return importFunc().then(component => {
        hideSplash();
        return component;
    });
}

export const asynchronize = (importFunc) => Loadable({
    loader: () => splashScreen(importFunc),
    loading: Loading,
});