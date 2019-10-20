import React from 'react';
import { Route as BrowserRoute, Redirect } from 'react-router-dom';
import { withRouter, matchPath } from 'react-router';
import NotFoundPage from './NotFoundPage';
import { asynchronize } from './asynchronize';

const AppBar = asynchronize(() => import('./AppBar'), { hideSplash: false });
const AppDrawer = asynchronize(() => import('./AppDrawer'), { hideSplash: false });

const Posts = asynchronize(() => import('../Posts'));
const PostEditor = asynchronize(() => import('../Posts/editIndex'));
const Main = asynchronize(() => import('../Main'));
const MainAppBar = asynchronize(() => import('../Main/components/AppBar'));
const Statistics = asynchronize(() => import('../Statistics'));
const Dates = asynchronize(() => import('../Dates'));
const PublicPosts = asynchronize(() => import('../Posts/public'));
const PublicTimetable = asynchronize(() => import('../TimeTable/public'));

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
