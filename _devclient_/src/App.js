import React, { Component } from 'react';

import { Switch, BrowserRouter } from 'react-router-dom';
import { Route, Redirect } from 'react-router';

import { Provider } from 'react-redux';

// Pages
import Main from './pages/main';
import Profile from './pages/profile';
import Create from './pages/create';
import Palettes from './pages/palettes';
import Colors from './pages/colors';
import Fonts from './pages/fonts';
import Articles from './pages/articles';
import ArticleDisplay from './pages/articledisp';
import Verifications from './pages/controlVerification';

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
							<ProtectedRoute
                                path={ links["COLORS_PAGE"].route }
                                component={ Colors }
                                redirect={ Main }
                                redirectPath={ `${ links["HOME_PAGE"].absolute }?toauth` }
                                condition={ this.clientID }
                                exact
                            />
							<ProtectedRoute
                                path={ links["FONTS_PAGE"].route }
                                component={ Fonts }
                                redirect={ Main }
                                redirectPath={ `${ links["HOME_PAGE"].absolute }?toauth` }
                                condition={ this.clientID }
                                exact
                            />
							<ProtectedRoute
                                path={ links["ARTICLES_PAGE"].route }
                                component={ Articles }
                                redirect={ Main }
                                redirectPath={ `${ links["HOME_PAGE"].absolute }?toauth` }
                                condition={ this.clientID }
                                exact
                            />
							<ProtectedRoute
                                path={ links["ARTICLE_DISPLAY_PAGE"].route }
                                component={ ArticleDisplay }
                                redirect={ Main }
                                redirectPath={ `${ links["HOME_PAGE"].absolute }?toauth` }
                                condition={ this.clientID }
                                exact
                            />
							<ProtectedRoute
                                path={ links["VERIFICATION_PAGE"].route }
                                component={ Verifications }
                                redirect={ Main }
                                redirectPath={ `${ links["HOME_PAGE"].absolute }?toauth` }
                                condition={ this.clientID }
                                exact
                            />
							<Redirect to={ links["HOME_PAGE"].absolute } />
                        </Switch>
                    </>
                </BrowserRouter>
            </Provider>
        );
    }
}

// <-
export default App;
