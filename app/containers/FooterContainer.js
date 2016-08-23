/**
 * Created by liujinhe on 16/8/5.
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Footer from '../components/Footer.js'
import * as footerAction from '../actions/FooterAction.js'

function mapStateToProps(state){
    return {
        characters:state.characters
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(footerAction,dispatch)
}

export default  connect(mapStateToProps,mapDispatchToProps)(Footer)