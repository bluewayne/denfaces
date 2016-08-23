/**
 * Created by liujinhe on 16/8/5.
 */

import {GetTopCharactersSuccess,GetTopCharactersFail} from '../actions/FooterAction.js'

export default function footer(state = [], action={}) {
    switch (action.type) {
        case GetTopCharactersSuccess:{

            return action.characters;
        }
        default:

            return state;
    }
}

export  function characters(state = [], action={}) {
    switch (action.type) {
        case GetTopCharactersSuccess:{

            return action.characters;
        }
        default:

            return state;
    }
}


