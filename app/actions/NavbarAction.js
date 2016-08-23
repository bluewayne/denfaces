/**
 * Created by liujinhe on 16/8/8.
 */

import reqwest from 'reqwest'

export function findCharacter(payload) {
    return (dispatch, getState)=> {
        $.ajax({
            url: '/api/characters/search',
            data: {name: payload.searchQuery}
        })
            .done((data) => {
                assign(payload, data);
                dispatch(findCharacterSuccess(payload));

            })
            .fail(() => {
                dispatch(findCharacterFail(payload));
            });
    }

}

export function getCharacterCount() {
    return (dispatch, getState)=> {
        $.ajax({
            type: 'GET',
            url: '/api/characters/count'
        })
            .done((data) => {
                dispatch(getCharacterCountSuccess(data))

            })
            .fail((jqXhr) => {
                dispatch(getCharacterCountFail(jqXhr))

            });
    }
}


export function findCharacterSuccess(payload) {
    payload.router.transitionTo('/characters/' + payload.characterId);
}

export function findCharacterFail(payload) {
    payload.searchForm.classList.add('shake');
    setTimeout(() => {
        payload.searchForm.classList.remove('shake');
    }, 1000);
}


export const GetCharacterCountSuccess = 'GetCharacterCountSuccess';
export const GetCharacterCountFail = 'GetCharacterCountFail';
export const UpdateOnlineUsers = 'UpdateOnlineUsers';
export const UpdateAjaxAnimation = 'UpdateAjaxAnimation';
export const UpdateSearchQuery = 'UpdateSearchQuery';


export function getCharacterCountSuccess(data) {
    var totalCharacters = data.count;

    return {type: GetCharacterCountSuccess, totalCharacters};
}

export function getCharacterCountFail(jqXhr) {
    //toastr.error(jqXhr.responseJSON.message);
    return {type: GetCharacterCountFail};

}

export function updateOnlineUsers(data) {
    var onlineUsers = data.onlineUsers;

    return {type: UpdateOnlineUsers, onlineUsers};
}

export function updateAjaxAnimation(className) {
    var ajaxAnimationClass = className; //fadein or fadeout

    return {type: UpdateAjaxAnimation, ajaxAnimationClass};

}

export function updateSearchQuery(event) {
    var searchQuery = event.target.value;
    return {type: UpdateSearchQuery, searchQuery};

}