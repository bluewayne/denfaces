/**
 * Created by liujinhe on 16/8/11.
 */
import {GetTwoCharactersSuccess} from '../actions/HomeAction.js'

export default function navbar(state = [], action = {}) {
    switch (action.type) {
        case GetTwoCharactersSuccess:
        {
            return action.characters;
        }
        default:

            return state;
    }
}

