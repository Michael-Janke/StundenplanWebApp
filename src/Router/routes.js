import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import NotFoundPage from './NotFoundPage';
import { asynchronize } from "./asynchronize";
import withAuthentication from './withAuthentication';
import withApp from './withApp';

const Posts = withAuthentication('authentication',
    withApp(
        asynchronize(() => import("../Posts"))
    )
);
const PostEditor = withAuthentication('authentication',
    withApp(
        asynchronize(() => import("../Posts/Stepper/editPage"))
    )
);
const Main = withAuthentication('authentication',
    withApp(
        asynchronize(() => import("../Main"))
    )
);
const Statistics = withAuthentication('authentication',
    withApp(
        asynchronize(() => import("../Statistics"))
    )
);
const Dates = withAuthentication('public', asynchronize(() => import("../Dates")));

function Routes({ location }) {
    return (
        <>

            <Switch>
                <Route exact path="/" component={Main} />
                <Route exact path="/posts" component={Posts} />
                <Route exact path="/dates" component={Dates} />
                <Route exact path="/posts/:id" component={PostEditor} />
                <Route exact path="/admin" component={Statistics} />
                <Route exact path="/error" component={NotFoundPage} />
                <Redirect
                    to={{
                        pathname: "/error",
                        state: { referrer: location, error: 404 }
                    }}
                />
            </Switch>
        </>
    );
}

export default withRouter(Routes);