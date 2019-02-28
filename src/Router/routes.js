import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import NotFoundPage from './NotFoundPage';
import { asynchronize } from "./asynchronize";
import withAuthentication from './withAuthentication';
import withApp from './withApp';

/**
 * asynchronize without postWrappers
 */
const asynchronized = asynchronize();
/*
* withAuthentication('authentication', withApp())
* is authenticated route with appbar
*/
const withAuth = (loader) => withAuthentication('authentication', asynchronize(withApp)(loader));

const Posts = withAuth(() => import("../Posts"));
const PostEditor = withAuth(() => import("../Posts/Stepper/editPage"));
const Main = withAuth(() => import("../Main"));
const Statistics = withAuth(() => import("../Statistics"));
const Dates = withAuthentication('public', asynchronized(() => import("../Dates")));
const PublicTimetable = withAuthentication('token', asynchronized(() => import("../TimeTable/public")));

class Routes extends React.Component {

    state = {};

    componentDidCatch(error, info) {
        if (process.env.NODE_ENV === 'development') {
            throw error;
        } else {
            const { location } = this.props;
            this.props.history.push({
                pathname: '/error',
                state: { referrer: location, error: 500, message: error.message + "\n" + info.componentStack }
            });
        }
    }

    render() {
        const { location } = this.props;
        return (
            <>
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route exact path="/posts" component={Posts} />
                    <Route exact path="/public/dates" component={Dates} />
                    <Route exact path="/public/tv" component={PublicTimetable} />
                    <Route exact path="/posts/:id" component={PostEditor} />
                    <Route exact path="/admin" component={Statistics} />
                    <Route exact path="/error" component={NotFoundPage} />
                    <Redirect
                        to={{
                            pathname: "/error",
                            state: { referrer: location, error: 404 }
                        }}
                        push
                    />
                </Switch>
            </>
        );
    }
}

export default withRouter(Routes);