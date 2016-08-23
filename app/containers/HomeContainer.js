/**
 * Created by liujinhe on 16/8/5.
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Home from '../components/Home.js'
import * as HomeAction from '../actions/HomeAction.js'

function mapStateToProps(state){
    return {
        homeCharacters:state.homeCharacters
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(HomeAction,dispatch)
}

export default  connect(mapStateToProps,mapDispatchToProps)(Home)