/**
 * Created by liujinhe on 16/8/10.
 */



export function addCharacter(name, gender){


    console.log('addCharacter name           ----'+name);
    console.log('addCharacter gender           ----'+gender);


    return (dispatch,getState)=>{

        $.ajax({
            type: 'POST',
            url: '/api/characters',
            data: { name: name, gender: gender }
        })
            .done((data) => {
                dispatch(addCharacterSuccess(data.message));
            })
            .fail((jqXhr) => {
                dispatch(addCharacterFail(jqXhr.responseJSON.message));
            });

    }
}

export const AddCharacterSuccess='AddCharacterSuccess';
export const AddCharacterFail='AddCharacterFail';
export const UpdateName='UpdateName';
export const UpdateGender='UpdateGender';
export const InvalidName='InvalidName';
export const InvalidGender='InvalidGender';

export function addCharacterSuccess(successMessage){
    let nameValidationState = 'has-success';
    let helpBlock = successMessage;

    return {type:AddCharacterSuccess,nameValidationState,helpBlock};

}

export function addCharacterFail(errorMessage){

    let nameValidationState = 'has-error';
    let helpBlock = errorMessage;

    return {type :AddCharacterFail,nameValidationState,helpBlock};

}

export function updateName(event){

    let name = event.target.value;
    let nameValidationState = '';
    let helpBlock = '';


    return {type:UpdateName,name,nameValidationState,helpBlock};
}

export function updateGender(event){
    let gender = event.target.value;
    let genderValidationState = '';


    return {type:UpdateGender,gender,genderValidationState}
}

export function invalidName(){
    let nameValidationState = 'has-error';
    let helpBlock = 'Please enter a character name.';

    return {type:InvalidName,nameValidationState,helpBlock};
}

export function invalidGender(){
    let genderValidationState = 'has-error';
    let helpBlock = 'Please choose a correct gender.';


    return {type:InvalidGender,genderValidationState};
}