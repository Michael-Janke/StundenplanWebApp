import React from 'react';
import { Route as BrowserRoute, Redirect } from 'react-router-dom';
import { withRouter, matchPath } from 'react-router';
import NotFoundPage from './NotFoundPage';
import { asynchronize } from './asynchronize';

/**
 * asynchronize without postWrappers
 */
const asynchronized = asynchronize();

const AppBar = asynchronized(() => import('./AppBar'));
const AppDrawer = asynchronized(() => import('./AppDrawer'));

const Posts = asynchronized(() => import('../Posts'));
const PostEditor = asynchronized(() => import('../Posts/editIndex'));
const DiashowCreator = asynchronized(() => import('../Posts/DiashowCreation'));
const Main = asynchronized(() => import('../Main'));
const MainAppBar = asynchronized(() => import('../Main/components/AppBar'));
const Statistics = asynchronized(() => import('../Statistics'));
const Dates = asynchronized(() => import('../Dates'));
const PublicPosts = asynchronized(() => import('../Posts/public'));
const PublicTimetable = asynchronized(() => import('../TimeTable/public'));

const Route = props => {
    const renderComponent = React.useCallback(
        routerProps => {
            return <props.component {...props} {...routerProps} />;
        },
        [props]
    );
    return <BrowserRoute {...props} render={renderComponent} component={undefined} />;
};

const routeConfig = location => (
    <>
        <Route exact path="/" component={Main} noBoxShadow appBarComponent={MainAppBar} withApp />
        <Route exact path="/public/dates" component={Dates} />
        <Route exact path="/public/posts" component={PublicPosts} />
        <Route exact path="/public/tv" component={PublicTimetable} />
        <Route exact path="/posts" component={Posts} title="InfoTafel" withApp />
        <Route path="/posts/edit/:id" component={PostEditor} title="Beitrag editieren" back withApp />
        <Route path="/posts/new/:type" component={PostEditor} title="Beitrag erstellen" back withApp />
        <Route exact path="/admin" component={Statistics} withApp />
        <Route exact path="/error" component={NotFoundPage} />
        <Redirect
            to={{
                pathname: '/error',
                state: { referrer: location, error: 404 },
            }}
            push
        />
    </>
);

class Routes extends React.Component {
    state = {};

    componentDidCatch(error, info) {
        if (process.env.NODE_ENV === 'development') {
            throw error;
        } else {
            const { location } = this.props;
            this.props.history.push({
                pathname: '/error',
                state: { referrer: location, error: 500, message: error.message + '\n' + info.componentStack },
            });
        }
    }

    render() {
        const { location } = this.props;

        let currentRoute, element, computedMatch;

        React.Children.forEach(routeConfig(location).props.children, (child, index) => {
            if (computedMatch || !React.isValidElement(child)) {
                return;
            }
            const route = child.props;
            const path = route.path || route.from;

            computedMatch = matchPath(location.pathname, { ...route, path });
            currentRoute = route;
            element = child;
        });

        let routeComponent = React.cloneElement(element, { location, computedMatch });

        // render AppBar and AppDrawer
        if (currentRoute.withApp) {
            return (
                <>
                    <AppDrawer></AppDrawer>
                    <AppBar {...currentRoute}>{routeComponent}</AppBar>
                </>
            );
        } else {
            return routeComponent;
        }
    }
}

export default withRouter(Routes);
