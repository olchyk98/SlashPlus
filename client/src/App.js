import React, { Component } from 'react';

import { Switch, BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router';

import { Provider } from 'react-redux';

// Pages
import Main from './pages/main';
import Profile from './pages/profile';
import Create from './pages/create';
import Palettes from './pages/palettes';

// Stuff
import Navigation from './pages/__forall__/nav';
import Alert from './pages/__forall__/alertion';
import links from './links';
import reduxStore from './rstore';
import { cookieControl } from './utils';

const ProtectedRoute = ({ path, condition, component: Component, redirect: Redirect, redirectPath, ...settings }) => (
	<Route
		path={ path }
		{ ...settings }
		component={(props) => {
            if(condition) {
                return <Component { ...props } />
            } else {
                window.history.pushState(null, null, redirectPath);
                return <Redirect { ...props } />
            }
        }}
	/>
);

// ->
class App extends Component {
    constructor(props) {
        super(props);

        this.clientID = cookieControl.get("userid");
    }

    render() {
        return(
            <Provider store={ reduxStore }>
                <BrowserRouter>
                    <>
                        <Navigation />
						<Alert />
                        <Switch>
                            <Route path={ links["HOME_PAGE"].route } exact component={ Main } />
							<ProtectedRoute
                                path={ links["ACCOUNT_PAGE"].route }
                                component={ Profile }
                                redirect={ Main }
                                redirectPath={ `${ links["HOME_PAGE"].absolute }?toauth` }
                                condition={ this.clientID }
                                exact
                            />
							<ProtectedRoute
                                path={ links["CREATE_PAGE"].route }
                                component={ Create }
                                redirect={ Main }
                                redirectPath={ `${ links["HOME_PAGE"].absolute }?toauth` }
                                condition={ this.clientID }
                                exact
                            />
							<ProtectedRoute
                                path={ links["PALETTES_PAGE"].route }
                                component={ Palettes }
                                redirect={ Main }
                                redirectPath={ `${ links["HOME_PAGE"].absolute }?toauth` }
                                condition={ this.clientID }
                                exact
                            />
                        </Switch>
                    </>
                </BrowserRouter>
            </Provider>
        );
    }
}

// <-
export default App;
