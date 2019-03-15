import React, { Component } from 'react';

import { Switch, BrowserRouter } from 'react-router-dom';
import { Route, Redirect } from 'react-router';

// Pages
import Main from './pages/main';

// Stuff
import Navigation from './pages/__forall__/nav';
import links from './links';

const AuthRoute = ({ component: Component, elsePath, condition, ...settings }) => (
    <Route
        { ...settings }
        render={(props) => {
            if(condition) return <Component { ...props } />
            else return <Redirect to={ elsePath } />
        }}
    />    
)

// ->
class App extends Component {
    render() {
        return(
            <BrowserRouter>
                <>
                    <Navigation />
                    <Switch>
                        <Route path={ links["HOME_PAGE"].absolute } component={ Main } />
                    </Switch>
                </>
            </BrowserRouter>
        );
    }
}

// <-
export default App;