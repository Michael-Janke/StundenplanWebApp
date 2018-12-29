import React from 'react';
import NotFoundPage from './NotFoundPage';
import Loadable from "react-loadable";
import { hideSplash } from './SplashScreen';
import { withRouter } from 'react-router';

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
        return React.createElement(withRouter(<NotFoundPage error={400} retry={retry} />));
    }
    else {
        return null;
    }
};

const withSplashScreen = (importFunc) => {
    return importFunc().then(component => {
        hideSplash();
        return component;
    });
}

export const asynchronize = (importFunc) => Loadable({
    loader: () => withSplashScreen(importFunc),
    loading: Loading,
});