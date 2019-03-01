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


export const asynchronize = (...postWrappers) => (importFunc) => Loadable({
    loader: importFunc,
    loading: Loading,
    render(loaded, props) {
        const Component = loaded.default;
        hideSplash();
        return React.createElement(
            postWrappers.reduce((fn, current) => current(fn), Component),
            props
        );
    }
});