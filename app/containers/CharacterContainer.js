/**
 * Created by liujinhe on 16/8/11.
 */

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import character from '../components/Character.js'
import * as characterAction from '../actions/CharacterActions.js'

function mapStateToProps(state){
    return {
        characterProps:state.characterProps
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(characterAction,dispatch)
}

export default  connect(mapStateToProps,mapDispatchToProps)(character)

