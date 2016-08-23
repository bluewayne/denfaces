/**
 * Created by liujinhe on 16/8/2.
 */
import React from 'react';
import {RouteHandler} from 'react-router';
import configureStore from '../store';
import { Provider } from 'react-redux'
import Navbar from '../containers/NavbarContainer.js'
import Footer from '../containers/FooterContainer.js'
import Stats from '../containers/StatsContainer.js'


const store = configureStore()


class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <div>
                    <Navbar/>

                    <div className="content">
                        {this.props.children}
                    </div>


                    <Footer/>

                </div>
            </Provider>
        );
    }
}

export default App;