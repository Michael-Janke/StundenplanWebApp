import React from 'react';
import NotFoundPage from './NotFoundPage';
import Loadable from 'react-loadable';
import { hideSplash } from './SplashScreen';
import { withRouter } from 'react-router';

const Loading = ({ isLoading, error, retry }) => {
    // Handle the loading state
    if (isLoading) {
        return null;
    }
    hideSplash();
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

export const asynchronize = (...postWrappers) => importFunc =>
    Loadable({
        loader: importFunc,
        loading: Loading,
        render(loaded, props) {
            const Component = loaded.default;
            hideSplash();
            return <AsynchronizedComponent
                Component={Component}
                postWrappers={postWrappers}
                {...props} />
        },
    });

function AsynchronizedComponent({ Component, postWrappers, ...other }) {
    const Comp = React.useMemo(() =>
        postWrappers.reduce((fn, current) => current(fn), Component),
        [Component, postWrappers]);
    return <Comp key={0} {...other}></Comp>
}
