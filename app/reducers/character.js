/**
 * Created by liujinhe on 16/8/11.
 */
import {ReportSuccess,GetCharacterSuccess} from '../actions/CharacterActions.js'

const defaultState = {
    characterId: 0,
    name: 'TBD',
    race: 'TBD',
    bloodline: 'TBD',
    gender: 'TBD',
    wins: 0,
    losses: 0,
    winLossRatio: 0,
    isReported: false
}

export default function character(state = defaultState, action = {}) {

    //console.log('character  reducers  action.type ------:'+action.type,"color:blue");

    switch (action.type) {
        case ReportSuccess:
        {
            console.log('character ReportSuccess reducers   ------:'+action.characterProps.characterId+''+action.characterProps.gender+''+action.characterProps.random+''+action.characterProps.bloodline,"color:blue");

            return Object.assign({},action.characterProps);

        }
        case GetCharacterSuccess:
        {

            //Object.assign({},state,{searchQuery:action.searchQuery})

            console.log('character GetCharacterSuccess reducers   ------:'+action.characterProps.characterId+''+action.characterProps.gender+''+action.characterProps.random+''+action.characterProps.bloodline,"color:blue");

            return Object.assign({},action.characterProps);

        }
        default :
            //console.log('character default reducers   ------:'+state.characterId+''+state.gender+''+state.random+''+state.bloodline,"color:blue");

            return state;

    }


}