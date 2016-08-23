/**
 * Created by liujinhe on 16/8/15.
 */


export const GetStatsSuccess='GetStatsSuccess';

export function getStatsSuccess(stats){

    return {type:GetStatsSuccess,stats};
}

export function excStatsSuccess(data) {
    //assign(this, data);

    return (dispatch,getState)=>{
        let {statsProps}=getState();
        console.log('excStatsSuccess    ----statsProps'+statsProps);

        let stats=Object.assign({},statsProps, data);

        dispatch(getStatsSuccess(stats));

    }

}

export function getStatsFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
}

export function   getStats() {
    return (dispatch,getState)=>{
        $.ajax({ url: '/api/stats' })
            .done((data) => {
                dispatch(excStatsSuccess(data));
            })
            .fail((jqXhr) => {
                dispatch(getStatsFail(jqXhr));
            });
    }


}