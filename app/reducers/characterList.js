/**
 * Created by liujinhe on 16/8/15.
 */
import {GetCharactersSuccess} from '../actions/CharacterListAction.js'


export default  function characterList(state = [], action = {}) {

    switch (action.type) {
        case GetCharactersSuccess:
            return action.characters;
        default :
            return state;


    }


}