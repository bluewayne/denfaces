/**
 * Created by liujinhe on 16/8/11.
 */

export const GetTwoCharactersSuccess = "GetTwoCharactersSuccess";

export function getTwoCharactersSuccess(data) {
    let characters = data;

    return {type: GetTwoCharactersSuccess, characters};

}

export function getTwoCharactersFail() {
    toastr.error(errorMessage);

}

export function voteFail(errorMessage) {
    return (dispatch, getState)=>{
        dispatch(toastr.error(errorMessage));
    }

    //toastr.error(errorMessage);
    //return {};

}

export function getTwoCharacters() {
    return (dispatch, getState)=> {
        $.ajax({url: '/api/characters'})
            .done(data => {
                dispatch(getTwoCharactersSuccess(data));
            })
            .fail(jqXhr => {
                dispatch(getTwoCharactersFail(jqXhr.responseJSON.message));
            });
    }
}

export function vote(winner, loser) {
    return (dispatch, getState)=> {
        $.ajax({
            type: 'PUT',
            url: '/api/characters',
            data: {winner: winner, loser: loser}
        })
            .done(() => {
                dispatch(getTwoCharacters());
            })
            .fail((jqXhr) => {
                dispatch(voteFail(jqXhr.responseJSON.message))
            });
    }
}