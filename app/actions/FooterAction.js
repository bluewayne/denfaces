/**
 * Created by liujinhe on 16/8/5.
 */

export function getTopCharacters() {
    return (dispatch, getState)=> {

        $.ajax({type: 'GET', url: '/api/characters/top'})
            .done((data) => {
                dispatch(getTopCharactersSuccess(data));
            })
            .fail((jqXhr) => {
                dispatch(getTopCharactersFail(jqXhr));
            });

    }
}

export const GetTopCharactersSuccess = 'GetTopCharactersSuccess';
export const GetTopCharactersFail = 'GetTopCharactersFail';

export function getTopCharactersSuccess(data) {
    var characters = data.slice(0, 5);

    return {type: GetTopCharactersSuccess, characters};
}

export function getTopCharactersFail(jqXhr) {
    //toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    //

    var characters = [];

    return {type: GetTopCharactersFail, characters};

}





