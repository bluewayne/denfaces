/**
 * Created by liujinhe on 16/8/15.
 */

export const GetCharactersSuccess='GetCharactersSuccess';


export function getCharactersSuccess(data) {
    let characters = data;

    console.log('getCharactersSuccess characters :'+characters.length);

    return {type:GetCharactersSuccess,characters}


}

export function getCharactersFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);

}

export function getCharacters(payload) {
    let url = '/api/characters/top';
    let params = {
        race: payload.race,
        bloodline: payload.bloodline
    };

    if (payload.category === 'female') {
        params.gender = 'female';
    } else if (payload.category === 'male') {
        params.gender = 'male';
    }

    if (payload.category === 'shame') {
        url = '/api/characters/shame';
    }

    return (dispatch,getState)=>{
        $.ajax({url: url, data: params})
            .done((data) => {
                dispatch(getCharactersSuccess(data));
            })
            .fail((jqXhr) => {
                dispatch(getCharactersFail(jqXhr));
            });
    }


}