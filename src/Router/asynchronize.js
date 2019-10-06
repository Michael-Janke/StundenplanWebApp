import React from 'react';
import NotFoundPage from './NotFoundPage';
import Loadable from 'react-loadable';
import { hideSplash as hideSplash2 } from './SplashScreen';
import { withRouter } from 'react-router';

const Loading = ({ isLoading, error, retry }) => {
    // Handle the loading state
    if (isLoading) {
        return null;
    }
    hideSplash2();
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

export const asynchronize = (importFunc, { hideSplash = true } = {}) =>
    Loadable({
        loader: importFunc,
        loading: Loading,

        render(loaded, props) {
            const Component = loaded.default;
            hideSplash && hideSplash2();
            return <Component {...props} />;
        },
    });
