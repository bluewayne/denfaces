/**
 * Created by liujinhe on 16/8/15.
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import stats from '../components/Stats.js'
import * as statsAction from '../actions/StatsAction.js'

function mapStateToProps(state){
    return {
        statsProps:state.statsProps
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(statsAction,dispatch)
}

export default  connect(mapStateToProps,mapDispatchToProps)(stats)

