import React from 'react';
import Router from 'react-router';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import routes from './routes';
import configureStore from './store';
import Footer from './containers/FooterContainer.js';
import Navbar from './containers/NavbarContainer.js';


//React.render(routes, Router.HistoryLocation, function(Handler) {
//    React.render(<Handler />, document.getElementById('app'));
//});


const store = configureStore()


ReactDOM.render((
    <Provider store={store}>
        <div>
            {routes}
        </div>

    </Provider>


), document.getElementById('app'));



if(module.hot) {
    module.hot.accept();
}
//if (module.hot) {
//    module.hot.accept();
//    module.hot.dispose(function() {
//        clearInterval(timer);
//    });
//}
