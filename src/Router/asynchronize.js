import React, { useEffect } from 'react';
import NotFoundPage from './NotFoundPage';
import Loadable from 'react-loadable';
import { hideSplash } from './SplashScreen';
import { withRouter } from 'react-router';

var loadingCount = 0;

const Loading = ({ isLoading, error, retry }) => {
    useEffect(() => {
        loadingCount++;
        return () => {
            loadingCount--;
            if (loadingCount === 0) hideSplash();
        };
    }, []);
    // Handle the loading state
    if (isLoading) {
        return null;
    }
    // Handle the error state
    console.error(error);
    if (error) {
        return React.createElement(
            withRouter(() => <NotFoundPage error={400} retry={retry} message={error.message} />)
        );
    } else {
        return null;
    }
};

export const asynchronize = (importFunc) =>
    Loadable({
        loader: importFunc,
        loading: Loading,

        render(loaded, props) {
            const Component = loaded.default;

            return <Component {...props} />;
        },
    });
