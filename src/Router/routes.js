import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import NotFoundPage from './NotFoundPage';
import { asynchronize } from "./asynchronize";

import AppBar from './AppBar';
import AppDrawer from './AppDrawer';
const Posts = asynchronize(() => import("../Posts"));
const PostEditor = asynchronize(() => import("../Posts/Stepper/editPage"));
const Main = asynchronize(() => import("../Main"));
const Statistics = asynchronize(() => import("../Statistics"));

function Routes({location}) {
    return (
        <>
            <AppDrawer></AppDrawer>
            <AppBar />
            <Switch>
                <Route exact path="/" component={Main} />
                <Route exact path="/posts" component={Posts} />
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