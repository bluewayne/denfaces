
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Navbar from '../components/Navbar.js'
import * as navbarAction from '../actions/NavbarAction.js'

function mapStateToProps(state){
    return {
        navbar:state.navbar
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(navbarAction,dispatch)
}

export default  connect(mapStateToProps,mapDispatchToProps)(Navbar)

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(function() {
        clearInterval(timer);
    });
}