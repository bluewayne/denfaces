/**
 * Created by liujinhe on 16/8/2.
 */
import React from 'react';
import {Route,IndexRoute,Router,browserHistory} from 'react-router';

import App from './components/App';
import Home from './containers/HomeContainer.js';
import AddCharacter from './containers/AddCharacterContainer.js';
import Character from './containers/CharacterContainer.js';
import CharacterList from './containers/CharacterListContainer.js';
import Stats from './containers/StatsContainer.js';

//
//export default (
////<Route component={App}>
////    <Route path='/' component={Home} />
////    </Route>
//
//
//<Route path="/" component={App}>
//    <IndexRoute component={Home}/>
//    </Route>
//
//
//
//);
//


//const Container = (props) => {
//    return (
//        <div>{props.children}</div>
//    );
//};

const routes = (
    <Router history={browserHistory}>


        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path='/add' component={AddCharacter} />
            <Route path='/characters/:id' component={Character} />
            <Route path='/stats' component={Stats} />
            <Route path='/shame' component={CharacterList} />

        </Route>

    </Router>
);

export default routes;