/**
 * Created by liujinhe on 16/8/11.
 */
import {assign, contains} from 'underscore';
//import $ from 'jquery';


export function reportSuccess() {

    return (dispatch, getState)=> {

        let {characterProps} = getState();

        characterProps.isReported = true;
        let localData = localStorage.getItem('NEF') ? JSON.parse(localStorage.getItem('NEF')) : {};
        localData.reports = localData.reports || [];
        localData.reports.push(characterProps.characterId);
        localStorage.setItem('NEF', JSON.stringify(localData));
        toastr.warning('Character has been reported.');

        //dispatch(()=> {
        //    return {type: ReportSuccess, characterProps};
        //})

        return {type: ReportSuccess, characterProps};

    }


}

export function reportFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);

}

function applyCharacterSuccess(characterProps) {
    console.log('applyCharacterSuccess    ------:' + characterProps.characterId + '' + characterProps.gender + '' + characterProps.random + '' + characterProps.bloodline, 'color:red');

    return {type: GetCharacterSuccess, characterProps}
}

export function getCharacterSuccess(data) {

    return (dispatch, getState)=> {

        let {characterProps} = getState();
        characterProps=Object.assign(characterProps, data);

        $(document.body).attr('class', 'profile ' + characterProps.race.toLowerCase());
        let localData = localStorage.getItem('NEF') ? JSON.parse(localStorage.getItem('NEF')) : {};
        let reports = localData.reports || [];
        characterProps.isReported = contains(reports, characterProps.characterId);
        // If is NaN (from division by zero) then set it to "0"
        characterProps.winLossRatio = ((characterProps.wins / (characterProps.wins + characterProps.losses) * 100) || 0).toFixed(1);

        dispatch(
            applyCharacterSuccess(characterProps)
        );

    }


    //console.log('getCharacterSuccess    ------:'+data.characterId+''+data.gender+''+data.random+''+data.bloodline);
    //
    //return {type: GetCharacterSuccess, data}

}


export const ReportSuccess = 'ReportSuccess';
export const GetCharacterSuccess = 'GetCharacterSuccess';


export function getCharacterFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);

}

export function getCharacter(characterId) {

    console.log("%c getCharacter  characterId:" + characterId, "color:blue");

    return (dispatch, getState)=> {
        $.ajax({type: 'GET', url: '/api/characters/' + characterId})
            .done((data) => {
                dispatch(getCharacterSuccess(data));

            })
            .fail((jqXhr) => {
                dispatch(getCharacterFail(jqXhr));

            });
    }
}

export function report(characterId) {
    console.log('report     ----' + characterId);

    return (dispatch, getState)=> {
        $.ajax({
            type: 'POST',
            url: '/api/report',
            data: {characterId: characterId}
        })
            .done(() => {
                dispatch(reportSuccess());
            })
            .fail((jqXhr) => {
                dispatch(reportFail(jqXhr));
            });
    }
}