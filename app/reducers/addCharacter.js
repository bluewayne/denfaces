/**
 * Created by liujinhe on 16/8/10.
 */
import {AddCharacterSuccess,AddCharacterFail,UpdateName,UpdateGender,InvalidName,InvalidGender} from '../actions/AddCharacterAction.js'

const defaultState = {
    name: 0,
    gender: 0,
    helpBlock: '',
    nameValidationState: '',
    genderValidationState: ''
}

export default function addCharacter(state = defaultState, action = {}) {
    switch (action.type) {
        case AddCharacterSuccess:
        {
            return Object.assign({},state,{nameValidationState:action.nameValidationState,helpBlock:action.helpBlock});

        }
        case AddCharacterFail:
        {
            return Object.assign({},state,{nameValidationState:action.nameValidationState,helpBlock:action.helpBlock});

        }
        case UpdateName:
        {
            return Object.assign({},state,{name:action.name,nameValidationState:action.nameValidationState,helpBlock:action.helpBlock});

        }
        case UpdateGender:
        {
            return Object.assign({},state,{gender:action.gender,genderValidationState:action.genderValidationState});

        }
        case  InvalidName:
        {
            return Object.assign({},state,{nameValidationState:action.nameValidationState,helpBlock:action.helpBlock});

        }
        case InvalidGender:
        {
            return Object.assign({},state,{genderValidationState:action.genderValidationState,helpBlock:action.helpBlock});

        }
        default :
            return state;

    }


}