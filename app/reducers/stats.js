/**
 * Created by liujinhe on 16/8/15.
 */

import {GetStatsSuccess} from '../actions/StatsAction.js'

const defaultState = {
    leadingRace: {race: 'Unknown', count: 0},
    leadingBloodline: {bloodline: 'Unknown', count: 0},
    amarrCount: 0,
    caldariCount: 0,
    gallenteCount: 0,
    minmatarCount: 0,
    totalVotes: 0,
    femaleCount: 0,
    maleCount: 0,
    totalCount: 0
}

export default function stats(state = defaultState, action = {}) {
    switch (action.type) {
        case GetStatsSuccess:
            return action.stats;
        default :
            return state;
    }
}