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
							<Route path={ links["ACCOUNT_PAGE"].route } exact component={ Profile } />
							<Route path={ links["CREATE_PAGE"].route } exact component={ Create } />
							<Route path={ links["PALETTES_PAGE"].route } exact component={ Palettes } />
							<Route path={ links["COLORS_PAGE"].route } exact component={ Colors } />
							<Route path={ links["FONTS_PAGE"].route } exact component={ Fonts } />
							<Route path={ links["ARTICLES_PAGE"].route } exact component={ Articles } />
							<Route path={ links["ARTICLE_DISPLAY_PAGE"].route } exact component={ ArticleDisplay } />
							<Route path={ links["VERIFICATION_PAGE"].route } exact component={ Verifications } />
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
