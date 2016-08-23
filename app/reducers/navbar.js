/**
 * Created by liujinhe on 16/8/8.
 */
import {GetCharacterCountSuccess,GetCharacterCountFail,UpdateOnlineUsers,UpdateAjaxAnimation,UpdateSearchQuery} from '../actions/NavbarAction.js'
const defaultState={
    totalCharacters : 0,
    onlineUsers : 0,
    searchQuery : '',
    ajaxAnimationClass : ''
}

export default function navbar(state = defaultState, action = {}) {
    switch (action.type) {
        case GetCharacterCountSuccess:
        {
            return Object.assign({},state,{totalCharacters:action.totalCharacters});

        }
        case UpdateOnlineUsers:
        {
            return Object.assign({},state,{onlineUsers:action.onlineUsers});

        }
        case UpdateAjaxAnimation:
        {
            return Object.assign({},state,{ajaxAnimationClass:action.ajaxAnimationClass});

        }
        case UpdateSearchQuery:
        {
            return Object.assign({},state,{searchQuery:action.searchQuery});

        }
        default:

            return state;
    }
}


//
//export  function totalCharacters(state = [], action={}) {
//    switch (action.type) {
//        case GetTopCharactersSuccess:{
//            console.log('action.characters  ----:');
//
//            return action.characters;
//
//        }
//        default:
//
//            console.log('state  :'+state);
//            return state;
//    }
//}
//
//
//export  function onlineUsers(state = [], action={}) {
//    switch (action.type) {
//        case GetTopCharactersSuccess:{
//            console.log('action.characters  ----:');
//
//            return action.characters;
//
//        }
//        default:
//
//            console.log('state  :'+state);
//            return state;
//    }
//}
//
//
//export  function searchQuery(state = [], action={}) {
//    switch (action.type) {
//        case GetTopCharactersSuccess:{
//            console.log('action.characters  ----:');
//
//            return action.characters;
//
//        }
//        default:
//
//            console.log('state  :'+state);
//            return state;
//    }
//}
//
//
//export  function ajaxAnimationClass(state = [], action={}) {
//    switch (action.type) {
//        case GetTopCharactersSuccess:{
//            console.log('action.characters  ----:');
//
//            return action.characters;
//
//        }
//        default:
//
//            console.log('state  :'+state);
//            return state;
//    }
//}