
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import addCharacter from '../components/AddCharacter.js'
import * as addCharacterAction from '../actions/AddCharacterAction.js'

function mapStateToProps(state){
    return {
        addCharacterProps:state.addCharacterProps
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(addCharacterAction,dispatch)
}

export default  connect(mapStateToProps,mapDispatchToProps)(addCharacter)

