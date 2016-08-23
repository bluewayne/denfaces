/**
 * Created by liujinhe on 16/8/15.
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import characterList from '../components/CharacterList.js'
import * as characterListAction from '../actions/CharacterListAction.js'

function mapStateToProps(state){
    return {
        characterListProps:state.characterListProps
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(characterListAction,dispatch)
}

export default  connect(mapStateToProps,mapDispatchToProps)(characterList)

